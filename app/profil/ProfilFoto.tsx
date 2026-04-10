'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ndryshoAvatarin } from '@/app/actions/profil'

export default function ProfilFoto({
  initials,
  avatarUrl,
}: {
  initials: string
  avatarUrl: string
}) {
  const [preview, setPreview]     = useState(avatarUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const fileRef                   = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileRef.current) fileRef.current.value = ''
    setError('')

    if (file.size > 5 * 1024 * 1024) {
      setError('Foto duhet të jetë më e vogël se 5 MB.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Lejohen vetëm JPG, PNG, WebP.')
      return
    }

    setUploading(true)
    const supabase = createClient()
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { contentType: file.type, upsert: true })

    if (upErr) {
      setError(`Gabim ngarkimi: ${upErr.message}`)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)

    const fd = new FormData()
    fd.append('avatar_url', publicUrl)
    const result = await ndryshoAvatarin({ error: '', success: false, url: '' }, fd)

    if (result.error) {
      setError(result.error)
      setUploading(false)
      return
    }

    setPreview(publicUrl)
    setUploading(false)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ position: 'relative', width: '88px', height: '88px' }}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Foto profili"
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #DA291C',
            }}
          />
        ) : (
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            background: '#DA291C',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: '700',
          }}>
            {initials}
          </div>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          title="Ndrysho foton"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#1D1D1F',
            color: '#fff',
            border: '2.5px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            padding: 0,
            fontFamily: 'inherit',
          }}
        >
          {uploading ? (
            <div style={{
              width: '10px',
              height: '10px',
              border: '2px solid #666',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
          ) : '✎'}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      <span style={{ fontSize: '11px', color: '#86868B', fontWeight: '500' }}>
        JPG, PNG, WebP · max 5 MB
      </span>

      {error && (
        <div style={{
          fontSize: '12px',
          color: '#DA291C',
          textAlign: 'center',
          maxWidth: '200px',
          lineHeight: '1.4',
          fontWeight: '500',
        }}>
          {error}
        </div>
      )}
    </div>
  )
}
