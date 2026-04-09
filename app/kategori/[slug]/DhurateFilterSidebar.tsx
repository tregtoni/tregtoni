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

const MOSHA = [
  { v: 'femije',     l: 'Fëmijë' },
  { v: 'te_rinj',    l: 'Të rinj' },
  { v: 'te_rritur',  l: 'Të rritur' },
  { v: 'te_moshuar', l: 'Të moshuar' },
]

const GJINIA = [
  { v: 'mashkull', l: 'Mashkull' },
  { v: 'femer',    l: 'Femër' },
  { v: 'uniseks',  l: 'Uniseks' },
]

const LLOJI_SHKEMBIM = [
  { v: 'veshje',     l: 'Veshje' },
  { v: 'elektronike', l: 'Elektronikë' },
  { v: 'libra',      l: 'Libra' },
  { v: 'aksesore',   l: 'Aksesore' },
  { v: 'tjera',      l: 'Tjera' },
]

const KOHEZGJATJA = [
  { v: '1_7_dite',  l: '1–7 ditë' },
  { v: '1_4_jave',  l: '1–4 javë' },
  { v: '1_3_muaj',  l: '1–3 muaj' },
  { v: 'tjera',     l: 'Tjera' },
]

const KATEGORIA_DHURATE = [
  { v: 'veshje',     l: 'Veshje' },
  { v: 'elektronike', l: 'Elektronikë' },
  { v: 'lodra',      l: 'Lodra' },
  { v: 'libra',      l: 'Libra' },
  { v: 'aksesore',   l: 'Aksesore' },
  { v: 'tjera',      l: 'Tjera' },
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
          <label key={opt.v} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); setSelected(active ? undefined : opt.v) }}>
            <input
              type="radio"
              name={name}
              value={opt.v}
              checked={active}
              onChange={() => {}}
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

export type DhurateFilters = {
  zustand?: string
  mosha?: string
  gjinia?: string
  dhurate_lloji?: string
  dhurate_kohezgjatja?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  dhurateFilters: DhurateFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DhurateFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  dhurateFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const df = dhurateFilters

  const isShkembim = nenkategoria === 'Shkëmbim'
  const isHuazim   = nenkategoria === 'Huazim'
  const isDhurate  = nenkategoria === 'Dhuratë'

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
              <ChipSelect name="zustand" options={GJENDJA} value={df.zustand} />
            </FilterSection>

            <Divider />

            {/* ── MOSHA ── */}
            <FilterSection title="Mosha">
              <ChipSelect name="mosha" options={MOSHA} value={df.mosha} />
            </FilterSection>

            {/* ── GJINIA ── */}
            <FilterSection title="Gjinia">
              <ChipSelect name="gjinia" options={GJINIA} value={df.gjinia} />
            </FilterSection>

            <Divider />

            {/* ── SUBCATEGORY-SPECIFIC ── */}

            {isShkembim && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="dhurate_lloji" options={LLOJI_SHKEMBIM} value={df.dhurate_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isHuazim && (
              <>
                <FilterSection title="Kohëzgjatja">
                  <ChipSelect name="dhurate_kohezgjatja" options={KOHEZGJATJA} value={df.dhurate_kohezgjatja} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isDhurate && (
              <>
                <FilterSection title="Kategoria">
                  <ChipSelect name="dhurate_lloji" options={KATEGORIA_DHURATE} value={df.dhurate_lloji} />
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
