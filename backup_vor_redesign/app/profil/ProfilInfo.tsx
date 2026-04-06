'use client'

import { useActionState } from 'react'
import { ndryshoEmrin } from '@/app/actions/profil'
import { QYTETET_SHQIPERI, QYTETET_KOSOVE } from '@/lib/kategori-data'

export default function ProfilInfo({
  emriAktual,
  telefonAktual,
  qytetiAktual,
}: {
  emriAktual: string
  telefonAktual: string
  qytetiAktual: string
}) {
  const [state, formAction, pending] = useActionState(ndryshoEmrin, { error: '', success: false })

  return (
    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '20px' }}>
        Ndrysho të dhënat
      </h2>

      {state.success && (
        <div style={{ background: '#f0fff4', border: '1px solid #b7ebc8', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#1a7340' }}>
          Të dhënat u ruajtën me sukses.
        </div>
      )}
      {state.error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#c0392b' }}>
          {state.error}
        </div>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Emri i plotë *</label>
          <input
            name="emri"
            type="text"
            defaultValue={emriAktual}
            required
            style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>
            Telefoni <span style={{ fontSize: '11px', color: '#999', fontWeight: '400' }}>(opsional)</span>
          </label>
          <input
            name="telefon"
            type="tel"
            defaultValue={telefonAktual}
            placeholder="+355 6X XXX XXXX"
            style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>
            Qyteti <span style={{ fontSize: '11px', color: '#999', fontWeight: '400' }}>(opsional)</span>
          </label>
          <select
            name="qyteti"
            defaultValue={qytetiAktual}
            style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
          >
            <option value="">Zgjidh qytetin</option>
            <optgroup label="Shqipëri">
              {QYTETET_SHQIPERI.map(q => <option key={q} value={q}>{q}</option>)}
            </optgroup>
            <optgroup label="Kosovë">
              {QYTETET_KOSOVE.map(q => <option key={q} value={q}>{q}</option>)}
            </optgroup>
          </select>
        </div>

        <button
          type="submit"
          disabled={pending}
          style={{ background: pending ? '#999' : '#E24B4A', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: pending ? 'not-allowed' : 'pointer' }}
        >
          {pending ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
        </button>
      </form>
    </div>
  )
}
