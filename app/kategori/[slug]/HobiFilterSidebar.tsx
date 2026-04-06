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

const LLOJI_ARTISTE = [
  { v: 'kengatar', l: 'Këngëtar' },
  { v: 'muzikant', l: 'Muzikant' },
  { v: 'band',     l: 'Band' },
  { v: 'dj',       l: 'DJ' },
  { v: 'tjera',    l: 'Tjera' },
]

const LLOJI_HUMBUR = [
  { v: 'i_humbur', l: 'I humbur' },
  { v: 'i_gjetur', l: 'I gjetur' },
]

const LLOJI_SPORTI = [
  { v: 'futboll',  l: 'Futboll' },
  { v: 'basketboll', l: 'Basketboll' },
  { v: 'tenis',    l: 'Tenis' },
  { v: 'natacion', l: 'Natacion' },
  { v: 'kampim',   l: 'Kampim' },
  { v: 'hiking',   l: 'Hiking' },
  { v: 'tjera',    l: 'Tjera' },
]

const LLOJI_PUNE_DORE = [
  { v: 'thurje',   l: 'Thurje' },
  { v: 'qendisje', l: 'Qëndisje' },
  { v: 'pikture',  l: 'Pikturë' },
  { v: 'skulpture', l: 'Skulpturë' },
  { v: 'tjera',    l: 'Tjera' },
]

const LLOJI_USHQIM = [
  { v: 'ushqim_shtepiak', l: 'Ushqim shtëpiak' },
  { v: 'pije',            l: 'Pije' },
  { v: 'embelsira',       l: 'Ëmbëlsira' },
  { v: 'tjera',           l: 'Tjera' },
]

const PERIUDHA_ANTIKA = [
  { v: 'para_1900',  l: 'Para 1900' },
  { v: '1900_1950',  l: '1900–1950' },
  { v: '1950_2000',  l: '1950–2000' },
  { v: 'pas_2000',   l: 'Pas 2000' },
]

const LLOJI_TREG = [
  { v: 'veshje',    l: 'Veshje' },
  { v: 'mobilje',   l: 'Mobilje' },
  { v: 'libra',     l: 'Libra' },
  { v: 'elektronike', l: 'Elektronikë' },
  { v: 'tjera',     l: 'Tjera' },
]

const LLOJI_KOLEKSIONE = [
  { v: 'pullat',   l: 'Pullat' },
  { v: 'monedha',  l: 'Monedha' },
  { v: 'kartolina', l: 'Kartolina' },
  { v: 'figurina', l: 'Figurina' },
  { v: 'tjera',    l: 'Tjera' },
]

const LLOJI_AKTIVITETE = [
  { v: 'ne_natyre', l: 'Në natyrë' },
  { v: 'ne_salle',  l: 'Në sallë' },
  { v: 'online',    l: 'Online' },
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

export type HobiFilters = {
  zustand?: string
  hobi_lloji?: string
  hobi_periudha?: string
  destinacioni?: string
  hobi_date_nga?: string
  hobi_date_deri?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  hobiFilters: HobiFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HobiFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  hobiFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const hf = hobiFilters

  const isArtiste    = nenkategoria === 'Artistë & Muzikantë'
  const isUdhetim    = nenkategoria === 'Udhëtim & Evente'
  const isHumbur     = nenkategoria === 'Humbur & Gjetur'
  const isSporti     = nenkategoria === 'Sport & Kampim'
  const isPuneDore   = nenkategoria === 'Punë dore & Art'
  const isUshqim     = nenkategoria === 'Ushqim & Pije'
  const isAntika     = nenkategoria === 'Art & Antika'
  const isTreg       = nenkategoria === 'Treg i vjetër'
  const isKoleksione = nenkategoria === 'Koleksione'
  const isAktivitete = nenkategoria === 'Aktivitete'

  const showGjendja = !isUdhetim && !isHumbur && !isArtiste && !isAktivitete

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

            {/* ── GJENDJA (global, except irrelevant subcategories) ── */}
            {showGjendja && (
              <>
                <FilterSection title="Gjendja">
                  <ChipSelect name="zustand" options={GJENDJA} value={hf.zustand} />
                </FilterSection>
                <Divider />
              </>
            )}

            {/* ── SUBCATEGORY-SPECIFIC ── */}

            {isArtiste && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="hobi_lloji" options={LLOJI_ARTISTE} value={hf.hobi_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isUdhetim && (
              <>
                <FilterSection title="Destinacioni">
                  <input
                    name="destinacioni"
                    type="text"
                    defaultValue={hf.destinacioni ?? ''}
                    placeholder="p.sh. Tiranë, Paris..."
                    style={inputSt}
                  />
                </FilterSection>
                <FilterSection title="Data">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#86868B', marginBottom: '4px' }}>Data nga</div>
                      <input
                        name="hobi_date_nga"
                        type="date"
                        defaultValue={hf.hobi_date_nga ?? ''}
                        style={inputSt}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#86868B', marginBottom: '4px' }}>Data deri</div>
                      <input
                        name="hobi_date_deri"
                        type="date"
                        defaultValue={hf.hobi_date_deri ?? ''}
                        style={inputSt}
                      />
                    </div>
                  </div>
                </FilterSection>
                <Divider />
              </>
            )}

            {isHumbur && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="hobi_lloji" options={LLOJI_HUMBUR} value={hf.hobi_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isSporti && (
              <>
                <FilterSection title="Lloji i sportit">
                  <select name="hobi_lloji" defaultValue={hf.hobi_lloji ?? ''} style={inputSt}>
                    <option value="">Të gjitha</option>
                    {LLOJI_SPORTI.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </FilterSection>
                <Divider />
              </>
            )}

            {isPuneDore && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="hobi_lloji" options={LLOJI_PUNE_DORE} value={hf.hobi_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isUshqim && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="hobi_lloji" options={LLOJI_USHQIM} value={hf.hobi_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isAntika && (
              <>
                <FilterSection title="Periudha">
                  <ChipSelect name="hobi_periudha" options={PERIUDHA_ANTIKA} value={hf.hobi_periudha} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isTreg && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="hobi_lloji" options={LLOJI_TREG} value={hf.hobi_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isKoleksione && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="hobi_lloji" options={LLOJI_KOLEKSIONE} value={hf.hobi_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isAktivitete && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="hobi_lloji" options={LLOJI_AKTIVITETE} value={hf.hobi_lloji} />
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

            {/* ── QYTETI (always, but Humbur & Gjetur uses it as a key filter) ── */}
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
