'use client'

import { useState } from 'react'
import { dergeMeldimin } from '@/app/actions/meldungen'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'

const KATEGORITE = [
  { v: 'spam',      l: 'Spam ose Reklamë' },
  { v: 'mashtrim',  l: 'Mashtrim / Fake' },
  { v: 'cmim',      l: 'Çmim ose informacion i gabuar' },
  { v: 'ndaluar',   l: 'Përmbajtje e ndaluar' },
  { v: 'ngacmim',   l: 'Ngacmim ose sjellje e papërshtatshme' },
  { v: 'tjeter',    l: 'Tjetër' },
]

type Props = {
  anzeige_id?: string
  nutzer_id?: string
}

export default function MeldeModal({ anzeige_id, nutzer_id }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | undefined>()
  const [freitext, setFreitext] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | undefined>()

  function handleOpen(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
    setSuccess(false)
    setSelected(undefined)
    setFreitext('')
    setError(undefined)
  }

  function handleClose(e?: React.MouseEvent) {
    e?.preventDefault()
    e?.stopPropagation()
    setOpen(false)
  }

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!selected) { setError('Zgjidh një kategori.'); return }
    setLoading(true)
    setError(undefined)
    try {
      await dergeMeldimin({
        anzeige_id,
        gemeldeter_nutzer_id: nutzer_id,
        verstoss_kategoria: selected,
        freitext: freitext.trim() || undefined,
      })
      setSuccess(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gabim i panjohur'
      setError(msg === 'Jo i autorizuar' ? 'Duhet të hysh për të raportuar.' : 'Ndodhi një gabim. Provo përsëri.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Flag trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        title="Raporto njoftimin"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#86868B',
          borderRadius: '6px',
          lineHeight: 1,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
          <line x1="4" y1="22" x2="4" y2="15"/>
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT,
          }}
        >
          {/* Modal */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '28px 28px 24px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
              margin: '0 16px',
            }}
          >
            {success ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '14px' }}>✅</div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '6px' }}>
                  Raporti u dërgua
                </div>
                <div style={{ fontSize: '14px', color: '#6E6E73', marginBottom: '24px' }}>
                  Faleminderit! Do ta shqyrtojmë sa më shpejt.
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    background: '#F5F5F7',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '11px 28px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1D1D1F',
                    cursor: 'pointer',
                    fontFamily: FONT,
                  }}
                >
                  Mbyll
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '4px' }}>
                  Raporto njoftimin
                </div>
                <div style={{ fontSize: '13px', color: '#6E6E73', marginBottom: '20px' }}>
                  Zgjidh arsyen e raportimit
                </div>

                {/* Category chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {KATEGORITE.map(k => {
                    const active = selected === k.v
                    return (
                      <button
                        key={k.v}
                        type="button"
                        onClick={e => { e.stopPropagation(); setSelected(active ? undefined : k.v) }}
                        style={{
                          padding: '7px 13px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: active ? '600' : '500',
                          color: active ? '#DA291C' : '#1D1D1F',
                          background: active ? '#FFF5F5' : '#F5F5F7',
                          border: `1.5px solid ${active ? 'rgba(218,41,28,0.35)' : 'rgba(0,0,0,0.08)'}`,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          fontFamily: FONT,
                        }}
                      >
                        {k.l}
                      </button>
                    )
                  })}
                </div>

                {/* Free text */}
                <textarea
                  value={freitext}
                  onChange={e => setFreitext(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  placeholder="Përshkruaj shkeljen (opsionale)..."
                  rows={3}
                  style={{
                    width: '100%',
                    border: '1.5px solid rgba(0,0,0,0.12)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    color: '#1D1D1F',
                    background: '#fff',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: FONT,
                    boxSizing: 'border-box',
                    marginBottom: '6px',
                  }}
                />

                {error && (
                  <div style={{ fontSize: '12px', color: '#DA291C', marginBottom: '12px' }}>{error}</div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={handleClose}
                    style={{
                      flex: 1,
                      background: '#F5F5F7',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1D1D1F',
                      cursor: 'pointer',
                      fontFamily: FONT,
                    }}
                  >
                    Anulo
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      flex: 1,
                      background: loading ? '#e88' : '#DA291C',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#fff',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontFamily: FONT,
                    }}
                  >
                    {loading ? 'Duke dërguar...' : 'Raporto'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
