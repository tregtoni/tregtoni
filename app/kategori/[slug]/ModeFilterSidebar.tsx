'use client'

import { useState, useEffect } from 'react'
import { QYTETET, RENDITJA } from '@/lib/kategori-data'

// ─── Filter data ──────────────────────────────────────────────────────────────

const GJENDJA = [
  { v: 'ri',      l: 'I ri' },
  { v: 'si_ri',   l: 'Si i ri' },
  { v: 'mire',    l: 'I mirë' },
  { v: 'perdorur', l: 'I përdorur' },
]

const ANGEBOTSTYP = [
  { v: 'oferta',  l: 'Ofertë' },
  { v: 'kerkesa', l: 'Kërkesë' },
]

const OFRUESI = [
  { v: 'privat',  l: 'Privat' },
  { v: 'tregtar', l: 'Tregtar' },
]

const DERGESA = [
  { v: 'mundshme', l: 'Dërgesa e mundshme' },
  { v: 'vetem',    l: 'Vetëm marrje' },
]

const MARKAT_VESHJE = [
  'Nike', 'Adidas', 'Zara', 'H&M', 'Pull&Bear', 'Bershka', 'Mango',
  'Stradivarius', 'Reserved', 'C&A', 'Primark', 'Gucci', 'Louis Vuitton',
  'Versace', 'Armani', 'Prada', 'Balenciaga', 'Off-White', 'Tommy Hilfiger',
  'Ralph Lauren', 'Calvin Klein', 'Hugo Boss', 'Lacoste', 'Stone Island',
  'The North Face', 'Champion', 'Fila', 'Puma', 'New Balance', "Levi's", 'Të tjera',
]

const MARKAT_KEPUCE = [
  'Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Vans', 'Reebok',
  'Skechers', 'Timberland', 'Dr. Martens', 'Birkenstock', 'Crocs',
  'Gucci', 'Louis Vuitton', 'Prada', 'Balenciaga', 'Jimmy Choo', 'Valentino',
  'Zara', 'H&M', 'Steve Madden', 'Geox', 'Ecco', 'Clarks', 'UGG', 'Salomon', 'Të tjera',
]

const MARKAT_CANTA = ['Gucci', 'Louis Vuitton', 'Zara', 'H&M', 'Të tjera']
const MARKAT_ORE   = ['Rolex', 'Casio', 'Swatch', 'Fossil', 'Të tjera']

const MADHESIA_VESHJE = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const NUMRI_KEPUCE    = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

const NGJYRA_VESHJE = [
  { v: 'zeze',    l: 'Zezë' },
  { v: 'bardhe',  l: 'Bardhë' },
  { v: 'gri',     l: 'Gri' },
  { v: 'kalter',  l: 'Kaltër' },
  { v: 'kuqe',    l: 'E kuqe' },
  { v: 'gjelbер', l: 'E gjelbër' },
  { v: 'bezhe',   l: 'Bezhë' },
  { v: 'kafe',    l: 'Kafe' },
  { v: 'tjera',   l: 'Ngjyra të tjera' },
]

const NGJYRA_KEPUCE = [
  { v: 'zeze',   l: 'Zezë' },
  { v: 'bardhe', l: 'Bardhë' },
  { v: 'gri',    l: 'Gri' },
  { v: 'kalter', l: 'Kaltër' },
  { v: 'kuqe',   l: 'E kuqe' },
  { v: 'kafe',   l: 'Kafe' },
  { v: 'tjera',  l: 'Ngjyra të tjera' },
]

const BUKURI_LLOJI = [
  { v: 'kozmetike', l: 'Kozmetikë' },
  { v: 'parfum',    l: 'Parfum' },
  { v: 'lekure',    l: 'Kujdes lëkure' },
  { v: 'flok',      l: 'Flok' },
  { v: 'tjeter',    l: 'Të tjera' },
]

const CANTA_LLOJI = [
  { v: 'dore',    l: 'Çantë dore' },
  { v: 'shpine',  l: 'Çantë shpine' },
  { v: 'portofol', l: 'Portofol' },
  { v: 'brez',    l: 'Brez' },
  { v: 'syze',    l: 'Syze' },
  { v: 'tjeter',  l: 'Të tjera' },
]

