'use client'

import { useState, useEffect } from 'react'
import { QYTETET, RENDITJA } from '@/lib/kategori-data'

// ─── Filter data ──────────────────────────────────────────────────────────────

const GJENDJA = [
  { v: 'ri',         l: 'I ri' },
  { v: 'shume_mire', l: 'Shumë mirë' },
  { v: 'mire',       l: 'Mirë' },
  { v: 'rregull',    l: 'Në rregull' },
  { v: 'demtuar',    l: 'I dëmtuar' },
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

const PAJISJA = [
  { v: 'pajisje',         l: 'Pajisje' },
  { v: 'aksesore',        l: 'Aksesore' },
  { v: 'pajisje_aksesore', l: 'Pajisje & Aksesore' },
]

const RAM = [
  { v: '4gb',  l: '4 GB' },
  { v: '8gb',  l: '8 GB' },
  { v: '16gb', l: '16 GB' },
  { v: '32gb', l: '32 GB+' },
]

const OS = [
  { v: 'windows', l: 'Windows' },
  { v: 'macos',   l: 'MacOS' },
  { v: 'linux',   l: 'Linux' },
]

const NGJYRAT = [
  { v: 'zeze',      l: 'Zezë' },
  { v: 'bardhe',    l: 'Bardhë' },
  { v: 'gri',       l: 'Gri' },
  { v: 'argjend',   l: 'Argjend' },
  { v: 'gold',      l: 'Gold' },
  { v: 'rozegold',  l: 'Rozëgold' },
  { v: 'kaltер',    l: 'Kaltër' },
  { v: 'gjelbер',   l: 'E gjelbër' },
  { v: 'kuqe',      l: 'E kuqe' },
  { v: 'portokalli', l: 'Portokalli' },
  { v: 'roze',      l: 'Rozë' },
  { v: 'vjollce',   l: 'Vjollcë' },
  { v: 'bezhe',     l: 'Bezhë' },
  { v: 'kafe',      l: 'Kafe' },
  { v: 'verdhe',    l: 'E verdhë' },
  { v: 'tjera',     l: 'Ngjyra të tjera' },
]

const MARKAT: Record<string, string[]> = {
  'Celular & Telefon': ['Apple', 'Samsung', 'Huawei', 'Nokia', 'Sony', 'Xiaomi', 'Motorola', 'LG', 'HTC', 'Siemens', 'Google', 'Të tjera'],
  'Laptop':            ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Të tjera'],
  'PC':                ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Të tjera'],
  'TV & Video':        ['Samsung', 'LG', 'Sony', 'Philips', 'Të tjera'],
  'Tabletë':           ['Apple', 'Samsung', 'Huawei', 'Të tjera'],
  'Audio & Hi-Fi':     ['Sony', 'Bose', 'JBL', 'Samsung', 'Të tjera'],
  'Videolojëra':       ['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Të tjera'],
  'Foto':              ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Të tjera'],
}

const MADHESIA = [
  { v: '32',   l: '32"' },
  { v: '43',   l: '43"' },
  { v: '55',   l: '55"' },
  { v: '65plus', l: '65"+' },
]

const AUDIO_LLOJI = [
  { v: 'kufje',    l: 'Kufje' },
  { v: 'altop',    l: 'Altoparlant' },
  { v: 'hifi',     l: 'Sistem Hi-Fi' },
  { v: 'tjeter',   l: 'Të tjera' },
]

const PLATFORMA = [
  { v: 'playstation', l: 'PlayStation' },
  { v: 'xbox',        l: 'Xbox' },
  { v: 'nintendo',    l: 'Nintendo' },
  { v: 'pc',          l: 'PC' },
  { v: 'tjeter',      l: 'Të tjera' },
]

const LOJE_LLOJI = [
  { v: 'konzol',   l: 'Konzol' },
  { v: 'loje',     l: 'Lojë' },
  { v: 'aksesore', l: 'Aksesore' },
]

const FOTO_LLOJI = [
  { v: 'aparat',   l: 'Aparat' },
  { v: 'objektiv', l: 'Objektiv' },
  { v: 'aksesore', l: 'Aksesore' },
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

export type ElektronikFilters = {
  zustand?: string
  angebotstyp?: string
  ofruesi?: string
  dergesa?: string
  marka?: string
  pajisja?: string
  ngjyra?: string
  ram?: string
  os?: string
  madhesia?: string
  el_lloji?: string
  platforma?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  elFilters: ElektronikFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ElektronikFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  elFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const ef = elFilters
  const markat = nenkategoria ? MARKAT[nenkategoria] : undefined

  const hasPajisja   = nenkategoria === 'Celular & Telefon' || nenkategoria === 'Laptop' || nenkategoria === 'PC' || nenkategoria === 'Tabletë'
  const hasNgjyra    = nenkategoria === 'Celular & Telefon'
  const hasRam       = nenkategoria === 'Laptop' || nenkategoria === 'PC'
  const hasOs        = nenkategoria === 'Laptop'
  const hasMadhesia  = nenkategoria === 'TV & Video'
  const hasAudioLloji = nenkategoria === 'Audio & Hi-Fi'
  const hasVideolojLloji = nenkategoria === 'Videolojëra'
  const hasFotoLloji = nenkategoria === 'Foto'
  const hasPlatforma = false

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
              <>
                <FilterSection title="Marka">
                  <select name="marka" defaultValue={ef.marka ?? ''} style={inputSt}>
                    <option value="">Të gjitha markat</option>
                    {markat.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </FilterSection>
                <Divider />
              </>
            )}

            {/* ── SUBCATEGORY-SPECIFIC FILTERS ── */}

            {hasPajisja && (
              <FilterSection title="Pajisja">
                <ChipSelect name="pajisja" options={PAJISJA} value={ef.pajisja} />
              </FilterSection>
            )}

            {hasNgjyra && (
              <FilterSection title="Ngjyra">
                <select name="ngjyra" defaultValue={ef.ngjyra ?? ''} style={inputSt}>
                  <option value="">Të gjitha ngjyrat</option>
                  {NGJYRAT.map(n => <option key={n.v} value={n.v}>{n.l}</option>)}
                </select>
              </FilterSection>
            )}

            {hasRam && (
              <FilterSection title="RAM">
                <ChipSelect name="ram" options={RAM} value={ef.ram} />
              </FilterSection>
            )}

            {hasOs && (
              <FilterSection title="Sistemi operativ">
                <ChipSelect name="os" options={OS} value={ef.os} />
              </FilterSection>
            )}

            {hasMadhesia && (
              <FilterSection title="Madhësia">
                <ChipSelect name="madhesia" options={MADHESIA} value={ef.madhesia} />
              </FilterSection>
            )}

            {hasAudioLloji && (
              <FilterSection title="Lloji">
                <ChipSelect name="el_lloji" options={AUDIO_LLOJI} value={ef.el_lloji} />
              </FilterSection>
            )}

            {hasPlatforma && (
              <FilterSection title="Marka">
                <ChipSelect name="platforma" options={PLATFORMA} value={ef.platforma} />
              </FilterSection>
            )}

            {hasVideolojLloji && (
              <FilterSection title="Lloji">
                <ChipSelect name="el_lloji" options={LOJE_LLOJI} value={ef.el_lloji} />
              </FilterSection>
            )}

            {hasFotoLloji && (
              <FilterSection title="Lloji">
                <ChipSelect name="el_lloji" options={FOTO_LLOJI} value={ef.el_lloji} />
              </FilterSection>
            )}

            {(hasPajisja || hasNgjyra || hasRam || hasOs || hasMadhesia || hasAudioLloji || hasPlatforma || hasVideolojLloji || hasFotoLloji) && (
              <Divider />
            )}

            {/* ── COMMON FILTERS ── */}

            <FilterSection title="Gjendja">
              <ChipSelect name="zustand" options={GJENDJA} value={ef.zustand} />
            </FilterSection>

            <Divider />

            <FilterSection title="Lloji i ofertës">
              <ChipSelect name="angebotstyp" options={ANGEBOTSTYP} value={ef.angebotstyp} />
            </FilterSection>

            <FilterSection title="Ofruesi">
              <ChipSelect name="ofruesi" options={OFRUESI} value={ef.ofruesi} />
            </FilterSection>

            <FilterSection title="Dërgesa">
              <ChipSelect name="dergesa" options={DERGESA} value={ef.dergesa} />
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
