'use client'

import { useState, useEffect } from 'react'
import { QYTETET, RENDITJA } from '@/lib/kategori-data'

// ─── Filter data ─────────────────────────────────────────────────────────────

const MOTO_ART = [
  { v: 'motorrad',  l: 'Motorçikleta' },
  { v: 'roller',    l: 'Motorroller & Skuterë' },
  { v: 'quad',      l: 'Quad' },
  { v: 'mofa',      l: 'Mofa & Moped' },
]

const GETRIEBE = [
  { v: 'automatik', l: 'Automatik' },
  { v: 'manual',    l: 'Manual' },
]

const ANGEBOTSTYP = [
  { v: 'oferta',   l: 'Oferta' },
  { v: 'kerkesa',  l: 'Kërkesa' },
]

const OFRUESI = [
  { v: 'privat',   l: 'Privat' },
  { v: 'tregtar',  l: 'Tregtar' },
]

// ─── Shared styles ────────────────────────────────────────────────────────────

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'

const inputSt: React.CSSProperties = {
  width: '100%',
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
      <div style={{
        fontSize: '11px',
        fontWeight: '700',
        color: '#86868B',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        marginBottom: '10px',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function RangeRow({
  nameMin, nameMax, valMin, valMax, placeholderMin, placeholderMax,
}: {
  nameMin: string; nameMax: string
  valMin?: string; valMax?: string
  placeholderMin: string; placeholderMax: string
}) {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <input name={nameMin} type="number" defaultValue={valMin ?? ''} placeholder={placeholderMin} min="0" style={inputSt} />
      <span style={{ color: '#86868B', fontSize: '12px', flexShrink: 0 }}>–</span>
      <input name={nameMax} type="number" defaultValue={valMax ?? ''} placeholder={placeholderMax} min="0" style={inputSt} />
    </div>
  )
}

function ChipSelect({ name, options, value }: {
  name: string
  options: { v: string; l: string }[]
  value?: string
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {options.map(opt => {
        const active = value === opt.v
        return (
          <label key={opt.v} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
            <input type="radio" name={name} value={opt.v} defaultChecked={active} style={{ display: 'none' }} />
            <span style={{
              padding: '5px 11px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: active ? '600' : '500',
              color: active ? '#DA291C' : '#1D1D1F',
              background: active ? '#FFF5F5' : '#F5F5F7',
              border: `1.5px solid ${active ? 'rgba(218,41,28,0.35)' : 'rgba(0,0,0,0.08)'}`,
              whiteSpace: 'nowrap',
              userSelect: 'none',
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

export type MotoFilters = {
  km_min?: string; km_max?: string
  bj_min?: string; bj_max?: string
  cc_min?: string; cc_max?: string
  ps_min?: string; ps_max?: string
  hu_min?: string; hu_max?: string
  moto_art?: string
  getriebe?: string
  angebotstyp?: string
  ofruesi?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  marka?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  motoFilters: MotoFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MotoFilterSidebar({
  slug, nenkategoria, marka, cmimi_min, cmimi_max, qyteti, rendit,
  motoFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const mf = motoFilters

  return (
    <div style={{ fontFamily: FONT }}>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(o => !o)}
        style={{
          width: '100%',
          background: '#fff',
          border: '1.5px solid rgba(0,0,0,0.1)',
          borderRadius: '12px',
          padding: '11px 16px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#1D1D1F',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: FONT,
          marginBottom: mobileOpen ? '10px' : '0',
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
            background: '#fff',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ padding: '16px' }}>

            {/* Hidden: preserve subcategory + brand */}
            {nenkategoria && <input type="hidden" name="nenkategoria" value={nenkategoria} />}
            {marka        && <input type="hidden" name="marka"        value={marka} />}

            {/* ── RANGE FILTERS ── */}
            <FilterSection title="Çmimi (€)">
              <RangeRow
                nameMin="cmimi_min" nameMax="cmimi_max"
                valMin={cmimi_min}  valMax={cmimi_max}
                placeholderMin="Min" placeholderMax="Max"
              />
            </FilterSection>

            <FilterSection title="Kilometrazhi">
              <RangeRow
                nameMin="km_min" nameMax="km_max"
                valMin={mf.km_min} valMax={mf.km_max}
                placeholderMin="0 km" placeholderMax="300 000 km"
              />
            </FilterSection>

            <FilterSection title="Viti i prodhimit">
              <RangeRow
                nameMin="bj_min" nameMax="bj_max"
                valMin={mf.bj_min} valMax={mf.bj_max}
                placeholderMin="2000" placeholderMax="2025"
              />
            </FilterSection>

            <FilterSection title="Cilindrata (cc)">
              <RangeRow
                nameMin="cc_min" nameMax="cc_max"
                valMin={mf.cc_min} valMax={mf.cc_max}
                placeholderMin="50 cc" placeholderMax="2 000 cc"
              />
            </FilterSection>

            <FilterSection title="Fuqia (KS)">
              <RangeRow
                nameMin="ps_min" nameMax="ps_max"
                valMin={mf.ps_min} valMax={mf.ps_max}
                placeholderMin="0 KS" placeholderMax="300 KS"
              />
            </FilterSection>

            <FilterSection title="Kontrolli teknik (viti min.)">
              <RangeRow
                nameMin="hu_min" nameMax="hu_max"
                valMin={mf.hu_min} valMax={mf.hu_max}
                placeholderMin="2024" placeholderMax="2030"
              />
            </FilterSection>

            <Divider />

            {/* ── CATEGORICAL FILTERS ── */}

            <FilterSection title="Lloji i mjetiт">
              <ChipSelect name="moto_art" options={MOTO_ART} value={mf.moto_art} />
            </FilterSection>

            <FilterSection title="Këmbëzënia">
              <ChipSelect name="getriebe" options={GETRIEBE} value={mf.getriebe} />
            </FilterSection>

            <FilterSection title="Lloji i ofertës">
              <ChipSelect name="angebotstyp" options={ANGEBOTSTYP} value={mf.angebotstyp} />
            </FilterSection>

            <FilterSection title="Ofruesi">
              <ChipSelect name="ofruesi" options={OFRUESI} value={mf.ofruesi} />
            </FilterSection>

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
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#DA291C',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: FONT,
              }}
            >
              Apliko filtrat
            </button>
            {hasFilters && (
              <a
                href={clearUrl}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#86868B',
                  fontSize: '12px',
                  textDecoration: 'none',
                  padding: '4px',
                  fontFamily: FONT,
                }}
              >
                Pastro filtrat
              </a>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
