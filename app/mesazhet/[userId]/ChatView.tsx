'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORY_ICON } from '@/lib/kategori-data'

type Message = {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  file_url: string | null
  file_type: string | null
  read: boolean
  created_at: string
}

type Njoftim = {
  id: string
  title: string
  price: number
  category: string
  city: string
}

type PendingFile = {
  file: File
  previewUrl: string
  isImage: boolean
}

const MAX_IMAGE_BYTES = 20 * 1024 * 1024 // 20 MB
const MAX_PDF_BYTES   = 50 * 1024 * 1024 // 50 MB
const ALLOWED_TYPES   = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']

function isImageType(fileType: string | null | undefined): boolean {
  if (!fileType) return false
  // Handle both 'image' (from mobile app) and 'image/jpeg' etc (from web)
  return fileType === 'image' || fileType.startsWith('image/')
}

export default function ChatView({
  initialMessages,
  currentUserId,
  otherUserId,
  njoftimId,
  njoftim,
}: {
  initialMessages: Message[]
  currentUserId: string
  otherUserId: string
  njoftimId: string | null
  njoftim: Njoftim | null
}) {
  const [messages, setMessages]       = useState<Message[]>(initialMessages)
  const [content, setContent]         = useState('')
  const [sending, setSending]         = useState(false)
  const [fileError, setFileError]     = useState('')
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])

  const bottomRef  = useRef<HTMLDivElement>(null)
  const imageRef   = useRef<HTMLInputElement>(null)
  const pdfRef     = useRef<HTMLInputElement>(null)
  const supabase   = useMemo(() => createClient(), [])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      pendingFiles.forEach(pf => URL.revokeObjectURL(pf.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${[currentUserId, otherUserId].sort().join('-')}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mesazhet' },
        (payload) => {
          const msg = payload.new as Message
          const isThisChat =
            (msg.sender_id === otherUserId && msg.receiver_id === currentUserId) ||
            (msg.sender_id === currentUserId && msg.receiver_id === otherUserId)
          if (isThisChat) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev
              return [...prev, msg]
            })
          }
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase, currentUserId, otherUserId])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── File select → only preview, no upload yet ─────────────────
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ''
    setFileError('')

    const newPending: PendingFile[] = []
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFileError('Lloji i skedarit nuk pranohet. Lejohen: JPG, PNG, WebP, GIF, PDF.')
        continue
      }
      const isPdf = file.type === 'application/pdf'
      const maxBytes = isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES
      if (file.size > maxBytes) {
        setFileError(isPdf
          ? 'PDF-i është shumë i madh. Maksimumi 50 MB.'
          : 'Foto është shumë e madhe. Maksimumi 20 MB.'
        )
        continue
      }
      newPending.push({
        file,
        previewUrl: URL.createObjectURL(file),
        isImage: !isPdf,
      })
    }
    if (newPending.length > 0) {
      setPendingFiles(prev => [...prev, ...newPending])
    }
  }

  function removePendingFile(index: number) {
    setPendingFiles(prev => {
      URL.revokeObjectURL(prev[index].previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  // ── Upload a single file and return its public URL ────────────
  async function uploadFile(pf: PendingFile): Promise<string> {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg', 'image/png': 'png',
      'image/webp': 'webp', 'image/gif': 'gif',
      'application/pdf': 'pdf',
    }
    const ext  = mimeToExt[pf.file.type] ?? 'bin'
    const path = `${currentUserId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from('chat-files')
      .upload(path, pf.file, { contentType: pf.file.type })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage.from('chat-files').getPublicUrl(path)
    return publicUrl
  }

  // ── Send: upload pending files + text ─────────────────────────
  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = content.trim()
    if ((!trimmed && pendingFiles.length === 0) || sending) return

    setSending(true)
    setFileError('')

    // 1. Upload + insert each pending file
    for (const pf of pendingFiles) {
      try {
        const publicUrl = await uploadFile(pf)
        URL.revokeObjectURL(pf.previewUrl)

        const { data, error } = await supabase
          .from('mesazhet')
          .insert({
            sender_id: currentUserId,
            receiver_id: otherUserId,
            content: '',
            njoftim_id: njoftimId ?? null,
            file_url: publicUrl,
            file_type: pf.file.type,
          })
          .select()
          .single()

        if (error) {
          console.error('[chat-upload] insert error:', error.message)
          setFileError(`Gabim gjatë dërgimit: ${error.message}`)
        } else if (data) {
          setMessages(prev => prev.some(m => m.id === data.id) ? prev : [...prev, data])
        }
      } catch (err: any) {
        console.error('[chat-upload] upload error:', err.message)
        const msg = err.message?.includes('security policy')
          ? 'Nuk jeni i autentikuar. Hyni në llogari për të ngarkuar skedarë.'
          : `Gabim ngarkimi: ${err.message}`
        setFileError(msg)
      }
    }
    setPendingFiles([])

    // 2. Send text message (with optimistic update)
    if (trimmed) {
      const optimisticId = `opt-${crypto.randomUUID()}`
      const optimistic: Message = {
        id: optimisticId,
        sender_id: currentUserId,
        receiver_id: otherUserId,
        content: trimmed,
        file_url: null,
        file_type: null,
        read: false,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, optimistic])
      setContent('')

      const { data, error } = await supabase
        .from('mesazhet')
        .insert({
          sender_id: currentUserId,
          receiver_id: otherUserId,
          content: trimmed,
          njoftim_id: njoftimId ?? null,
        })
        .select()
        .single()

      if (error) {
        setMessages(prev => prev.filter(m => m.id !== optimisticId))
        setContent(trimmed)
      } else {
        setMessages(prev => prev.map(m => (m.id === optimisticId ? data : m)))
      }
    }

    setSending(false)
  }

  const canSend = (content.trim().length > 0 || pendingFiles.length > 0) && !sending

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>

      {/* ── Njoftim Banner ── */}
      {njoftim && (
        <a
          href={`/njoftim/${njoftim.id}`}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 20px',
            background: '#FFF5F5',
            borderBottom: '1px solid rgba(218,41,28,0.15)',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: '#fff', border: '1px solid rgba(218,41,28,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0,
          }}>
            {CATEGORY_ICON(njoftim.category)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', fontWeight: '600' }}>
              Për njoftimin
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1D1D1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {njoftim.title}
            </div>
            <div style={{ fontSize: '12px', color: '#DA291C', fontWeight: '600' }}>
              {njoftim.price.toLocaleString('de-DE')} € · {njoftim.city}
            </div>
          </div>
          <span style={{ fontSize: '12px', color: '#DA291C', flexShrink: 0, fontWeight: '600' }}>Shiko →</span>
        </a>
      )}

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px', display: 'flex',
        flexDirection: 'column', gap: '8px',
        background: '#F5F5F7',
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#86868B', fontSize: '14px', marginTop: '48px', fontWeight: '500' }}>
            Fillo bisedën duke dërguar mesazhin e parë.
          </div>
        )}
        {messages.map((msg) => {
          const isMe   = msg.sender_id === currentUserId
          // Detect image by file_type OR by URL extension (fallback for app messages
          // where file_type may be 'image', 'image/jpeg', or the URL ends in .jpg/.png etc.)
          const urlExt = msg.file_url?.split('?')[0].split('.').pop()?.toLowerCase() ?? ''
          const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif']
          const isImg  = !!msg.file_url && (isImageType(msg.file_type) || imageExts.includes(urlExt))
          const isPdf  = !!msg.file_url && (msg.file_type === 'application/pdf' || urlExt === 'pdf')

          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '68%',
                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: isMe ? '#DA291C' : '#fff',
                color: isMe ? '#fff' : '#1D1D1F',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                opacity: msg.id.startsWith('opt-') ? 0.65 : 1,
                overflow: 'hidden',
              }}>

                {/* Image attachment */}
                {isImg && msg.file_url && (
                  <a href={msg.file_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={msg.file_url}
                      alt="foto"
                      style={{
                        display: 'block',
                        maxWidth: '260px',
                        maxHeight: '260px',
                        objectFit: 'cover',
                        width: '100%',
                      }}
                    />
                  </a>
                )}

                {/* PDF attachment */}
                {isPdf && msg.file_url && (
                  <a
                    href={msg.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '14px 16px',
                      textDecoration: 'none',
                      color: isMe ? '#fff' : '#1D1D1F',
                    }}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      background: isMe ? 'rgba(255,255,255,0.2)' : '#FFF5F5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', flexShrink: 0,
                    }}>
                      📄
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>Dokument PDF</div>
                      <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>Kliko për ta hapur</div>
                    </div>
                  </a>
                )}

                {/* Text content — skip for image/file messages (content is the filename, not a caption) */}
                {msg.content && !msg.file_url && (
                  <div style={{ padding: '11px 15px', fontSize: '14px', lineHeight: '1.5', fontWeight: '400' }}>
                    {msg.content}
                  </div>
                )}

                {/* Timestamp */}
                <div suppressHydrationWarning style={{
                  fontSize: '10px', opacity: 0.6, textAlign: 'right',
                  padding: (msg.content && !isImg && !isPdf) ? '0 14px 8px' : '4px 12px 8px',
                  fontWeight: '500',
                }}>
                  {new Date(msg.created_at).toLocaleTimeString('sq', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── File error ── */}
      {fileError && (
        <div style={{
          padding: '10px 20px', background: '#FFF5F5',
          borderTop: '1px solid rgba(218,41,28,0.15)',
          fontSize: '13px', color: '#DA291C',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontWeight: '500',
        }}>
          <span>{fileError}</span>
          <button
            onClick={() => setFileError('')}
            style={{ background: 'none', border: 'none', color: '#DA291C', cursor: 'pointer', fontSize: '16px', padding: '0 4px', fontFamily: 'inherit' }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Pending files preview ── */}
      {pendingFiles.length > 0 && (
        <div style={{
          padding: '10px 16px',
          background: '#fff',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}>
          {pendingFiles.map((pf, i) => (
            <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
              {pf.isImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={pf.previewUrl}
                  alt=""
                  style={{
                    width: '80px', height: '80px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    display: 'block',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                />
              ) : (
                <div style={{
                  width: '80px', height: '80px', borderRadius: '10px',
                  background: '#F5F5F7', border: '1px solid rgba(0,0,0,0.08)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '4px',
                }}>
                  <span style={{ fontSize: '26px' }}>📄</span>
                  <span style={{
                    fontSize: '9px', color: '#86868B',
                    maxWidth: '68px', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    textAlign: 'center', padding: '0 4px',
                  }}>
                    {pf.file.name}
                  </span>
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePendingFile(i)}
                style={{
                  position: 'absolute', top: '-7px', right: '-7px',
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: '#1D1D1F', border: '2px solid #fff',
                  color: '#fff', fontSize: '13px', fontWeight: '700',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1, padding: 0, fontFamily: 'inherit',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Input bar ── */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '12px 16px',
          borderTop: pendingFiles.length > 0 ? 'none' : '1px solid rgba(0,0,0,0.07)',
          background: '#fff',
          display: 'flex', gap: '8px', alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {/* Hidden input — images only */}
        <input
          ref={imageRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {/* Hidden input — PDF only */}
        <input
          ref={pdfRef}
          type="file"
          accept="application/pdf"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        {/* Image button */}
        <button
          type="button"
          onClick={() => imageRef.current?.click()}
          disabled={sending}
          title="Shto foto"
          style={{
            background: '#F5F5F7',
            border: '1.5px solid rgba(0,0,0,0.1)',
            borderRadius: '50%',
            width: '40px', height: '40px',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: sending ? 'not-allowed' : 'pointer',
            color: '#6E6E73',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="48" y="112" width="416" height="320" rx="48" ry="48" stroke="currentColor" strokeWidth="32" strokeLinejoin="round" fill="none"/>
            <circle cx="256" cy="272" r="80" stroke="currentColor" strokeWidth="32" fill="none"/>
            <path d="M160 112l32-48h128l32 48" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>

        {/* PDF button */}
        <button
          type="button"
          onClick={() => pdfRef.current?.click()}
          disabled={sending}
          title="Shto PDF"
          style={{
            background: '#F5F5F7',
            border: '1.5px solid rgba(0,0,0,0.1)',
            borderRadius: '50%',
            width: '40px', height: '40px',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: sending ? 'not-allowed' : 'pointer',
            color: '#6E6E73',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M208 352c0 44.183 35.817 80 80 80s80-35.817 80-80V166a54 54 0 00-108 0v168a28 28 0 0056 0V190" stroke="currentColor" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>

        {/* Text input */}
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && canSend) {
              e.preventDefault()
              handleSend(e as any)
            }
          }}
          placeholder="Shkruaj mesazhin..."
          disabled={sending}
          style={{
            flex: 1,
            border: '1.5px solid rgba(0,0,0,0.1)',
            borderRadius: '24px',
            padding: '11px 18px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: '#F5F5F7',
            color: '#1D1D1F',
            fontFamily: 'inherit',
          }}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!canSend}
          style={{
            background: '#DA291C',
            color: '#fff',
            border: 'none',
            borderRadius: '24px',
            padding: '11px 22px',
            fontSize: '14px',
            cursor: canSend ? 'pointer' : 'not-allowed',
            opacity: canSend ? 1 : 0.45,
            fontWeight: '600',
            flexShrink: 0,
            fontFamily: 'inherit',
            letterSpacing: '-0.1px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          {sending ? (
            <div style={{
              width: '14px', height: '14px',
              border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
          ) : null}
          Dërgo
        </button>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
