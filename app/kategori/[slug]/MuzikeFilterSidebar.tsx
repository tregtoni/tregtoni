'use client'

import { useState, useEffect } from 'react'
import { QYTETET, RENDITJA } from '@/lib/kategori-data'

// ─── Filter data ──────────────────────────────────────────────────────────────

const GJENDJA = [
  { v: 'e_re',       l: 'E re' },
  { v: 'si_e_re',    l: 'Si e re' },
  { v: 'mire',       l: 'Mirë' },
  { v: 'me_defekte', l: 'Me defekte' },
]

const LLOJI_INSTRUMENTE = [
  { v: 'kitare',  l: 'Kitarë' },
  { v: 'piano',   l: 'Piano' },
  { v: 'violine', l: 'Violinë' },
  { v: 'bateri',  l: 'Bateri' },
  { v: 'flaut',   l: 'Flaut' },
  { v: 'tjera',   l: 'Tjera' },
]

const GJUHA = [
  { v: 'shqip',       l: 'Shqip' },
  { v: 'anglisht',    l: 'Anglisht' },
  { v: 'gjermanisht', l: 'Gjermanisht' },
  { v: 'tjera',       l: 'Tjera' },
]

const LLOJI_LIBRA = [
  { v: 'letersi',  l: 'Letërsi' },
  { v: 'shkence',  l: 'Shkencë' },
  { v: 'histori',  l: 'Histori' },
  { v: 'femije',   l: 'Fëmijë' },
  { v: 'tjera',    l: 'Tjera' },
]

const ZHANRI_CD = [
  { v: 'pop',     l: 'Pop' },
  { v: 'rock',    l: 'Rock' },
  { v: 'hiphop',  l: 'Hip-Hop' },
  { v: 'klasike', l: 'Klasike' },
  { v: 'folk',    l: 'Folk' },
  { v: 'tjera',   l: 'Tjera' },
]

const ZHANRI_FILM = [
  { v: 'aksion',     l: 'Aksion' },
  { v: 'komedi',     l: 'Komedi' },
  { v: 'drame',      l: 'Dramë' },
  { v: 'dokumentar', l: 'Dokumentar' },
  { v: 'animacion',  l: 'Animacion' },
  { v: 'tjera',      l: 'Tjera' },
]

const LLOJI_KANCELARI = [
  { v: 'shkolla', l: 'Shkolla' },
  { v: 'zyre',    l: 'Zyrë' },
  { v: 'art',     l: 'Art' },
  { v: 'tjera',   l: 'Tjera' },
]

// ─── Shared styles ────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'

const inputSt: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  border: '1.5px solid rgba(0,0,0,0.1)',
  borderRadius: '8px',
  padding: '8px 10px',
  fontSize: '13px',
  color: '#1D1D1F',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: FONT,
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function ChipSelect({ name, options, value }: { name: string; options: { v: string; l: string }[]; value?: string }) {
  const [selected, setSelected] = useState<string | undefined>(value)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {options.map(opt => {
        const active = selected === opt.v
        return (
          <label key={opt.v} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              name={name}
              value={opt.v}
              checked={active}
              onChange={() => setSelected(opt.v)}
              style={{ display: 'none' }}
            />
            <span style={{
              padding: '5px 11px', borderRadius: '20px', fontSize: '12px',
              fontWeight: active ? '600' : '500',
              color: active ? '#DA291C' : '#1D1D1F',
              background: active ? '#FFF5F5' : '#F5F5F7',
              border: `1.5px solid ${active ? 'rgba(218,41,28,0.35)' : 'rgba(0,0,0,0.08)'}`,
              whiteSpace: 'nowrap', userSelect: 'none',
            }}>
              {opt.l}
            </span>
          </label>
        )
      })}
    </div>
  )
}

