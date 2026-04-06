import { createClient } from '@/lib/supabase/server'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import { KATEGORITË, CATEGORY_ICON, QYTETET_SHQIPERI, QYTETET_KOSOVE } from '@/lib/kategori-data'

export default async function KerkoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategoria?: string; qyteti?: string }>
}) {
  const { q, kategoria, qyteti } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase.from('njoftimet').select('*').order('created_at', { ascending: false })

  if (q && q.trim()) {
    query = query.or(`title.ilike.%${q.trim()}%,description.ilike.%${q.trim()}%`)
  }

  if (kategoria) {
    query = query.eq('category', kategoria)
  }

  if (qyteti) {
    query = query.eq('city', qyteti)
  }

  const { data: rezultatet } = await query

  const numri = rezultatet?.length ?? 0

  return (
    <main>
      <NavBar />

      {/* Search bar */}
      <section style={{ background: '#fff', borderBottom: '3px solid #E24B4A', padding: '24px' }}>
        <form action="/kerko" method="GET">
          <div style={{ display: 'flex', maxWidth: '700px', margin: '0 auto 16px', border: '2px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
            <input
              name="q"
              type="text"
              defaultValue={q ?? ''}
              placeholder="Çfarë po kërkon?"
              style={{ flex: 1, border: 'none', outline: 'none', padding: '13px 18px', fontSize: '15px', color: '#111', backgroundColor: '#fff' }}
            />
            <button type="submit" style={{ background: '#E24B4A', color: '#fff', border: 'none', padding: '13px 28px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              Kërko
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', maxWidth: '700px', margin: '0 auto', flexWrap: 'wrap' }}>
            <select
              name="kategoria"
              defaultValue={kategoria ?? ''}
              style={{ flex: 1, minWidth: '160px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', color: '#111', background: '#fff', cursor: 'pointer' }}
            >
              <option value="">Të gjitha kategoritë</option>
              {KATEGORITË.map(k => (
                <option key={k.slug} value={k.slug}>{k.icon} {k.shortName}</option>
              ))}
            </select>

            <select
              name="qyteti"
              defaultValue={qyteti ?? ''}
              style={{ flex: 1, minWidth: '160px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', color: '#111', background: '#fff', cursor: 'pointer' }}
            >
              <option value="">Të gjitha qytetet</option>
              <optgroup label="Shqipëri">
                {QYTETET_SHQIPERI.map(q => <option key={q} value={q}>{q}</option>)}
              </optgroup>
              <optgroup label="Kosovë">
                {QYTETET_KOSOVE.map(q => <option key={q} value={q}>{q}</option>)}
              </optgroup>
            </select>

            <button
              type="submit"
              style={{ padding: '10px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
            >
              Filtro
            </button>

            {(q || kategoria || qyteti) && (
              <a
                href="/kerko"
                style={{ padding: '10px 16px', background: '#f4f4f4', color: '#666', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              >
                ✕ Pastro
              </a>
            )}
          </div>
        </form>
      </section>

      {/* Results header */}
      <section style={{ padding: '20px 24px 0', background: '#f9f9f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', margin: 0 }}>
            {q ? `Rezultate për "${q}"` : 'Të gjitha njoftimet'}
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: '#999', paddingLeft: '13px', marginTop: '4px', marginBottom: 0 }}>
          {numri} njoftim{numri !== 1 ? 'e' : ''} {kategoria ? `në kategorinë "${KATEGORITË.find(k => k.slug === kategoria)?.shortName ?? kategoria}"` : ''}{qyteti ? ` në ${qyteti}` : ''}
        </p>
      </section>

      {/* Results grid */}
      <section style={{ padding: '16px 24px 32px', background: '#f9f9f9', minHeight: '300px' }}>
        {rezultatet && rezultatet.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {rezultatet.map((ad) => (
              <div key={ad.id} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
                <a href={`/njoftim/${ad.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ height: '120px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', position: 'relative', overflow: 'hidden' }}>
                    {ad.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ad.images[0]} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                    ) : CATEGORY_ICON(ad.category)}
                    <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#E24B4A', color: '#fff', fontSize: '10px', padding: '3px 7px', borderRadius: '4px' }}>I RI</span>
                  </div>
                  <div style={{ padding: '10px 12px 6px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#111' }}>{ad.price.toLocaleString('de-DE')} €</div>
                    <div style={{ fontSize: '12px', color: '#444', marginTop: '3px' }}>{ad.title}</div>
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>📍 {ad.city}</div>
                  </div>
                </a>
                {user && user.id !== ad.user_id && (
                  <div style={{ padding: '0 10px 10px' }}>
                    <a
                      href={`/mesazhet/${ad.user_id}?njoftim=${ad.id}`}
                      style={{ display: 'block', background: '#111', color: '#fff', textAlign: 'center', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}
                    >
                      💬 Dërgo mesazh
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#999' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>
              Nuk u gjet asnjë njoftim
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', maxWidth: '360px', margin: '0 auto 20px' }}>
              {q
                ? `Nuk ka njoftime që përputhen me "${q}". Provo fjalë të tjera ose largo filtrat.`
                : 'Nuk ka njoftime për kriteret e zgjedhura. Provo të ndryshosh filtrat.'}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/kerko" style={{ background: '#f4f4f4', color: '#333', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', border: '1px solid #ddd' }}>
                Pastro filtrat
              </a>
              <a href="/njoftim/shto" style={{ background: '#E24B4A', color: '#fff', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}>
                + Shto njoftim
              </a>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
