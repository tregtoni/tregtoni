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
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      {/* Search bar */}
      <section style={{
        background: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '24px 32px',
      }}>
        <form action="/kerko" method="GET">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              background: '#fff',
              border: '1.5px solid rgba(0,0,0,0.12)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              marginBottom: '12px',
            }}>
              <input
                name="q"
                type="text"
                defaultValue={q ?? ''}
                placeholder="Çfarë po kërkon?"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '14px 18px',
                  fontSize: '15px',
                  color: '#1D1D1F',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit',
                }}
              />
              <button type="submit" style={{
                background: '#DA291C',
                color: '#fff',
                border: 'none',
                padding: '14px 28px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                Kërko
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                name="kategoria"
                defaultValue={kategoria ?? ''}
                style={{
                  flex: '1 1 180px',
                  padding: '10px 14px',
                  border: '1.5px solid rgba(0,0,0,0.1)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: '#1D1D1F',
                  background: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Të gjitha kategoritë</option>
                {KATEGORITË.map(k => (
                  <option key={k.slug} value={k.slug}>{k.shortName}</option>
                ))}
              </select>

              <select
                name="qyteti"
                defaultValue={qyteti ?? ''}
                style={{
                  flex: '1 1 180px',
                  padding: '10px 14px',
                  border: '1.5px solid rgba(0,0,0,0.1)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: '#1D1D1F',
                  background: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Të gjitha qytetet</option>
                <optgroup label="Shqipëri">
                  {QYTETET_SHQIPERI.map(q => <option key={q} value={q}>{q}</option>)}
                </optgroup>
                <optgroup label="Kosovë">
                  {QYTETET_KOSOVE.map(q => <option key={q} value={q}>{q}</option>)}
                </optgroup>
              </select>

              <button type="submit" style={{
                padding: '10px 20px',
                background: '#1D1D1F',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                Filtro
              </button>

              {(q || kategoria || qyteti) && (
                <a
                  href="/kerko"
                  style={{
                    padding: '10px 16px',
                    background: '#F5F5F7',
                    color: '#6E6E73',
                    border: '1.5px solid rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: '500',
                  }}
                >
                  Pastro
                </a>
              )}
            </div>
          </div>
        </form>
      </section>

      {/* Results header */}
      <section style={{ padding: '24px 32px 0' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#1D1D1F',
            letterSpacing: '-0.4px',
            margin: 0,
            marginBottom: '4px',
          }}>
            {q ? `Rezultate për "${q}"` : 'Të gjitha njoftimet'}
          </h1>
          <p style={{ fontSize: '14px', color: '#86868B', margin: 0, marginBottom: '20px' }}>
            {numri} njoftim{numri !== 1 ? 'e' : ''}
            {kategoria ? ` në "${KATEGORITË.find(k => k.slug === kategoria)?.shortName ?? kategoria}"` : ''}
            {qyteti ? ` në ${qyteti}` : ''}
          </p>
        </div>
      </section>

      {/* Results grid */}
      <section style={{ padding: '0 32px 48px', minHeight: '300px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          {rezultatet && rezultatet.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {rezultatet.map((ad) => (
                <div
                  key={ad.id}
                  style={{
                    background: '#fff',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                    border: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <a href={`/njoftim/${ad.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div style={{
                      height: '150px',
                      background: '#F5F5F7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {ad.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ad.images[0]} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                      ) : CATEGORY_ICON(ad.category)}
                    </div>
                    <div style={{ padding: '14px 16px 12px' }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#DA291C',
                        letterSpacing: '-0.3px',
                        marginBottom: '4px',
                      }}>
                        {ad.price.toLocaleString('de-DE')} €
                      </div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#1D1D1F',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {ad.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#86868B' }}>
                        {ad.city}
                      </div>
                    </div>
                  </a>
                  {user && user.id !== ad.user_id && (
                    <div style={{ padding: '0 12px 14px' }}>
                      <a
                        href={`/mesazhet/${ad.user_id}?njoftim=${ad.id}`}
                        style={{
                          display: 'block',
                          background: '#1D1D1F',
                          color: '#fff',
                          textAlign: 'center',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          textDecoration: 'none',
                          fontWeight: '500',
                        }}
                      >
                        Dërgo mesazh
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '72px 24px',
              background: '#fff',
              borderRadius: '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#F5F5F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '24px',
              }}>
                —
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1D1D1F',
                marginBottom: '10px',
                letterSpacing: '-0.3px',
              }}>
                Nuk u gjet asnjë njoftim
              </h2>
              <p style={{
                fontSize: '15px',
                color: '#6E6E73',
                marginBottom: '28px',
                maxWidth: '360px',
                margin: '0 auto 28px',
                lineHeight: '1.6',
              }}>
                {q
                  ? `Nuk ka njoftime që përputhen me "${q}". Provo fjalë të tjera ose largo filtrat.`
                  : 'Nuk ka njoftime për kriteret e zgjedhura.'}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/kerko" style={{
                  background: '#F5F5F7',
                  color: '#1D1D1F',
                  padding: '11px 22px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  border: '1px solid rgba(0,0,0,0.1)',
                  fontWeight: '500',
                }}>
                  Pastro filtrat
                </a>
                <a href="/njoftim/shto" style={{
                  background: '#DA291C',
                  color: '#fff',
                  padding: '11px 22px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}>
                  Shto njoftim
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
