'use client'

import { useActionState, useState } from 'react'
import { ndryshoNjoftimin } from '@/app/actions/profil'
import { KATEGORITË, KATEGORI_MAP, MARKAT_MAKINA, MARKAT_MOTOCIKLETA, QYTETET_SHQIPERI, QYTETET_KOSOVE } from '@/lib/kategori-data'

type Listing = {
  id: string
  title: string
  category: string
  subcategory: string
  marka: string
  description: string
  price: number
  city: string
}

export default function NdyshoForm({ listing }: { listing: Listing }) {
  const action = ndryshoNjoftimin.bind(null, listing.id)
  const [state, formAction, pending] = useActionState(action, { error: '' })
  const [selectedCategory, setSelectedCategory] = useState(listing.category)
  const [selectedSubcategory, setSelectedSubcategory] = useState(listing.subcategory)
  const nenkategori = KATEGORI_MAP[selectedCategory]?.nenkategori ?? []
  const isMoto = selectedSubcategory === 'Motorçikleta' || selectedSubcategory === 'Pjesë motorçiklete'

  return (
    <section style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>

      {state.error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: '#c0392b' }}>
          {state.error}
        </div>
      )}

      <form action={formAction}>

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '20px' }}>Informacioni bazë</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Titulli i njoftimit *</label>
            <input
              name="title"
              type="text"
              defaultValue={listing.title}
              required
              style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Kategoria *</label>
            <select
              name="category"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              required
              style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
            >
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
              <select name="marka" defaultValue={listing.marka}
                style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                <option value="">Zgjidh markën (opsionale)</option>
                {(isMoto ? MARKAT_MOTOCIKLETA : MARKAT_MAKINA).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '0' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Përshkrimi *</label>
            <textarea
              name="description"
              defaultValue={listing.description}
              rows={5}
              required
              style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '20px' }}>Çmimi dhe vendndodhja</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Çmimi (€) *</label>
              <input
                name="price"
                type="number"
                defaultValue={listing.price}
                required
                min="0"
                style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Qyteti *</label>
              <select
                name="city"
                defaultValue={listing.city}
                required
                style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
              >
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

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="/profil"
            style={{ flex: 1, background: '#fff', color: '#111', border: '1.5px solid #ddd', padding: '14px', fontSize: '15px', fontWeight: '500', borderRadius: '8px', textDecoration: 'none', textAlign: 'center' }}
          >
            Anulo
          </a>
          <button
            type="submit"
            disabled={pending}
            style={{ flex: 2, background: pending ? '#999' : '#E24B4A', color: '#fff', border: 'none', padding: '14px', fontSize: '15px', fontWeight: '500', borderRadius: '8px', cursor: pending ? 'not-allowed' : 'pointer' }}
          >
            {pending ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
          </button>
        </div>

      </form>
    </section>
  )
}
