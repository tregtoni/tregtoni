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

const MAX_IMAGE_BYTES = 20 * 1024 * 1024 // 20 MB
const MAX_PDF_BYTES   = 50 * 1024 * 1024 // 50 MB

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
  const [messages, setMessages]     = useState<Message[]>(initialMessages)
  const [content, setContent]       = useState('')
  const [sending, setSending]       = useState(false)
  const [fileError, setFileError]   = useState('')
  const [uploading, setUploading]   = useState(false)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const fileRef    = useRef<HTMLInputElement>(null)
  const supabase   = useMemo(() => createClient(), [])

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

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed || sending) return

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

    setSending(true)
    setMessages((prev) => [...prev, optimistic])
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
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
    } else {
      setMessages((prev) => prev.map((m) => (m.id === optimisticId ? data : m)))
    }
    setSending(false)
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileRef.current) fileRef.current.value = ''
    setFileError('')

    const isPdf = file.type === 'application/pdf'
    const maxBytes = isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES
    if (file.size > maxBytes) {
      setFileError(isPdf
        ? 'PDF-i është shumë i madh. Maksimumi është 50 MB.'
        : 'Foto është shumë e madhe. Maksimumi është 20 MB.'
      )
      return
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
    if (!allowed.includes(file.type)) {
      setFileError('Lloji i skedarit nuk pranohet. Lejohen: JPG, PNG, WebP, GIF, PDF.')
      return
    }

    setUploading(true)
    const ext  = file.name.split('.').pop() ?? 'bin'
    const path = `${currentUserId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('chat-files')
      .upload(path, file, { contentType: file.type })

    if (uploadErr) {
      console.error('[chat-upload] storage error:', uploadErr.message)
      setFileError(
        uploadErr.message.includes('security policy')
          ? 'Nuk jeni i autentikuar. Hyni në llogari për të ngarkuar skedarë.'
          : `Gabim ngarkimi: ${uploadErr.message}`
      )
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('chat-files').getPublicUrl(path)

    // Optimistic insert
    const optimisticId = `opt-${crypto.randomUUID()}`
    const optimistic: Message = {
      id: optimisticId,
      sender_id: currentUserId,
      receiver_id: otherUserId,
      content: '',
      file_url: publicUrl,
      file_type: file.type,
      read: false,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])

    const { data, error } = await supabase
      .from('mesazhet')
      .insert({
        sender_id: currentUserId,
        receiver_id: otherUserId,
        content: '',
        njoftim_id: njoftimId ?? null,
        file_url: publicUrl,
        file_type: file.type,
      })
      .select()
      .single()

    if (error) {
      console.error('[chat-upload] insert error:', error.code, error.message)
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
      setFileError(
        error.message.includes('file_url')
          ? 'Kolona "file_url" mungon në tabelë. Ekzekutoni SQL-in e migrimit.'
          : `Gabim gjatë dërgimit: ${error.message}`
      )
    } else {
      setMessages((prev) => prev.map((m) => (m.id === optimisticId ? data : m)))
    }
    setUploading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

      {/* Njoftim Banner */}
      {njoftim && (
        <a
          href={`/njoftim/${njoftim.id}`}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 16px', background: '#fff8f5',
            borderBottom: '2px solid #fde0d8', textDecoration: 'none', flexShrink: 0,
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '8px',
            background: '#fff', border: '1px solid #fde0d8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', flexShrink: 0,
          }}>
            {CATEGORY_ICON(njoftim.category)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
              Për njoftimin
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {njoftim.title}
            </div>
            <div style={{ fontSize: '12px', color: '#E24B4A', fontWeight: '600' }}>
              {njoftim.price.toLocaleString('de-DE')} € · 📍 {njoftim.city}
            </div>
          </div>
          <span style={{ fontSize: '12px', color: '#E24B4A', flexShrink: 0, fontWeight: '500' }}>Shiko →</span>
        </a>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#f9f9f9' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginTop: '40px' }}>
            Fillo bisedën duke dërguar mesazhin e parë.
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId
          const isImage = msg.file_type?.startsWith('image/')
          const isPdf   = msg.file_type === 'application/pdf'

          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%',
                borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: isMe ? '#E24B4A' : '#fff',
                color: isMe ? '#fff' : '#111',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                opacity: msg.id.startsWith('opt-') ? 0.7 : 1,
                overflow: 'hidden',
              }}>
                {/* Image attachment */}
                {isImage && msg.file_url && (
                  <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={msg.file_url}
                      alt="foto"
                      style={{ display: 'block', maxWidth: '260px', maxHeight: '260px', objectFit: 'cover', width: '100%' }}
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
                      padding: '12px 14px', textDecoration: 'none',
                      color: isMe ? '#fff' : '#111',
                    }}
                  >
                    <span style={{
                      fontSize: '28px', flexShrink: 0,
                      background: isMe ? 'rgba(255,255,255,0.2)' : '#fff0f0',
                      borderRadius: '8px', padding: '6px', lineHeight: 1,
                    }}>📄</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>Dokument PDF</div>
                      <div style={{ fontSize: '11px', opacity: 0.75, marginTop: '2px' }}>Kliko për ta hapur</div>
                    </div>
                  </a>
                )}

                {/* Text content */}
                {msg.content && (
                  <div style={{ padding: '10px 14px', fontSize: '14px', lineHeight: '1.5' }}>
                    {msg.content}
                  </div>
                )}

                {/* Timestamp */}
                <div suppressHydrationWarning style={{
                  fontSize: '10px', opacity: 0.65, textAlign: 'right',
                  padding: msg.content ? '0 14px 8px' : '4px 10px 8px',
                }}>
                  {new Date(msg.created_at).toLocaleTimeString('sq', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* File error */}
      {fileError && (
        <div style={{
          padding: '8px 16px', background: '#fff0f0', borderTop: '1px solid #fcc',
          fontSize: '12px', color: '#c0392b', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{fileError}</span>
          <button onClick={() => setFileError('')} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }}>×</button>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{ padding: '12px 16px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}
      >
        {/* File button */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          title="Dërgo foto ose PDF"
          style={{
            background: uploading ? '#f5f5f5' : '#f5f5f5',
            border: '1.5px solid #ddd', borderRadius: '50%',
            width: '40px', height: '40px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer', fontSize: '16px',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = '#E24B4A' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd' }}
        >
          {uploading ? (
            <div style={{ width: '14px', height: '14px', border: '2px solid #ccc', borderTopColor: '#E24B4A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          ) : '📎'}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Shkruaj mesazhin..."
          style={{
            flex: 1, border: '1.5px solid #ddd', borderRadius: '24px',
            padding: '10px 16px', fontSize: '14px', outline: 'none',
            backgroundColor: '#fff', color: '#111',
          }}
        />
        <button
          type="submit"
          disabled={!content.trim() || sending}
          style={{
            background: '#E24B4A', color: '#fff', border: 'none',
            borderRadius: '24px', padding: '10px 20px', fontSize: '14px',
            cursor: content.trim() && !sending ? 'pointer' : 'not-allowed',
            opacity: content.trim() && !sending ? 1 : 0.5,
            fontWeight: '500', flexShrink: 0,
          }}
        >
          Dërgo
        </button>
      </form>
    </div>
  )
}
