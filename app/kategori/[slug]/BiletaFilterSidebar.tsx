'use client'

import { useState, useEffect } from 'react'
import { RENDITJA, QYTETET } from '@/lib/kategori-data'

// ─── Filter data ──────────────────────────────────────────────────────────────

const LLOJI_SALLE = [
  { v: 'natyre', l: 'Në natyrë' },
  { v: 'salle',  l: 'Në sallë' },
]

const LLOJI_TRANSPORTI = [
  { v: 'autobus',  l: 'Autobus' },
  { v: 'tren',     l: 'Tren' },
  { v: 'aeroplan', l: 'Aeroplan' },
  { v: 'anije',    l: 'Anije' },
]

const LLOJI_SPORTI = [
  { v: 'futboll',       l: 'Futboll' },
  { v: 'basketboll',    l: 'Basketboll' },
  { v: 'volejboll',     l: 'Volejboll' },
  { v: 'tenis',         l: 'Tenis' },
  { v: 'natacion',      l: 'Natacion' },
  { v: 'boks',          l: 'Boks' },
  { v: 'karate',        l: 'Karate & Arte Marciale' },
  { v: 'gjimnastike',   l: 'Gjimnastikë' },
  { v: 'vrapim',        l: 'Vrapim & Atletikë' },
  { v: 'ciklizem',      l: 'Çiklizëm' },
  { v: 'ski',           l: 'Ski & Snowboard' },
  { v: 'yoga',          l: 'Yoga & Pilates' },
  { v: 'fitnes',        l: 'Fitnes' },
  { v: 'pesengritje',   l: 'Pesëngritje' },
  { v: 'tjera',         l: 'Tjera' },
]

const KATEGORIA_KUPONIT = [
  { v: 'restorant', l: 'Restorant' },
  { v: 'spa',       l: 'Spa' },
  { v: 'udhetim',   l: 'Udhëtim' },
  { v: 'argetim',   l: 'Argëtim' },
  { v: 'tjera',     l: 'Tjera' },
]

const MOSHA_FEMIJE = [
  { v: '0-3',   l: '0–3 vjeç' },
  { v: '3-6',   l: '3–6 vjeç' },
  { v: '6-12',  l: '6–12 vjeç' },
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

export type BiletaFilters = {
  bileta_date_nga?: string
  bileta_date_deri?: string
  bileta_lloji?: string
  destinacioni?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  biletaFilters: BiletaFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BiletaFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  biletaFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const bf = biletaFilters

  const hasSalle     = nenkategoria === 'Teatër & Musical' || nenkategoria === 'Komedi' || nenkategoria === 'Koncerte'
  const isTransport  = nenkategoria === 'Transport'
  const isSporti     = nenkategoria === 'Sport'
  const isKupon      = nenkategoria === 'Kuponë'
  const isFemije     = nenkategoria === 'Fëmijë'

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

            {/* ── DATA ── */}
            <FilterSection title="Data">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#86868B', marginBottom: '4px' }}>Data nga</div>
                  <input
                    name="bileta_date_nga"
                    type="date"
                    defaultValue={bf.bileta_date_nga ?? ''}
                    style={inputSt}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#86868B', marginBottom: '4px' }}>Data deri</div>
                  <input
                    name="bileta_date_deri"
                    type="date"
                    defaultValue={bf.bileta_date_deri ?? ''}
                    style={inputSt}
                  />
                </div>
              </div>
            </FilterSection>

            <Divider />

            {/* ── SUBCATEGORY-SPECIFIC ── */}

            {hasSalle && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="bileta_lloji" options={LLOJI_SALLE} value={bf.bileta_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isTransport && (
              <>
                <FilterSection title="Lloji i transportit">
                  <ChipSelect name="bileta_lloji" options={LLOJI_TRANSPORTI} value={bf.bileta_lloji} />
                </FilterSection>
                <FilterSection title="Destinacioni">
                  <input
                    name="destinacioni"
                    type="text"
                    defaultValue={bf.destinacioni ?? ''}
                    placeholder="p.sh. Tiranë, Vjenë..."
                    style={inputSt}
                  />
                </FilterSection>
                <Divider />
              </>
            )}

            {isSporti && (
              <>
                <FilterSection title="Lloji i sportit">
                  <select name="bileta_lloji" defaultValue={bf.bileta_lloji ?? ''} style={inputSt}>
                    <option value="">Të gjitha</option>
                    {LLOJI_SPORTI.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </FilterSection>
                <Divider />
              </>
            )}

            {isKupon && (
              <>
                <FilterSection title="Kategoria">
                  <ChipSelect name="bileta_lloji" options={KATEGORIA_KUPONIT} value={bf.bileta_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {isFemije && (
              <>
                <FilterSection title="Mosha">
                  <ChipSelect name="bileta_lloji" options={MOSHA_FEMIJE} value={bf.bileta_lloji} />
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
