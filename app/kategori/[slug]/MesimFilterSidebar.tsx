'use client'

import { useState, useEffect } from 'react'
import { QYTETET, RENDITJA } from '@/lib/kategori-data'

// ─── Filter data ──────────────────────────────────────────────────────────────

const LLOJI = [
  { v: 'online',    l: 'Online' },
  { v: 'ne_person', l: 'Në person' },
  { v: 'hibrid',    l: 'Hibrid' },
]

const NIVELI = [
  { v: 'fillestar', l: 'Fillestar' },
  { v: 'mesatar',   l: 'Mesatar' },
  { v: 'avancuar',  l: 'Avancuar' },
]

const GJUHA = [
  { v: 'shqip',       l: 'Shqip' },
  { v: 'anglisht',    l: 'Anglisht' },
  { v: 'gjermanisht', l: 'Gjermanisht' },
  { v: 'italisht',    l: 'Italisht' },
  { v: 'tjera',       l: 'Tjera' },
]

const GJUHA_MESUAR = [
  { v: 'anglisht',    l: 'Anglisht' },
  { v: 'gjermanisht', l: 'Gjermanisht' },
  { v: 'italisht',    l: 'Italisht' },
  { v: 'frengjishtl', l: 'Frëngjisht' },
  { v: 'spanjisht',   l: 'Spanjisht' },
  { v: 'tjera',       l: 'Tjera' },
]

const LENDA = [
  { v: 'matematike', l: 'Matematikë' },
  { v: 'fizike',     l: 'Fizikë' },
  { v: 'kimi',       l: 'Kimi' },
  { v: 'biologji',   l: 'Biologji' },
  { v: 'histori',    l: 'Histori' },
  { v: 'letersi',    l: 'Letërsi' },
  { v: 'tjera',      l: 'Tjera' },
]

const LLOJI_KOMPJUTERI = [
  { v: 'programim', l: 'Programim' },
  { v: 'design',    l: 'Design' },
  { v: 'rrjeta',    l: 'Rrjeta' },
  { v: 'zyrtar',    l: 'Zyrtar' },
  { v: 'tjera',     l: 'Tjera' },
]

const LLOJI_SPORTI = [
  { v: 'futboll',      l: 'Futboll' },
  { v: 'basketboll',   l: 'Basketboll' },
  { v: 'volejboll',    l: 'Volejboll' },
  { v: 'tenis',        l: 'Tenis' },
  { v: 'natacion',     l: 'Natacion' },
  { v: 'boks',         l: 'Boks' },
  { v: 'karate',       l: 'Karate & Arte Marciale' },
  { v: 'gjimnastike',  l: 'Gjimnastikë' },
  { v: 'vrapim',       l: 'Vrapim & Atletikë' },
  { v: 'ciklizem',     l: 'Çiklizëm' },
  { v: 'ski',          l: 'Ski & Snowboard' },
  { v: 'yoga',         l: 'Yoga & Pilates' },
  { v: 'fitnes',       l: 'Fitnes' },
  { v: 'pesengritje',  l: 'Pesëngritje' },
  { v: 'tjera',        l: 'Tjera' },
]

const MOSHA_VALLEZIMI = [
  { v: 'femije',   l: 'Fëmijë' },
  { v: 'te_rinj',  l: 'Të rinj' },
  { v: 'te_rritur', l: 'Të rritur' },
]

const LLOJI_TRAJNIMI = [
  { v: 'personal',   l: 'Personal' },
  { v: 'grup',       l: 'Grup' },
  { v: 'korporativ', l: 'Korporativ' },
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

export type MesimFilters = {
  mesim_lloji?: string
  mesim_niveli?: string
  gjuha?: string
  gjuha_mesuar?: string
  lenda?: string
  mesim_sub_lloji?: string
}

type Props = {
  slug: string
  nenkategoria?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  mesimFilters: MesimFilters
  clearUrl: string
  hasFilters: boolean
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MesimFilterSidebar({
  slug, nenkategoria, cmimi_min, cmimi_max, qyteti, rendit,
  mesimFilters, clearUrl, hasFilters,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(window.innerWidth >= 900)
    const onResize = () => { if (window.innerWidth >= 900) setMobileOpen(true) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const mf = mesimFilters

  const isGjuhe       = nenkategoria === 'Kurse gjuhe'
  const isMesimPrivat = nenkategoria === 'Mësim privat'
  const isKompjuteri  = nenkategoria === 'Kurse kompjuteri'
  const isSporti      = nenkategoria === 'Kurse sporti'
  const isVallezimi   = nenkategoria === 'Kurse vallëzimi'
  const isTrajnim     = nenkategoria === 'Trajnim'

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

            {/* ── LLOJI ── */}
            <FilterSection title="Lloji">
              <ChipSelect name="mesim_lloji" options={LLOJI} value={mf.mesim_lloji} />
            </FilterSection>

            {/* ── NIVELI ── */}
            <FilterSection title="Niveli">
              <ChipSelect name="mesim_niveli" options={NIVELI} value={mf.mesim_niveli} />
            </FilterSection>

            {/* ── GJUHA ── */}
            <FilterSection title="Gjuha e mësimit">
              <ChipSelect name="gjuha" options={GJUHA} value={mf.gjuha} />
            </FilterSection>

            <Divider />

            {/* ── GJUHA E MËSUAR (Kurse gjuhe) ── */}
            {isGjuhe && (
              <>
                <FilterSection title="Gjuha e mësuar">
                  <select name="gjuha_mesuar" defaultValue={mf.gjuha_mesuar ?? ''} style={inputSt}>
                    <option value="">Zgjidh gjuhën</option>
                    {GJUHA_MESUAR.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </FilterSection>
                <Divider />
              </>
            )}

            {/* ── LËNDA (Mësim privat) ── */}
            {isMesimPrivat && (
              <>
                <FilterSection title="Lënda">
                  <ChipSelect name="lenda" options={LENDA} value={mf.lenda} />
                </FilterSection>
                <Divider />
              </>
            )}

            {/* ── LLOJI KOMPJUTERI ── */}
            {isKompjuteri && (
              <>
                <FilterSection title="Lloji">
                  <ChipSelect name="mesim_sub_lloji" options={LLOJI_KOMPJUTERI} value={mf.mesim_sub_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {/* ── LLOJI SPORTI ── */}
            {isSporti && (
              <>
                <FilterSection title="Lloji i sportit">
                  <select name="mesim_sub_lloji" defaultValue={mf.mesim_sub_lloji ?? ''} style={inputSt}>
                    <option value="">Zgjidh sportin</option>
                    {LLOJI_SPORTI.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </FilterSection>
                <Divider />
              </>
            )}

            {/* ── MOSHA VALLËZIMI ── */}
            {isVallezimi && (
              <>
                <FilterSection title="Mosha">
                  <ChipSelect name="mesim_sub_lloji" options={MOSHA_VALLEZIMI} value={mf.mesim_sub_lloji} />
                </FilterSection>
                <Divider />
              </>
            )}

            {/* ── LLOJI TRAJNIMI ── */}
            {isTrajnim && (
              <>
                <FilterSection title="Lloji i trajnimit">
                  <ChipSelect name="mesim_sub_lloji" options={LLOJI_TRAJNIMI} value={mf.mesim_sub_lloji} />
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