const ORE_LLOJI = [
  { v: 'ore',      l: 'Orë' },
  { v: 'unaze',    l: 'Unazë' },
  { v: 'gjerdan',  l: 'Gjerdan' },
  { v: 'byzylyk',  l: 'Byzylyk' },
  { v: 'vathe',    l: 'Vathë' },
  { v: 'tjeter',   l: 'Të tjera' },
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

export type ModeFilters = {
  zustand?: string
  angebotstyp?: string
  ofruesi?: string
  dergesa?: string
  marka?: string
  madhesia?: string
  ngjyra?: string
  numri_kepuces?: string
  mode_lloji?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  modeFilters: ModeFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ModeFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  modeFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const mf = modeFilters

  const isVeshje  = nenkategoria === 'Veshje burrash' || nenkategoria === 'Veshje femrash'
  const isKepuce  = nenkategoria === 'Këpucë burrash' || nenkategoria === 'Këpucë femrash'
  const isBukuri  = nenkategoria === 'Bukuri & Shëndet'
  const isCanta   = nenkategoria === 'Çanta & Aksesore'
  const isOre     = nenkategoria === 'Orë & Bizhuteri'

  const markat = isVeshje ? MARKAT_VESHJE : isKepuce ? MARKAT_KEPUCE : isCanta ? MARKAT_CANTA : isOre ? MARKAT_ORE : null
  const llojiOpt = isBukuri ? BUKURI_LLOJI : isCanta ? CANTA_LLOJI : isOre ? ORE_LLOJI : null
  const ngjyrat = isVeshje ? NGJYRA_VESHJE : isKepuce ? NGJYRA_KEPUCE : null

  const hasSpecific = !!(markat || llojiOpt || ngjyrat || isVeshje || isKepuce)

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

            {/* ── MARKA ── */}
            {markat && (
              <FilterSection title="Marka">
                <select name="marka" defaultValue={mf.marka ?? ''} style={inputSt}>
                  <option value="">Të gjitha markat</option>
                  {markat.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </FilterSection>
            )}

            {/* ── SUBCATEGORY-SPECIFIC ── */}

            {llojiOpt && (
              <FilterSection title="Lloji">
                <ChipSelect name="mode_lloji" options={llojiOpt} value={mf.mode_lloji} />
              </FilterSection>
            )}

            {isVeshje && (
              <FilterSection title="Madhësia">
                <select name="madhesia" defaultValue={mf.madhesia ?? ''} style={inputSt}>
                  <option value="">Zgjidh madhësinë</option>
                  {MADHESIA_VESHJE.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FilterSection>
            )}

            {isKepuce && (
              <FilterSection title="Numri">
                <select name="numri_kepuces" defaultValue={mf.numri_kepuces ?? ''} style={inputSt}>
                  <option value="">Zgjidh numrin</option>
                  {NUMRI_KEPUCE.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </FilterSection>
            )}

            {ngjyrat && (
              <FilterSection title="Ngjyra">
                <select name="ngjyra" defaultValue={mf.ngjyra ?? ''} style={inputSt}>
                  <option value="">Zgjidh ngjyrën</option>
                  {ngjyrat.map(n => <option key={n.v} value={n.v}>{n.l}</option>)}
                </select>
              </FilterSection>
            )}

            {hasSpecific && <Divider />}

            {/* ── COMMON FILTERS ── */}

            <FilterSection title="Gjendja">
              <ChipSelect name="zustand" options={GJENDJA} value={mf.zustand} />
            </FilterSection>

            <Divider />

            <FilterSection title="Lloji i ofertës">
              <ChipSelect name="angebotstyp" options={ANGEBOTSTYP} value={mf.angebotstyp} />
            </FilterSection>

            <FilterSection title="Ofruesi">
              <ChipSelect name="ofruesi" options={OFRUESI} value={mf.ofruesi} />
            </FilterSection>

            <FilterSection title="Dërgesa">
              <ChipSelect name="dergesa" options={DERGESA} value={mf.dergesa} />
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
