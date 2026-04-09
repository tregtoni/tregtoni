'use client'

import { useState, useEffect } from 'react'
import { QYTETET, RENDITJA } from '@/lib/kategori-data'

// ─── Filter data ──────────────────────────────────────────────────────────────

const LLOJI_PUNES = [
  { v: 'fulltime',  l: 'Full-time' },
  { v: 'parttime',  l: 'Part-time' },
  { v: 'freelance', l: 'Freelance' },
  { v: 'praktike',  l: 'Praktikë' },
]

const OFRUESI = [
  { v: 'privat',  l: 'Privat' },
  { v: 'tregtar', l: 'Tregtar' },
]

const FUSHA_OPT = [
  { v: 'ngrohje-ftohje', l: 'Instalime ngrohje & ftohje' },
  { v: 'elektrik',       l: 'Elektrik' },
  { v: 'hidraulike',     l: 'Hidraulikë' },
  { v: 'ndertim',        l: 'Ndërtim' },
  { v: 'lyerje',         l: 'Lyerje' },
  { v: 'marangoz',       l: 'Marangoz' },
  { v: 'mekanik',        l: 'Mekanik' },
  { v: 'suvatim',        l: 'Suvatim' },
  { v: 'pllakosje',      l: 'Pllakosje' },
  { v: 'catite',         l: 'Çatitë' },
  { v: 'saldator',       l: 'Saldator' },
  { v: 'alumin-pvc',     l: 'Alumin & PVC' },
  { v: 'elektroshtep',   l: 'Elektroshtëpiake' },
  { v: 'pastrim',        l: 'Pastrim' },
  { v: 'kopshtari',      l: 'Kopshtari' },
  { v: 'zhvendosje',     l: 'Zhvendosje' },
  { v: 'tjeter',         l: 'Të tjera' },
]

const LLOJI_VOZ = [
  { v: 'kamion',     l: 'Kamion' },
  { v: 'furgon',     l: 'Furgon' },
  { v: 'makine',     l: 'Makinë' },
  { v: 'mociklete',  l: 'Motoçikletë' },
]

const PATENTA = [
  { v: 'b', l: 'B' },
  { v: 'c', l: 'C' },
  { v: 'd', l: 'D' },
  { v: 'e', l: 'E' },
]

const ROLI = [
  { v: 'kuzhinier',    l: 'Kuzhinier' },
  { v: 'kamarier',     l: 'Kamarier' },
  { v: 'recepsionist', l: 'Recepsionist' },
  { v: 'menaxher',     l: 'Menaxher' },
  { v: 'tjeter',       l: 'Të tjera' },
]

const GJUHA = [
  { v: 'shqip',     l: 'Shqip' },
  { v: 'anglisht',  l: 'Anglisht' },
  { v: 'gjermanisht', l: 'Gjermanisht' },
  { v: 'italisht',  l: 'Italisht' },
  { v: 'tjeter',    l: 'Të tjera' },
]

const LLOJI_SHITJES = [
  { v: 'online',   l: 'Online' },
  { v: 'dyqan',    l: 'Në dyqan' },
  { v: 'te_dyja',  l: 'Të dyja' },
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

export type PuneFilters = {
  lloji_punes?: string
  ofruesi?: string
  fusha?: string
  lloji_voz?: string
  patenta?: string
  roli?: string
  gjuha?: string
  lloji_shitjes?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  puneFilters: PuneFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PuneFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  puneFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const pf = puneFilters

  const isZanate    = nenkategoria === 'Zanate / Profesionist'
  const isTransport = nenkategoria === 'Transport & Logjistikë'
  const isGastro    = nenkategoria === 'Gastronomia & Turizëm'
  const isSherbim   = nenkategoria === 'Shërbim klienti'
  const isShitje    = nenkategoria === 'Shitje & Blerje'
  const hasSpecific = isZanate || isTransport || isGastro || isSherbim || isShitje

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

            {/* ── SUBCATEGORY-SPECIFIC FILTERS ── */}

            {isZanate && (
              <FilterSection title="Fusha">
                <select name="fusha" defaultValue={pf.fusha ?? ''} style={inputSt}>
                  <option value="">Të gjitha fushat</option>
                  {FUSHA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </FilterSection>
            )}

            {isTransport && (
              <>
                <FilterSection title="Lloji i vozitjes">
                  <ChipSelect name="lloji_voz" options={LLOJI_VOZ} value={pf.lloji_voz} />
                </FilterSection>
                <FilterSection title="Patenta">
                  <ChipSelect name="patenta" options={PATENTA} value={pf.patenta} />
                </FilterSection>
              </>
            )}

            {isGastro && (
              <FilterSection title="Roli">
                <ChipSelect name="roli" options={ROLI} value={pf.roli} />
              </FilterSection>
            )}

            {isSherbim && (
              <FilterSection title="Gjuha">
                <ChipSelect name="gjuha" options={GJUHA} value={pf.gjuha} />
              </FilterSection>
            )}

            {isShitje && (
              <FilterSection title="Lloji">
                <ChipSelect name="lloji_shitjes" options={LLOJI_SHITJES} value={pf.lloji_shitjes} />
              </FilterSection>
            )}

            {hasSpecific && <Divider />}

            {/* ── COMMON FILTERS ── */}

            <FilterSection title="Lloji i punës">
              <ChipSelect name="lloji_punes" options={LLOJI_PUNES} value={pf.lloji_punes} />
            </FilterSection>

            <FilterSection title="Ofruesi">
              <ChipSelect name="ofruesi" options={OFRUESI} value={pf.ofruesi} />
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
