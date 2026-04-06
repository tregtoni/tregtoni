import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import { KATEGORI_MAP, MARKAT_MAKINA, MARKAT_MOTOCIKLETA, QYTETET, RENDITJA } from '@/lib/kategori-data'

type SearchParams = {
  nenkategoria?: string
  marka?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 60) return `${min} min më parë`
  const hrs = Math.floor(min / 60)
  if (hrs < 24) return `${hrs} orë më parë`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days} ditë më parë`
  return new Date(dateStr).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short' })
}

export default async function KategoriPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await params
  const { nenkategoria, marka, cmimi_min, cmimi_max, qyteti, rendit } = await searchParams

  const kategoria = KATEGORI_MAP[slug]
  if (!kategoria) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isMakina = slug === 'makina'
  const showingMarka = nenkategoria === 'Makina'
  const showingMoto = nenkategoria === 'Motorçikleta'

  // Fetch subcategory + marka counts for the whole category
  const { data: teGjitha } = await supabase
    .from('njoftimet')
    .select('subcategory, marka')
    .eq('category', slug)

  const countPerNen: Record<string, number> = {}
  const countPerMarka: Record<string, number> = {}
  const countPerMotoMarka: Record<string, number> = {}
  for (const row of teGjitha ?? []) {
    const nen = row.subcategory || ''
    countPerNen[nen] = (countPerNen[nen] ?? 0) + 1
    if (isMakina && row.marka) {
      if (nen === 'Motorçikleta') {
        countPerMotoMarka[row.marka] = (countPerMotoMarka[row.marka] ?? 0) + 1
      } else if (nen === 'Makina') {
        countPerMarka[row.marka] = (countPerMarka[row.marka] ?? 0) + 1
      }
    }
  }
  const totalCount = teGjitha?.length ?? 0
  const markaCount = Object.values(countPerMarka).reduce((a, b) => a + b, 0)
  const motoMarkaCount = Object.values(countPerMotoMarka).reduce((a, b) => a + b, 0)

  // Build filtered query
  let query = supabase.from('njoftimet').select('*').eq('category', slug)

  if (showingMarka) {
    query = query.eq('subcategory', 'Makina')
    if (marka) query = query.eq('marka', marka)
  } else if (showingMoto) {
    query = query.eq('subcategory', 'Motorçikleta')
    if (marka) query = query.eq('marka', marka)
  } else if (nenkategoria) {
    query = query.eq('subcategory', nenkategoria)
  }

  if (cmimi_min) query = query.gte('price', parseFloat(cmimi_min))
  if (cmimi_max) query = query.lte('price', parseFloat(cmimi_max))
  if (qyteti) query = query.eq('city', qyteti)

  switch (rendit) {
    case 'te_vjetrat':      query = query.order('created_at', { ascending: true }); break
    case 'me_i_lire':       query = query.order('price',      { ascending: true }); break
    case 'me_i_shtrenjtë':  query = query.order('price',      { ascending: false }); break
    default:                query = query.order('created_at', { ascending: false })
  }

  const { data: njoftimet } = await query

  const numri = njoftimet?.length ?? 0
  const hasFilters = !!(nenkategoria || marka || cmimi_min || cmimi_max || qyteti || rendit)
  const renditLabel = RENDITJA.find(r => r.value === rendit)?.label ?? 'Më të rejat'
  const clearUrl = `/kategori/${slug}`

  const sidebarLink = (p: Record<string, string | undefined>) => {
    const sp = new URLSearchParams()
    if (p.nenkategoria) sp.set('nenkategoria', p.nenkategoria)
    if (p.marka)        sp.set('marka',        p.marka)
    if (p.cmimi_min)    sp.set('cmimi_min',    p.cmimi_min)
    if (p.cmimi_max)    sp.set('cmimi_max',    p.cmimi_max)
    if (p.qyteti)       sp.set('qyteti',       p.qyteti)
    if (p.rendit)       sp.set('rendit',        p.rendit)
    const qs = sp.toString()
    return `/kategori/${slug}${qs ? `?${qs}` : ''}`
  }

  const breadcrumb = marka ? marka : nenkategoria

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />

      {/* Header */}
      <section style={{ background: '#fff', borderBottom: '3px solid #E24B4A', padding: '14px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '6px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Kryefaqja</a>
          <span style={{ color: '#ccc' }}>›</span>
          <a href={clearUrl} style={{ color: breadcrumb ? '#999' : '#111', textDecoration: 'none' }}>{kategoria.name}</a>
          {nenkategoria && (
            <>
              <span style={{ color: '#ccc' }}>›</span>
              <a href={sidebarLink({ nenkategoria, cmimi_min, cmimi_max, qyteti, rendit })} style={{ color: marka ? '#999' : '#111', textDecoration: 'none' }}>
                {nenkategoria}
              </a>
            </>
          )}
          {marka && (
            <>
              <span style={{ color: '#ccc' }}>›</span>
              <span style={{ color: '#111' }}>{marka}</span>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>{kategoria.icon}</span>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111', margin: 0 }}>
              {marka ?? nenkategoria ?? kategoria.name}
            </h1>
            <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
              {totalCount.toLocaleString('de-DE')} njoftime gjithsej
            </p>
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 16px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Subcategories */}
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #eee' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>Nënkategoritë</span>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: '6px 0' }}>
              <li>
                <a href={clearUrl} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 14px', textDecoration: 'none', fontSize: '13px',
                  color: !nenkategoria ? '#E24B4A' : '#333',
                  fontWeight: !nenkategoria ? '600' : '400',
                  background: !nenkategoria ? '#fff5f5' : 'transparent',
                }}>
                  <span>Të gjitha</span>
                  <span style={{ fontSize: '11px', color: '#999', background: '#f4f4f4', padding: '1px 6px', borderRadius: '10px' }}>{totalCount}</span>
                </a>
              </li>
              {kategoria.nenkategori.map(nen => {
                const cnt = countPerNen[nen] ?? 0
                const active = nenkategoria === nen
                return (
                  <li key={nen}>
                    <a
                      href={sidebarLink({ nenkategoria: nen, cmimi_min, cmimi_max, qyteti, rendit })}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 14px', textDecoration: 'none', fontSize: '13px',
                        color: active ? '#E24B4A' : '#333',
                        fontWeight: active ? '600' : '400',
                        background: active ? '#fff5f5' : 'transparent',
                        borderLeft: active ? '3px solid #E24B4A' : '3px solid transparent',
                      }}
                    >
                      <span>{nen}</span>
                      <span style={{ fontSize: '11px', color: '#999', background: '#f4f4f4', padding: '1px 6px', borderRadius: '10px' }}>{cnt}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Brand list — shown when nenkategoria === 'Makina' */}
          {showingMarka && (
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>Zgjidh markën</span>
                {marka && (
                  <a href={sidebarLink({ nenkategoria: 'Makina', cmimi_min, cmimi_max, qyteti, rendit })}
                    style={{ fontSize: '11px', color: '#999', textDecoration: 'none' }}>✕ Pastro</a>
                )}
              </div>
              <a
                href={sidebarLink({ nenkategoria: 'Makina', cmimi_min, cmimi_max, qyteti, rendit })}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 14px', textDecoration: 'none', fontSize: '13px',
                  color: !marka ? '#E24B4A' : '#555',
                  fontWeight: !marka ? '600' : '400',
                  background: !marka ? '#fff5f5' : 'transparent',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                <span>Të gjitha markat</span>
                <span style={{ fontSize: '11px', color: '#999', background: '#f4f4f4', padding: '1px 6px', borderRadius: '10px' }}>{markaCount}</span>
              </a>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {MARKAT_MAKINA.map(m => {
                  const cnt = countPerMarka[m] ?? 0
                  const active = marka === m
                  return (
                    <a
                      key={m}
                      href={sidebarLink({ nenkategoria: 'Makina', marka: m, cmimi_min, cmimi_max, qyteti, rendit })}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '7px 14px', textDecoration: 'none', fontSize: '13px',
                        color: active ? '#E24B4A' : '#333',
                        fontWeight: active ? '600' : '400',
                        background: active ? '#fff5f5' : 'transparent',
                        borderLeft: active ? '3px solid #E24B4A' : '3px solid transparent',
                      }}
                    >
                      <span>{m}</span>
                      {cnt > 0 && (
                        <span style={{ fontSize: '11px', color: '#999', background: '#f4f4f4', padding: '1px 6px', borderRadius: '10px' }}>{cnt}</span>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Motorcycle brand panel — shown when nenkategoria === 'Motorçikleta' */}
          {showingMoto && (
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>Zgjidh markën</span>
                {marka && (
                  <a href={sidebarLink({ nenkategoria: 'Motorçikleta', cmimi_min, cmimi_max, qyteti, rendit })}
                    style={{ fontSize: '11px', color: '#999', textDecoration: 'none' }}>✕ Pastro</a>
                )}
              </div>
              <a
                href={sidebarLink({ nenkategoria: 'Motorçikleta', cmimi_min, cmimi_max, qyteti, rendit })}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 14px', textDecoration: 'none', fontSize: '13px',
                  color: !marka ? '#E24B4A' : '#555',
                  fontWeight: !marka ? '600' : '400',
                  background: !marka ? '#fff5f5' : 'transparent',
                  borderBottom: '1px solid #f5f5f5',
                }}
              >
                <span>Të gjitha markat</span>
                <span style={{ fontSize: '11px', color: '#999', background: '#f4f4f4', padding: '1px 6px', borderRadius: '10px' }}>{motoMarkaCount}</span>
              </a>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {MARKAT_MOTOCIKLETA.map(m => {
                  const cnt = countPerMotoMarka[m] ?? 0
                  const active = marka === m
                  return (
                    <a
                      key={m}
                      href={sidebarLink({ nenkategoria: 'Motorçikleta', marka: m, cmimi_min, cmimi_max, qyteti, rendit })}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '7px 14px', textDecoration: 'none', fontSize: '13px',
                        color: active ? '#E24B4A' : '#333',
                        fontWeight: active ? '600' : '400',
                        background: active ? '#fff5f5' : 'transparent',
                        borderLeft: active ? '3px solid #E24B4A' : '3px solid transparent',
                      }}
                    >
                      <span>{m}</span>
                      {cnt > 0 && (
                        <span style={{ fontSize: '11px', color: '#999', background: '#f4f4f4', padding: '1px 6px', borderRadius: '10px' }}>{cnt}</span>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Filters */}
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #eee' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#111' }}>Filtrat</span>
            </div>
            <form action={`/kategori/${slug}`} method="GET" style={{ padding: '14px' }}>
              {nenkategoria && <input type="hidden" name="nenkategoria" value={nenkategoria} />}
              {marka && <input type="hidden" name="marka" value={marka} />}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#666', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Çmimi (€)
                </label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input name="cmimi_min" type="number" defaultValue={cmimi_min ?? ''} placeholder="Min" min="0"
                    style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '6px', padding: '7px 8px', fontSize: '13px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                  <span style={{ color: '#ccc', fontSize: '12px' }}>—</span>
                  <input name="cmimi_max" type="number" defaultValue={cmimi_max ?? ''} placeholder="Max" min="0"
                    style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '6px', padding: '7px 8px', fontSize: '13px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#666', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Qyteti
                </label>
                <select name="qyteti" defaultValue={qyteti ?? ''}
                  style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '6px', padding: '7px 8px', fontSize: '13px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">Të gjitha qytetet</option>
                  {QYTETET.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#666', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Renditja
                </label>
                <select name="rendit" defaultValue={rendit ?? 're_re'}
                  style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '6px', padding: '7px 8px', fontSize: '13px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  {RENDITJA.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              <button type="submit"
                style={{ width: '100%', background: '#E24B4A', color: '#fff', border: 'none', padding: '10px', borderRadius: '7px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px' }}>
                Apliko filtrat
              </button>
              {hasFilters && (
                <a href={clearUrl} style={{ display: 'block', textAlign: 'center', color: '#999', fontSize: '12px', textDecoration: 'none' }}>
                  ✕ Pastro filtrat
                </a>
              )}
            </form>
          </div>

          <a href="/njoftim/shto"
            style={{ display: 'block', background: '#111', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>
            + Shto njoftim falas
          </a>
        </aside>

        {/* ── LISTINGS ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Results bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '10px 14px', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
            <span style={{ fontSize: '13px', color: '#666' }}>
              <strong style={{ color: '#111' }}>{numri.toLocaleString('de-DE')}</strong> njoftim{numri !== 1 ? 'e' : ''}
              {marka ? ` · ${marka}` : nenkategoria ? ` · ${nenkategoria}` : ''}
              {qyteti ? ` · ${qyteti}` : ''}
            </span>
            <span style={{ fontSize: '12px', color: '#999' }}>{renditLabel}</span>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {marka && (
                <a href={sidebarLink({ nenkategoria: showingMoto ? 'Motorçikleta' : 'Makina', cmimi_min, cmimi_max, qyteti, rendit })}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fff5f5', color: '#E24B4A', border: '1px solid #fcc', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', textDecoration: 'none' }}>
                  {showingMoto ? '🏍️' : '🚗'} {marka} ×
                </a>
              )}
              {nenkategoria && !marka && (
                <a href={sidebarLink({ cmimi_min, cmimi_max, qyteti, rendit })}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fff5f5', color: '#E24B4A', border: '1px solid #fcc', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', textDecoration: 'none' }}>
                  {nenkategoria} ×
                </a>
              )}
              {qyteti && (
                <a href={sidebarLink({ nenkategoria, marka, cmimi_min, cmimi_max, rendit })}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fff5f5', color: '#E24B4A', border: '1px solid #fcc', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', textDecoration: 'none' }}>
                  📍 {qyteti} ×
                </a>
              )}
              {(cmimi_min || cmimi_max) && (
                <a href={sidebarLink({ nenkategoria, marka, qyteti, rendit })}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fff5f5', color: '#E24B4A', border: '1px solid #fcc', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', textDecoration: 'none' }}>
                  {cmimi_min ?? '0'} — {cmimi_max ?? '∞'} € ×
                </a>
              )}
            </div>
          )}

          {/* Listing rows */}
          {njoftimet && njoftimet.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {njoftimet.map(ad => {
                const images: string[] = ad.images ?? []
                return (
                  <a key={ad.id} href={`/njoftim/${ad.id}`}
                    style={{ display: 'flex', background: '#fff', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', textDecoration: 'none' }}>
                    <div style={{ width: '160px', minHeight: '110px', flexShrink: 0, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', overflow: 'hidden', position: 'relative' }}>
                      {images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={images[0]} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                      ) : kategoria.icon}
                      {images.length > 1 && (
                        <span style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                          +{images.length - 1}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '500', color: '#111', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ad.title}
                        </div>
                        {ad.description && (
                          <div style={{ fontSize: '12px', color: '#666', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.5' }}>
                            {ad.description}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '700', color: '#E24B4A' }}>
                            {ad.price.toLocaleString('de-DE')} €
                          </div>
                          <div style={{ fontSize: '11px', color: '#999', marginTop: '2px', display: 'flex', gap: '8px' }}>
                            {ad.marka && <span style={{ color: '#555', fontWeight: '500' }}>{ad.marka}</span>}
                            {ad.subcategory && ad.subcategory !== 'Marka' && <span>{ad.subcategory}</span>}
                            <span>📍 {ad.city}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#bbb', flexShrink: 0 }}>{timeAgo(ad.created_at)}</div>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '14px' }}>{kategoria.icon}</div>
              <h2 style={{ fontSize: '17px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>Nuk ka njoftime</h2>
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>
                {hasFilters ? 'Nuk ka njoftime për filtrat e zgjedhura. Provo të ndryshosh kriteret.' : 'Nuk ka njoftime në këtë kategori aktualisht.'}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {hasFilters && <a href={clearUrl} style={{ padding: '9px 18px', background: '#f4f4f4', color: '#333', borderRadius: '7px', fontSize: '13px', textDecoration: 'none', border: '1px solid #ddd' }}>Pastro filtrat</a>}
                <a href="/njoftim/shto" style={{ padding: '9px 18px', background: '#E24B4A', color: '#fff', borderRadius: '7px', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>+ Shto njoftim</a>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
