'use client'

import { useState, useEffect } from 'react'
import { QYTETET, RENDITJA } from '@/lib/kategori-data'

// ─── Albanian labels ────────────────────────────────────────────────────────

const KRAFTSTOFF = [
  { v: 'benzine',  l: 'Benzinë' },
  { v: 'diesel',   l: 'Diesel' },
  { v: 'cng',      l: 'Gas natyror (CNG)' },
  { v: 'lpg',      l: 'Gaz i lëngshëm (LPG)' },
  { v: 'hybrid',   l: 'Hibrid' },
  { v: 'elektrik', l: 'Elektrik' },
  { v: 'tjeter',   l: 'Tjetër' },
]

const GETRIEBE = [
  { v: 'automatik', l: 'Automatik' },
  { v: 'manual',    l: 'Manual' },
]

const TYPEN = [
  { v: 'mikro',     l: 'Mikro' },
  { v: 'limuzine',  l: 'Limuzinë' },
  { v: 'kombi',     l: 'Kombi' },
  { v: 'kabriolet', l: 'Kabriolet' },
  { v: 'suv',       l: 'SUV / Terrenor' },
  { v: 'van',       l: 'Van / Bus' },
  { v: 'coupe',     l: 'Kupé' },
  { v: 'tjeter',    l: 'Tjetër' },
]

const TUEREN = [
  { v: '2-3',    l: '2 / 3 dyer' },
  { v: '4-5',    l: '4 / 5 dyer' },
  { v: '6-7',    l: '6 / 7 dyer' },
  { v: 'tjeter', l: 'Tjetër' },
]


const SCHADSTOFF = [
  { v: 'euro1', l: 'Euro 1' },
  { v: 'euro2', l: 'Euro 2' },
  { v: 'euro3', l: 'Euro 3' },
  { v: 'euro4', l: 'Euro 4' },
  { v: 'euro5', l: 'Euro 5' },
  { v: 'euro6', l: 'Euro 6' },
]

const MATERIALIEN = [
  { v: 'leder',        l: 'Lëkurë e plotë' },
  { v: 'gjysem-leder', l: 'Gjysmë lëkurë' },
  { v: 'stof',         l: 'Stof' },
  { v: 'velur',        l: 'Velur' },
  { v: 'alcantara',    l: 'Alcantara' },
  { v: 'tjeter',       l: 'Tjetër' },
]

const FARBEN = [
  { v: 'bezhe',      l: 'Bezhë',    hex: '#E8DCCA' },
  { v: 'blu',        l: 'Blu',      hex: '#3B82F6' },
  { v: 'kafe',       l: 'Kafe',     hex: '#92400E' },
  { v: 'verdhe',     l: 'Verdhë',   hex: '#FBBF24' },
  { v: 'ari',        l: 'Ari',      hex: '#D4AF37' },
  { v: 'gri',        l: 'Gri',      hex: '#9CA3AF' },
  { v: 'jeshile',    l: 'Jeshile',  hex: '#16A34A' },
  { v: 'portokalli', l: 'Portokalli', hex: '#F97316' },
  { v: 'kuqe',       l: 'Kuqe',     hex: '#DA291C' },
  { v: 'zi',         l: 'Zi',       hex: '#1D1D1F' },
  { v: 'argjende',   l: 'Argjendë', hex: '#CBD5E1' },
  { v: 'vjollce',    l: 'Vjollcë',  hex: '#A855F7' },
  { v: 'bardhe',     l: 'Bardhë',   hex: '#F8FAFC', border: true },
  { v: 'tjeter',     l: 'Tjetër',   hex: 'linear-gradient(135deg,#f00,#0f0,#00f)' },
]

const AUSSTATTUNG_OPTIONS = [
  { v: 'grep',           l: 'Grep tërheqursi' },
  { v: 'sensor-parkimit', l: 'Sensor parkimi' },
  { v: 'felge-alu',      l: 'Felgë alumini' },
  { v: 'xenon-led',      l: 'Xenon / LED dritat' },
]

const INNEN_OPTIONS = [
  { v: 'klima',           l: 'Klimë' },
  { v: 'navigim',         l: 'Sistem navigimi' },
  { v: 'radio',           l: 'Radio / Tuner' },
  { v: 'bluetooth',       l: 'Bluetooth' },
  { v: 'handsfree',       l: 'Duart lira' },
  { v: 'cati-rreskore',   l: 'Çati rrëshqitëse / Panoramike' },
  { v: 'ngrohje-sedile',  l: 'Ngrohje sediljesh' },
  { v: 'tempomat',        l: 'Tempomat' },
  { v: 'jo-duhanpires',   l: 'Jo duhanpirës' },
]

const SICHER_OPTIONS = [
  { v: 'abs',                  l: 'ABS' },
  { v: 'airbag',               l: 'Airbag' },
  { v: 'librezesherbimit',     l: 'Librezë shërbimi e plotë' },
]

// ─── Shared styles ───────────────────────────────────────────────────────────

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

// ─── Sub-components ──────────────────────────────────────────────────────────

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
      <input
        name={nameMin}
        type="number"
        defaultValue={valMin ?? ''}
        placeholder={placeholderMin}
        min="0"
        style={inputSt}
      />
      <span style={{ color: '#86868B', fontSize: '12px', flexShrink: 0 }}>–</span>
      <input
        name={nameMax}
        type="number"
        defaultValue={valMax ?? ''}
        placeholder={placeholderMax}
        min="0"
        style={inputSt}
      />
    </div>
  )
}