function Divider() {
  return <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', margin: '4px 0 20px' }} />
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type MuzikeFilters = {
  zustand?: string
  muzike_lloji?: string
  muzike_zhanri?: string
  gjuha?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  muzikeFilters: MuzikeFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MuzikeFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  muzikeFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const mf = muzikeFilters

  const isInstrumente = nenkategoria === 'Instrumente muzikore'
  const isLibra       = nenkategoria === 'Libra & Revista'
  const isCD          = nenkategoria === 'Muzikë & CD'
  const isFilm        = nenkategoria === 'Film & DVD'
  const isKancelari   = nenkategoria === 'Kancelari'
  const isKomiks      = nenkategoria === 'Komiks'

  const hasGjuha = isLibra || isFilm || isKomiks

  return (
    <div style={{ fontFamily: FONT }}>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(o => !o)}
        style={{
          width: '100%', background: '#fff',
          border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '12px',
          padding: '11px 16px', fontSize: '14px', fontWeight: '600',
          color: '#1D1D1F', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: FONT, marginBottom: mobileOpen ? '10px' : '0',
        }}
      >
        <span>Filtrat</span>
        <span style={{ fontSize: '11px', color: '#86868B' }}>{mobileOpen ? '▲' : '▼'}</span>
      </button>

      {mobileOpen && (
        <form
          action={`/kategori/${slug}`}
          method="GET"
          style={{
            background: '#fff', borderRadius: '14px', overflow: 'hidden',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ padding: '16px' }}>

            {nenkategoria && <input type="hidden" name="nenkategoria" value={nenkategoria} />}

            {/* ── GJENDJA ── */}
            <FilterSection title="Gjendja">
              <ChipSelect name="zustand" options={GJENDJA} value={mf.zustand} />
            </FilterSection>

            <Divider />

            {/* ── SUBCATEGORY-SPECIFIC ── */}

            {isInstrumente && (
              <>
                <FilterSection title="Lloji">
                  <select name="muzike_lloji" defaultValue={mf.muzike_lloji ?? ''} style={inputSt}>
                    <option value="">Të gjitha</option>
                    {LLOJI_INSTRUMENTE.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </FilterSection>
                <Divider />
              </>
            )}

            {isLibra && (
              <>
                <FilterSection title="Gjuha">
                  <ChipSelect name="gjuha" options={GJUHA} value={mf.gjuha} />
                </FilterSection>
                <FilterSection title="Lloji">
                  <ChipSelect name="muzike_lloji" options={LLOJI_LIBRA} value={mf.muzike_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isCD && (
              <>
                <FilterSection title="Zhanri">
                  <ChipSelect name="muzike_zhanri" options={ZHANRI_CD} value={mf.muzike_zhanri} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isFilm && (
              <>
                <FilterSection title="Zhanri">
                  <ChipSelect name="muzike_zhanri" options={ZHANRI_FILM} value={mf.muzike_zhanri} />
                </FilterSection>
                <FilterSection title="Gjuha">
                  <ChipSelect name="gjuha" options={GJUHA} value={mf.gjuha} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isKancelari && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="muzike_lloji" options={LLOJI_KANCELARI} value={mf.muzike_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isKomiks && (
              <>
                <FilterSection title="Gjuha">
                  <ChipSelect name="gjuha" options={GJUHA} value={mf.gjuha} />
                </FilterSection>
                <Divider />
              </>
            )}

            {/* ── ÇMIMI ── */}
            <FilterSection title="Çmimi (€)">
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input name="cmimi_min" type="number" defaultValue={cmimi_min ?? ''} placeholder="Min" style={inputSt} />
                <span style={{ color: '#86868B', fontSize: '12px', flexShrink: 0 }}>–</span>
                <input name="cmimi_max" type="number" defaultValue={cmimi_max ?? ''} placeholder="Max" style={inputSt} />
              </div>
            </FilterSection>

            <Divider />

            {/* ── QYTETI ── */}
            <FilterSection title="Qyteti">
              <select name="qyteti" defaultValue={qyteti ?? ''} style={inputSt}>
                <option value="">Të gjitha qytetet</option>
                {QYTETET.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </FilterSection>

            {/* ── RENDITJA ── */}
            <FilterSection title="Renditja">
              <select name="rendit" defaultValue={rendit ?? ''} style={inputSt}>
                {RENDITJA.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </FilterSection>

          </div>

          {/* Submit + Clear */}
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button type="submit" style={{
              width: '100%', background: '#DA291C', color: '#fff', border: 'none',
              padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', fontFamily: FONT,
            }}>
              Apliko filtrat
            </button>
            {hasFilters && (
              <a href={clearUrl} style={{
                display: 'block', textAlign: 'center', color: '#86868B',
                fontSize: '12px', textDecoration: 'none', padding: '4px', fontFamily: FONT,
              }}>
                Pastro filtrat
              </a>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
