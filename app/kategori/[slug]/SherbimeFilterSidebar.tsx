'use client'

import { useState, useEffect } from 'react'
import { QYTETET, RENDITJA } from '@/lib/kategori-data'

// ─── Filter data ──────────────────────────────────────────────────────────────

const ANGEBOTSTYP = [
  { v: 'oferta',  l: 'Ofertë' },
  { v: 'kerkesa', l: 'Kërkesë' },
]

const OFRUESI = [
  { v: 'privat',  l: 'Privat' },
  { v: 'tregtar', l: 'Tregtar' },
]

const LLOJI_PER_NEN: Record<string, { v: string; l: string }[]> = {
  'Zhvendosje & Transport': [
    { v: 'zhvendosje',  l: 'Zhvendosje' },
    { v: 'transport',   l: 'Transport mallrash' },
    { v: 'transferte',  l: 'Transfertë' },
    { v: 'tjeter',      l: 'Të tjera' },
  ],
  'Artistë & Muzikantë': [
    { v: 'muzikant',   l: 'Muzikant' },
    { v: 'fotograf',   l: 'Fotograf' },
    { v: 'videograf',  l: 'Videograf' },
    { v: 'dj',         l: 'DJ' },
    { v: 'kengëtar',   l: 'Këngëtar' },
    { v: 'aktor',      l: 'Aktor' },
    { v: 'orkester',   l: 'Orkester dasmash' },
    { v: 'tjeter',     l: 'Të tjera' },
  ],
  'Udhëtime & Evente': [
    { v: 'evente',    l: 'Organizim eventesh' },
    { v: 'dasma',     l: 'Dasma' },
    { v: 'udhetim',   l: 'Udhëtim' },
    { v: 'hotele',    l: 'Hotele' },
    { v: 'tjeter',    l: 'Të tjera' },
  ],
  'Auto & Biçikleta': [
    { v: 'riparim',  l: 'Riparim' },
    { v: 'servis',   l: 'Servis' },
    { v: 'larje',    l: 'Larje' },
    { v: 'tjeter',   l: 'Të tjera' },
  ],
  'Kujdes kafshësh': [
    { v: 'veteriner', l: 'Veteriner' },
    { v: 'rruajtje',  l: 'Rruajtje' },
    { v: 'strehim',   l: 'Strehim' },
    { v: 'shetitje',  l: 'Shëtitje' },
    { v: 'tjeter',    l: 'Të tjera' },
  ],
  'Kujdes fëmijësh': [
    { v: 'kujdestare', l: 'Kujdestare' },
    { v: 'cerdhe',     l: 'Çerdhe' },
    { v: 'mesues',     l: 'Mësues privat' },
    { v: 'tjeter',     l: 'Të tjera' },
  ],
  'Kujdes pleqsh': [
    { v: 'shtepie',  l: 'Kujdes në shtëpi' },
    { v: 'qender',   l: 'Qendër kujdesi' },
    { v: 'tjeter',   l: 'Të tjera' },
  ],
  'Shtëpi & Kopsht': [
    { v: 'pastrimi',  l: 'Pastrimi' },
    { v: 'riparime',  l: 'Riparime' },
    { v: 'kopshtari', l: 'Kopshtari' },
    { v: 'tjeter',    l: 'Të tjera' },
  ],
  'Elektronik': [
    { v: 'riparim',  l: 'Riparim' },
    { v: 'instalim', l: 'Instalim' },
    { v: 'tjeter',   l: 'Të tjera' },
  ],
}

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

export type SherbimeFilters = {
  lloji_sherbimi?: string
  angebotstyp?: string
  ofruesi?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  sherbimeFilters: SherbimeFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SherbimeFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  sherbimeFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const sf = sherbimeFilters
  const llojiOpt = nenkategoria ? LLOJI_PER_NEN[nenkategoria] : undefined

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

            {llojiOpt && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="lloji_sherbimi" options={llojiOpt} value={sf.lloji_sherbimi} />
                </FilterSection>
                <Divider />
              </>
            )}

            <FilterSection title="Lloji i ofertës">
              <ChipSelect name="angebotstyp" options={ANGEBOTSTYP} value={sf.angebotstyp} />
            </FilterSection>

            <FilterSection title="Ofruesi">
              <ChipSelect name="ofruesi" options={OFRUESI} value={sf.ofruesi} />
            </FilterSection>

            <Divider />

            <FilterSection title="Çmimi (€)">
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input name="cmimi_min" type="number" defaultValue={cmimi_min ?? ''} placeholder="Min" style={inputSt} />
                <span style={{ color: '#86868B', fontSize: '12px', flexShrink: 0 }}>–</span>
                <input name="cmimi_max" type="number" defaultValue={cmimi_max ?? ''} placeholder="Max" style={inputSt} />
              </div>
            </FilterSection>

            <Divider />

            <FilterSection title="Qyteti">
              <select name="qyteti" defaultValue={qyteti ?? ''} style={inputSt}>
                <option value="">Të gjitha qytetet</option>
                {QYTETET.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </FilterSection>

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
