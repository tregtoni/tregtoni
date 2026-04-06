'use client'

import { useActionState } from 'react'
import { ndryshoEmrin } from '@/app/actions/profil'
import { QYTETET_SHQIPERI, QYTETET_KOSOVE } from '@/lib/kategori-data'

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid rgba(0,0,0,0.1)',
  borderRadius: '10px',
  padding: '12px 14px',
  fontSize: '14px',
  color: '#1D1D1F',
  backgroundColor: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
}

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
    <div style={{
      background: '#fff',
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.05)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <h2 style={{
        fontSize: '17px',
        fontWeight: '700',
        color: '#1D1D1F',
        marginBottom: '24px',
        letterSpacing: '-0.3px',
      }}>
        Ndrysho të dhënat
      </h2>

      {state.success && (
        <div style={{
          background: '#F0FFF4',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#16a34a',
          fontWeight: '500',
        }}>
          Të dhënat u ruajtën me sukses.
        </div>
      )}
      {state.error && (
        <div style={{
          background: '#FFF5F5',
          border: '1px solid rgba(218,41,28,0.2)',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#DA291C',
          fontWeight: '500',
        }}>
          {state.error}
        </div>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Emri i plotë *
          </label>
          <input
            name="emri"
            type="text"
            defaultValue={emriAktual}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Telefoni{' '}
            <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: '#86868B' }}>(opsional)</span>
          </label>
          <input
            name="telefon"
            type="tel"
            defaultValue={telefonAktual}
            placeholder="+355 6X XXX XXXX"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Qyteti{' '}
            <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: '#86868B' }}>(opsional)</span>
          </label>
          <select name="qyteti" defaultValue={qytetiAktual} style={inputStyle}>
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
          style={{
            background: pending ? '#999' : '#DA291C',
            color: '#fff',
            border: 'none',
            padding: '13px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: pending ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {pending ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
        </button>
      </form>
    </div>
  )
}
