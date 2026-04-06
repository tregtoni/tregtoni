'use client'

import { useState, useEffect } from 'react'
import { QYTETET, RENDITJA } from '@/lib/kategori-data'

// ─── Filter data ──────────────────────────────────────────────────────────────

const GJINIA = [
  { v: 'mashkull',  l: 'Mashkull' },
  { v: 'femer',     l: 'Femër' },
  { v: 'nuk_dihet', l: 'Nuk dihet' },
]

const MOSHA = [
  { v: 'kelysh',   l: 'Këlysh / Fole' },
  { v: '1-6muaj',  l: '1–6 muaj' },
  { v: '6-12muaj', l: '6–12 muaj' },
  { v: '1-3vjec',  l: '1–3 vjeç' },
  { v: '3plus',    l: '3+ vjeç' },
]

const ME_ORIGJINE = [
  { v: 'po', l: 'Po' },
  { v: 'jo', l: 'Jo' },
]

const LLOJI_KUAJ = [
  { v: 'sport',      l: 'Sport' },
  { v: 'pune',       l: 'Punë' },
  { v: 'rekreacion', l: 'Rekreacion' },
]

const LLOJI_BUJQESORE = [
  { v: 'lope',  l: 'Lopë' },
  { v: 'dele',  l: 'Dele' },
  { v: 'dhi',   l: 'Dhi' },
  { v: 'derr',  l: 'Derr' },
  { v: 'pule',  l: 'Pulë' },
  { v: 'tjera', l: 'Tjera' },
]

const LLOJI_KUJDES = [
  { v: 'veteriner', l: 'Veteriner' },
  { v: 'grooming',  l: 'Grooming' },
  { v: 'strehim',   l: 'Strehim' },
  { v: 'stervitje', l: 'Stërvitje' },
]

const LLOJI_AKSESORE = [
  { v: 'ushqim', l: 'Ushqim' },
  { v: 'veshje', l: 'Veshje' },
  { v: 'kafaz',  l: 'Kafaz' },
  { v: 'lodra',  l: 'Lodra' },
  { v: 'tjera',  l: 'Tjera' },
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

export type KafsheFilters = {
  gjinia?: string
  mosha?: string
  raca?: string
  me_origjine?: string
  kafshe_lloji?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  kafsheFilters: KafsheFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function KafsheFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  kafsheFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const kf = kafsheFilters

  const isQenMace     = nenkategoria === 'Qen' || nenkategoria === 'Mace'
  const isKuaj        = nenkategoria === 'Kuaj'
  const hasRaca       = isQenMace || isKuaj
  const isFreeText    = nenkategoria === 'Peshq' || nenkategoria === 'Zogj' || nenkategoria === 'Kafshë të vogla'
  const isBujqesore   = nenkategoria === 'Kafshë bujqësore'
  const isKujdes      = nenkategoria === 'Kujdes kafshësh'
  const isAksesore    = nenkategoria === 'Aksesore për kafshë'

  const llojiOpt = isKuaj ? LLOJI_KUAJ
    : isBujqesore ? LLOJI_BUJQESORE
    : isKujdes    ? LLOJI_KUJDES
    : isAksesore  ? LLOJI_AKSESORE
    : null

  const llojiTitle = isKujdes ? 'Lloji i shërbimit' : isAksesore ? 'Lloji i aksesorit' : 'Lloji'

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

            {/* ── GJINIA ── */}
            <FilterSection title="Gjinia">
              <ChipSelect name="gjinia" options={GJINIA} value={kf.gjinia} />
            </FilterSection>

            {/* ── MOSHA ── */}
            <FilterSection title="Mosha">
              <ChipSelect name="mosha" options={MOSHA} value={kf.mosha} />
            </FilterSection>

            {/* ── RACA (Qen, Mace, Kuaj) ── */}
            {hasRaca && (
              <>
                <Divider />
                <FilterSection title="Raca">
                  <input
                    name="raca"
                    type="text"
                    defaultValue={kf.raca ?? ''}
                    placeholder="p.sh. Labrador, Siamese..."
                    style={inputSt}
                  />
                </FilterSection>
              </>
            )}

            {/* ── ME ORIGJINË (Qen, Mace) ── */}
            {isQenMace && (
              <FilterSection title="Me origjinë">
                <ChipSelect name="me_origjine" options={ME_ORIGJINE} value={kf.me_origjine} />
              </FilterSection>
            )}

            {/* ── LLOJI (structured options) ── */}
            {llojiOpt && (
              <>
                <Divider />
                <FilterSection title={llojiTitle}>
                  <ChipSelect name="kafshe_lloji" options={llojiOpt} value={kf.kafshe_lloji} />
                </FilterSection>
              </>
            )}

            {/* ── LLOJI (free text: Peshq, Zogj, Kafshë të vogla) ── */}
            {isFreeText && (
              <>
                <Divider />
                <FilterSection title="Lloji">
                  <input
                    name="kafshe_lloji"
                    type="text"
                    defaultValue={kf.kafshe_lloji ?? ''}
                    placeholder="p.sh. Papagall, Ari i artë..."
                    style={inputSt}
                  />
                </FilterSection>
              </>
            )}

            <Divider />

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