function ChipSelect({
  name, options, value,
}: {
  name: string
  options: { v: string; l: string }[]
  value?: string
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {options.map(opt => {
        const active = value === opt.v
        return (
          <label key={opt.v} style={{
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
            <input
              type="radio"
              name={name}
              value={opt.v}
              defaultChecked={active}
              style={{ display: 'none' }}
            />
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

function ColorGrid({
  name, value,
}: {
  name: string
  value?: string
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {FARBEN.map(f => {
        const active = value === f.v
        const isGradient = f.hex.startsWith('linear')
        return (
          <label key={f.v} title={f.l} style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name={name}
              value={f.v}
              defaultChecked={active}
              style={{ display: 'none' }}
            />
            <span style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
            }}>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: f.hex,
                border: active
                  ? '2.5px solid #DA291C'
                  : f.v === 'bardhe'
                    ? '1.5px solid rgba(0,0,0,0.15)'
                    : '1.5px solid transparent',
                boxShadow: active ? '0 0 0 2px rgba(218,41,28,0.2)' : 'none',
                display: 'block',
              }} />
              <span style={{
                fontSize: '9px',
                color: active ? '#DA291C' : '#86868B',
                fontWeight: active ? '600' : '400',
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                {f.l}
              </span>
            </span>
          </label>
        )
      })}
    </div>
  )
}

function CheckboxGroup({
  name, options, values,
}: {
  name: string
  options: { v: string; l: string }[]
  values: string[]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {options.map(opt => {
        const checked = values.includes(opt.v)
        return (
          <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name={name}
              value={opt.v}
              defaultChecked={checked}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                accentColor: '#DA291C',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '13px', color: '#1D1D1F', fontWeight: checked ? '600' : '400' }}>
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

// ─── Main component ──────────────────────────────────────────────────────────

export type CarFilters = {
  km_min?: string; km_max?: string
  zustand?: string
  bj_min?: string; bj_max?: string
  kraftstoff?: string
  ps_min?: string; ps_max?: string
  getriebe?: string
  typ?: string
  tueren?: string
  umwelt?: string
  schadstoff?: string
  material?: string
  farbe?: string
  ausstattung: string[]
  innen: string[]
  sicher: string[]
}

type Props = {
  slug: string
  // existing filters
  nenkategoria?: string
  marka?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  // car filters
  carFilters: CarFilters
  clearUrl: string
  hasFilters: boolean
}

export default function CarFilterSidebar({
  slug, nenkategoria, marka, cmimi_min, cmimi_max, qyteti, rendit,
  carFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    // Open by default on desktop
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const cf = carFilters

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
                valMin={cf.km_min} valMax={cf.km_max}
                placeholderMin="0 km" placeholderMax="300 000 km"
              />
            </FilterSection>

            <FilterSection title="Viti i prodhimit">
              <RangeRow
                nameMin="bj_min" nameMax="bj_max"
                valMin={cf.bj_min} valMax={cf.bj_max}
                placeholderMin="2000" placeholderMax="2025"
              />
            </FilterSection>

            <FilterSection title="Fuqia (KS)">
              <RangeRow
                nameMin="ps_min" nameMax="ps_max"
                valMin={cf.ps_min} valMax={cf.ps_max}
                placeholderMin="0 KS" placeholderMax="1 000 KS"
              />
            </FilterSection>

            <Divider />

            {/* ── OTHER FILTERS ── */}

            <FilterSection title="Gjendja e mjetit">
              <ChipSelect name="zustand" options={[
                { v: 'paprekur', l: 'I pa dëmtuar' },
                { v: 'demtuar',  l: 'I dëmtuar' },
              ]} value={cf.zustand} />
            </FilterSection>

            <FilterSection title="Karburanti">
              <ChipSelect name="kraftstoff" options={KRAFTSTOFF} value={cf.kraftstoff} />
            </FilterSection>

            <FilterSection title="Transmisioni">
              <ChipSelect name="getriebe" options={GETRIEBE} value={cf.getriebe} />
            </FilterSection>

            <FilterSection title="Lloji i mjetit">
              <ChipSelect name="typ" options={TYPEN} value={cf.typ} />
            </FilterSection>

            <FilterSection title="Numri i dyerve">
              <ChipSelect name="tueren" options={TUEREN} value={cf.tueren} />
            </FilterSection>


            <FilterSection title="Klasa e emetimeve">
              <ChipSelect name="schadstoff" options={SCHADSTOFF} value={cf.schadstoff} />
            </FilterSection>

            <FilterSection title="Tapiceria">
              <ChipSelect name="material" options={MATERIALIEN} value={cf.material} />
            </FilterSection>

            <FilterSection title="Ngjyra e jashtme">
              <ColorGrid name="farbe" value={cf.farbe} />
            </FilterSection>

            <FilterSection title="Pajisjet">
              <CheckboxGroup name="ausstattung" options={AUSSTATTUNG_OPTIONS} values={cf.ausstattung} />
            </FilterSection>

            <FilterSection title="Interiori">
              <CheckboxGroup name="innen" options={INNEN_OPTIONS} values={cf.innen} />
            </FilterSection>

            <FilterSection title="Siguria">
              <CheckboxGroup name="sicher" options={SICHER_OPTIONS} values={cf.sicher} />
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
                  fontSize: '13px',
                  textDecoration: 'none',
                  padding: '4px',
                  fontWeight: '500',
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
