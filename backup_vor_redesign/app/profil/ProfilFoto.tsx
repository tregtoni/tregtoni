'use client'

import { useRef, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ndryshoAvatarin } from '@/app/actions/profil'

export default function ProfilFoto({
  initials,
  avatarUrl,
}: {
  initials: string
  avatarUrl: string
}) {
  const [preview, setPreview]   = useState(avatarUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const fileRef                 = useRef<HTMLInputElement>(null)
  const [, startTransition]     = useTransition()

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
    setPreview(publicUrl)

    const fd = new FormData()
    fd.append('avatar_url', publicUrl)
    startTransition(() => {
      ndryshoAvatarin({ error: '', success: false, url: '' }, fd)
    })
    setUploading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      {/* Avatar */}
      <div style={{ position: 'relative', width: '88px', height: '88px' }}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Foto profili"
            style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #E24B4A' }}
          />
        ) : (
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: '#E24B4A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700' }}>
            {initials}
          </div>
        )}
        {/* Upload overlay */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          title="Ndrysho foton"
          style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '28px', height: '28px', borderRadius: '50%',
            background: '#111', color: '#fff', border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', cursor: uploading ? 'not-allowed' : 'pointer', padding: 0,
          }}
        >
          {uploading ? (
            <div style={{ width: '10px', height: '10px', border: '2px solid #666', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          ) : '✏️'}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      <span style={{ fontSize: '11px', color: '#999' }}>JPG, PNG, WebP · max 5 MB</span>

      {error && (
        <div style={{ fontSize: '12px', color: '#c0392b', textAlign: 'center', maxWidth: '200px' }}>{error}</div>
      )}
    </div>
  )
}
