'use client'

import { useActionState } from 'react'
import { ndryshoEmrin } from '@/app/actions/profil'
import { QYTETET_SHQIPERI, QYTETET_KOSOVE } from '@/lib/kategori-data'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

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
  fontFamily: FONT,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: '#86868B',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

export default function ProfilInfo({
  emriAktual,
  telefonAktual,
  qytetiAktual,
  bioAktual,
  zeigeTelefonAktual,
  zeigeQytetiAktual,
  kontoTypAktual,
  firmaNameAktual,
  adresaAktuale,
  websiteAktual,
  beschreibungFirmaAktual,
}: {
  emriAktual: string
  telefonAktual: string
  qytetiAktual: string
  bioAktual: string
  zeigeTelefonAktual: boolean
  zeigeQytetiAktual: boolean
  kontoTypAktual: string
  firmaNameAktual: string
  adresaAktuale: string
  websiteAktual: string
  beschreibungFirmaAktual: string
}) {
  const [state, formAction, pending] = useActionState(ndryshoEmrin, { error: '', success: false })
  const isBusiness = kontoTypAktual === 'biznes'

  return (
    <div style={{
      background: '#fff', borderRadius: '20px', padding: '28px',
      boxShadow: '0 1px 10px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)',
      fontFamily: FONT,
    }}>
      <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
        Ndrysho të dhënat
      </h2>

      {state.success && (
        <div style={{
          background: '#F0FFF4', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '10px', padding: '12px 14px', marginBottom: '16px',
          fontSize: '14px', color: '#16a34a', fontWeight: '500',
        }}>
          Të dhënat u ruajtën me sukses.
        </div>
      )}
      {state.error && (
        <div style={{
          background: '#FFF5F5', border: '1px solid rgba(218,41,28,0.2)',
          borderRadius: '10px', padding: '12px 14px', marginBottom: '16px',
          fontSize: '14px', color: RED, fontWeight: '500',
        }}>
          {state.error}
        </div>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Business fields — shown only for business accounts, type is fixed at registration */}
        {isBusiness && (
          <div style={{
            background: '#FAFAFA', borderRadius: '14px',
            padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px',
            border: '1px solid rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Të dhënat e biznesit
            </div>

            <div>
              <label style={labelStyle}>Emri i firmës *</label>
              <input name="firma_name" type="text" defaultValue={firmaNameAktual}
                placeholder="p.sh. Auto Shpresa SH.P.K." required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Adresa{' '}
                <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: '#86868B' }}>(opsional)</span>
              </label>
              <input name="adresa" type="text" defaultValue={adresaAktuale}
                placeholder="Rruga, Qyteti" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Website{' '}
                <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: '#86868B' }}>(opsional)</span>
              </label>
              <input name="website" type="url" defaultValue={websiteAktual}
                placeholder="https://firma-juaj.al" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Përshkrimi i biznesit{' '}
                <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: '#86868B' }}>(opsional)</span>
              </label>
              <textarea
                name="beschreibung_firma"
                defaultValue={beschreibungFirmaAktual}
                placeholder="Pak fjalë rreth biznesit tuaj..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.55', minHeight: '80px' }}
              />
            </div>
          </div>
        )}

        {/* Name */}
        <div>
          <label style={labelStyle}>
            {isBusiness ? 'Emri i kontaktit' : 'Emri i plotë'} *
          </label>
          <input name="emri" type="text" defaultValue={emriAktual} required style={inputStyle} />
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle}>
            Telefoni{' '}
            <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: '#86868B' }}>(opsional)</span>
          </label>
          <input name="telefon" type="tel" defaultValue={telefonAktual} placeholder="+355 6X XXX XXXX" style={inputStyle} />
        </div>

        {/* City */}
        <div>
          <label style={labelStyle}>
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

        {/* Bio */}
        <div>
          <label style={labelStyle}>
            Bio{' '}
            <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: '#86868B' }}>(opsional)</span>
          </label>
          <textarea
            name="bio"
            defaultValue={bioAktual}
            placeholder="Pak fjalë rreth vetes ose biznesit tuaj..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.55', minHeight: '80px' }}
          />
        </div>

        {/* Privacy settings */}
        <div style={{ background: '#F5F5F7', borderRadius: '14px', padding: '18px 20px' }}>
          <div style={{
            fontSize: '12px', fontWeight: '700', color: '#86868B',
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px',
          }}>
            Privatësia
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox" name="zeige_qyteti" defaultChecked={zeigeQytetiAktual}
                style={{ width: '16px', height: '16px', accentColor: RED, cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontSize: '14px', color: '#1D1D1F', fontWeight: '500' }}>Shfaq qytetin në profil publik</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox" name="zeige_telefon" defaultChecked={zeigeTelefonAktual}
                style={{ width: '16px', height: '16px', accentColor: RED, cursor: 'pointer', flexShrink: 0 }}
              />
              <span style={{ fontSize: '14px', color: '#1D1D1F', fontWeight: '500' }}>Shfaq numrin e telefonit në profil publik</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          style={{
            background: pending ? '#999' : RED,
            color: '#fff', border: 'none', padding: '13px',
            borderRadius: '12px', fontSize: '14px', fontWeight: '600',
            cursor: pending ? 'not-allowed' : 'pointer', fontFamily: FONT,
          }}
        >
          {pending ? 'Duke ruajtur...' : 'Ruaj ndryshimet'}
        </button>
      </form>
    </div>
  )
}
