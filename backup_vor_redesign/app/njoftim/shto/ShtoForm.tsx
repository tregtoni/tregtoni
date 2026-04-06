'use client'

import { useActionState, useState, useRef } from 'react'
import { shtoNjoftim } from '@/app/actions/njoftimet'
import { createClient } from '@/lib/supabase/client'
import { KATEGORITË, KATEGORI_MAP, MARKAT_MAKINA, MARKAT_MOTOCIKLETA, QYTETET_SHQIPERI, QYTETET_KOSOVE } from '@/lib/kategori-data'

type ImageEntry = { id: string; preview: string; url: string | null }

export default function ShtoForm() {
  const [state, formAction, pending] = useActionState(shtoNjoftim, { error: '' })
  const [images, setImages] = useState<ImageEntry[]>([])
  const [uploadError, setUploadError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const nenkategori = selectedCategory ? (KATEGORI_MAP[selectedCategory]?.nenkategori ?? []) : []
  const isMoto = selectedSubcategory === 'Motorçikleta' || selectedSubcategory === 'Pjesë motorçiklete'

  const isUploading = images.some(img => img.url === null)

  async function handleFiles(files: FileList | null) {
    if (!files) return
    const remaining = 5 - images.length
    if (remaining <= 0) return
    const selected = Array.from(files).slice(0, remaining)
    setUploadError('')
    const supabase = createClient()

    for (const file of selected) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const preview = URL.createObjectURL(file)
      setImages(prev => [...prev, { id, preview, url: null }])

      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${id}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('njoftimet-images')
        .upload(path, file, { contentType: file.type })

      if (uploadErr) {
        setImages(prev => prev.filter(img => img.id !== id))
        URL.revokeObjectURL(preview)
        console.error('[upload] storage error:', uploadErr.message)
        setUploadError(
          uploadErr.message.includes('security policy')
            ? 'Nuk jeni i autentikuar. Hyni në llogari për të ngarkuar foto.'
            : `Gabim ngarkimi: ${uploadErr.message}`
        )
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('njoftimet-images')
        .getPublicUrl(path)

      setImages(prev =>
        prev.map(img => img.id === id ? { ...img, url: publicUrl } : img)
      )
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeImage(id: string) {
    setImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img) URL.revokeObjectURL(img.preview)
      return prev.filter(i => i.id !== id)
    })
  }

  return (
    <section style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>

      {(state.error || uploadError) && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: '#c0392b' }}>
          {state.error || uploadError}
        </div>
      )}

      <form action={formAction}>

        {/* URL-të e imazheve të ngarkuara */}
        {images.filter(img => img.url).map(img => (
          <input key={img.id} type="hidden" name="image_url" value={img.url!} />
        ))}

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '20px' }}>Informacioni bazë</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Titulli i njoftimit *</label>
            <input name="title" type="text" placeholder="p.sh. BMW 320d 2018, ngjyrë e zezë" required style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Kategoria *</label>
            <select
              name="category"
              required
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
            >
              <option value="">Zgjidh kategorinë</option>
              {KATEGORITË.map(k => (
                <option key={k.slug} value={k.slug}>{k.icon} {k.shortName}</option>
              ))}
            </select>
          </div>

          {nenkategori.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Nënkategoria</label>
              <select
                name="subcategory"
                value={selectedSubcategory}
                onChange={e => setSelectedSubcategory(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="">Zgjidh nënkategorinë (opsionale)</option>
                {nenkategori.filter(n => n !== 'Marka').map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}

          {selectedCategory === 'makina' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>
                {isMoto ? 'Marka e motorçikletës' : 'Marka e makinës'}
              </label>
              <select name="marka" style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                <option value="">Zgjidh markën (opsionale)</option>
                {(isMoto ? MARKAT_MOTOCIKLETA : MARKAT_MAKINA).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Përshkrimi *</label>
            <textarea name="description" placeholder="Përshkruaj njoftimin tënd në detaje..." rows={5} required style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '20px' }}>Çmimi dhe vendndodhja</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Çmimi (€) *</label>
              <input name="price" type="number" placeholder="0" required min="0" style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Qyteti *</label>
              <select name="city" required style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                <option value="">Zgjidh qytetin</option>
                <optgroup label="Shqipëri">
                  {QYTETET_SHQIPERI.map(q => <option key={q} value={q}>{q}</option>)}
                </optgroup>
                <optgroup label="Kosovë">
                  {QYTETET_KOSOVE.map(q => <option key={q} value={q}>{q}</option>)}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Seksioni i fotove */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '4px' }}>Foto</h2>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px', paddingLeft: '13px' }}>Deri në 5 foto · PNG, JPG</p>

          {/* Parapamja e imazheve */}
          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '12px' }}>
              {images.map((img, idx) => (
                <div key={img.id} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: idx === 0 ? '2px solid #E24B4A' : '1px solid #eee' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {idx === 0 && (
                    <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#E24B4A', color: '#fff', fontSize: '9px', padding: '2px 5px', borderRadius: '3px', fontWeight: '600' }}>KRYESORJA</span>
                  )}
                  {img.url === null && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0 }}
                  >×</button>
                </div>
              ))}
            </div>
          )}

          {/* Zona e ngarkimit */}
          {images.length < 5 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: '2px dashed #ddd', borderRadius: '8px', padding: '28px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#E24B4A')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#ddd')}
            >
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>📷</div>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '3px' }}>Kliko për të ngarkuar foto</p>
              <p style={{ fontSize: '11px', color: '#bbb' }}>PNG, JPG deri në 10MB · {5 - images.length} foto mbetur</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        <button
          type="submit"
          disabled={pending || isUploading}
          style={{ width: '100%', background: (pending || isUploading) ? '#999' : '#E24B4A', color: '#fff', border: 'none', padding: '16px', fontSize: '16px', fontWeight: '500', borderRadius: '8px', cursor: (pending || isUploading) ? 'not-allowed' : 'pointer' }}
        >
          {isUploading ? 'Duke ngarkuar fotot...' : pending ? 'Duke publikuar...' : 'Publiko njoftimin falas'}
        </button>

      </form>
    </section>
  )
}
