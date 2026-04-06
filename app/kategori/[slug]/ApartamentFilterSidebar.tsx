'use client'

import { useState, useEffect } from 'react'
import { QYTETET, RENDITJA } from '@/lib/kategori-data'

// ─── Filter data ──────────────────────────────────────────────────────────────

const APT_TYPE = [
  { v: 'kat',        l: 'Apartament në kat' },
  { v: 'cati',       l: 'Apartament në çati' },
  { v: 'perdhe',     l: 'Apartament në kat përdhes' },
  { v: 'nendhe',     l: 'Apartament nëndhese' },
  { v: 'penthouse',  l: 'Penthouse' },
  { v: 'maisonette', l: 'Maisonette' },
  { v: 'loft',       l: 'Loft' },
  { v: 'tjeter',     l: 'Të tjera' },
]

const ANGEBOTSTYP = [
  { v: 'oferta',   l: 'Ofertë' },
  { v: 'kerkesa',  l: 'Kërkesë' },
]

const OFRUESI = [
  { v: 'privat',   l: 'Privat' },
  { v: 'tregtar',  l: 'Tregtar' },
]

const SHKEMBIM = [
  { v: 'vetem',  l: 'Vetëm shkëmbim' },
  { v: 'pa',     l: 'Pa shkëmbim' },
]

const PAJISJET_OPT = [
  { v: 'mobiluar',       l: 'I mobiluar / Gjysmë i mobiluar' },
  { v: 'ballkon',        l: 'Ballkon' },
  { v: 'tarrace',        l: 'Tarracë' },
  { v: 'kuzhin-integr',  l: 'Kuzhinë e integruar' },
  { v: 'vask',           l: 'Vaskë banje' },
  { v: 'tualet-mysafir', l: 'Tualet për mysafirë' },
  { v: 'akses-shkalle',  l: 'Akses pa shkallë' },
  { v: 'ngrohje-dysh',   l: 'Ngrohje dyshemeje' },
]

const KARAKTERISTIKA_OPT = [
  { v: 'ndert-vjeter',   l: 'Ndërtim i vjetër' },
  { v: 'ndert-ri',       l: 'Ndërtim i ri' },
  { v: 'ashensor',       l: 'Ashensor' },
  { v: 'bodrum',         l: 'Bodrum' },
  { v: 'cati-ndert',     l: 'Çati' },
  { v: 'garazh',         l: 'Garazh/Parking' },
  { v: 'kopsht',         l: 'Kopsht' },
  { v: 'kafsh-lejohen',  l: 'Kafshë shtëpiake lejohen' },
  { v: 'bashkjetese',    l: 'I përshtatshëm për bashkëjetesë' },
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

function RangeRow({ nameMin, nameMax, valMin, valMax, placeholderMin, placeholderMax, type = 'number' }: {
  nameMin: string; nameMax: string
  valMin?: string; valMax?: string
  placeholderMin: string; placeholderMax: string
  type?: string
}) {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <input name={nameMin} type={type} defaultValue={valMin ?? ''} placeholder={placeholderMin} style={inputSt} />
      <span style={{ color: '#86868B', fontSize: '12px', flexShrink: 0 }}>–</span>
      <input name={nameMax} type={type} defaultValue={valMax ?? ''} placeholder={placeholderMax} style={inputSt} />
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

function CheckboxGroup({ name, options, values }: { name: string; options: { v: string; l: string }[]; values: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {options.map(opt => (
        <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#1D1D1F' }}>
          <input
            type="checkbox"
            name={name}
            value={opt.v}
            defaultChecked={values.includes(opt.v)}
            style={{ width: '15px', height: '15px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }}
          />
          {opt.l}
        </label>
      ))}
    </div>
  )
}

function Divider() {
  return <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', margin: '4px 0 20px' }} />
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApartFilters = {
  apt_type?: string
  angebotstyp?: string
  ofruesi?: string
  shkembim?: string
  pajisjet?: string[]
  karakteristika?: string[]
  sip_min?: string; sip_max?: string
  dhoma_min?: string; dhoma_max?: string
  kati_min?: string; kati_max?: string
  disp_min?: string; disp_max?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  apartFilters: ApartFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ApartamentFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  apartFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const af = apartFilters

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

            {/* ── TIPI ── */}
            <FilterSection title="Tipi i apartamentit">
              <select name="apt_type" defaultValue={af.apt_type ?? ''} style={inputSt}>
                <option value="">Të gjitha tipet</option>
                {APT_TYPE.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </FilterSection>

            <Divider />

            {/* ── RANGE FILTERS ── */}
            <FilterSection title="Çmimi (€)">
              <RangeRow nameMin="cmimi_min" nameMax="cmimi_max" valMin={cmimi_min} valMax={cmimi_max} placeholderMin="Min" placeholderMax="Max" />
            </FilterSection>

            <FilterSection title="Sipërfaqja (m²)">
              <RangeRow nameMin="sip_min" nameMax="sip_max" valMin={af.sip_min} valMax={af.sip_max} placeholderMin="Min m²" placeholderMax="Max m²" />
            </FilterSection>

            <FilterSection title="Dhoma">
              <RangeRow nameMin="dhoma_min" nameMax="dhoma_max" valMin={af.dhoma_min} valMax={af.dhoma_max} placeholderMin="Nga" placeholderMax="Deri" />
            </FilterSection>

            <FilterSection title="Kati">
              <RangeRow nameMin="kati_min" nameMax="kati_max" valMin={af.kati_min} valMax={af.kati_max} placeholderMin="Nga" placeholderMax="Deri" />
            </FilterSection>

            <FilterSection title="Disponueshëm nga">
              <RangeRow nameMin="disp_min" nameMax="disp_max" valMin={af.disp_min} valMax={af.disp_max} placeholderMin="Nga (datë)" placeholderMax="Deri (datë)" type="date" />
            </FilterSection>

            <Divider />

            {/* ── CATEGORICAL FILTERS ── */}

            <FilterSection title="Lloji i ofertës">
              <ChipSelect name="angebotstyp" options={ANGEBOTSTYP} value={af.angebotstyp} />
            </FilterSection>

            <FilterSection title="Ofruesi">
              <ChipSelect name="ofruesi" options={OFRUESI} value={af.ofruesi} />
            </FilterSection>

            <FilterSection title="Shkëmbim">
              <ChipSelect name="shkembim" options={SHKEMBIM} value={af.shkembim} />
            </FilterSection>

            <Divider />

            <FilterSection title="Pajisjet">
              <CheckboxGroup name="pajisjet" options={PAJISJET_OPT} values={af.pajisjet ?? []} />
            </FilterSection>

            <Divider />

            <FilterSection title="Karakteristika të përgjithshme">
              <CheckboxGroup name="karakteristika" options={KARAKTERISTIKA_OPT} values={af.karakteristika ?? []} />
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
