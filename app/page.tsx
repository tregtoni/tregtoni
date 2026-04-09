import { createClient } from '@/lib/supabase/server'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import { KATEGORITË, CATEGORY_ICON, QYTETET_SHQIPERI, QYTETET_KOSOVE } from '@/lib/kategori-data'
import MeldeModal from '@/app/components/MeldeModal'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: njoftimet } = await supabase
    .from('njoftimet')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)

  const { data: counts } = await supabase
    .from('njoftimet')
    .select('category')

  const countPerCat: Record<string, number> = {}
  for (const row of counts ?? []) {
    countPerCat[row.category] = (countPerCat[row.category] ?? 0) + 1
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      {/* ── Hero ── */}
      <section style={{
        background: '#fff',
        padding: '72px 32px 56px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <h1 style={{
          fontSize: '52px',
          fontWeight: '700',
          color: '#1D1D1F',
          letterSpacing: '-1.5px',
          lineHeight: '1.08',
          marginBottom: '10px',
          whiteSpace: 'nowrap',
        }}>
          Blini. Shitni. <span style={{ color: '#DA291C' }}>Tregtoni.</span>
        </h1>
        <p style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#DA291C',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          marginBottom: '40px',
        }}>
          Platforma nr.1 shqiptare për njoftime
        </p>

        {/* Search bar */}
        <form action="/kerko" method="GET" style={{ maxWidth: '880px', margin: '0 auto 0' }}>
          <div style={{
            display: 'flex',
            background: '#fff',
            border: '1.5px solid rgba(0,0,0,0.12)',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <input
              name="q"
              type="text"
              placeholder="Çfarë po kërkon?"
              style={{
                flex: '1 1 0',
                border: 'none',
                outline: 'none',
                padding: '17px 20px',
                fontSize: '15px',
                color: '#1D1D1F',
                backgroundColor: 'transparent',
                minWidth: 0,
                fontFamily: 'inherit',
              }}
            />
            <div style={{ width: '1px', background: 'rgba(0,0,0,0.08)', flexShrink: 0, margin: '12px 0' }} />
            <select
              name="kategoria"
              style={{
                flex: '0 0 auto',
                width: '164px',
                border: 'none',
                outline: 'none',
                padding: '17px 12px',
                fontSize: '14px',
                color: '#1D1D1F',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <option value="">Të gjitha</option>
              {KATEGORITË.map(k => (
                <option key={k.slug} value={k.slug}>{k.shortName}</option>
              ))}
            </select>
            <div style={{ width: '1px', background: 'rgba(0,0,0,0.08)', flexShrink: 0, margin: '12px 0' }} />
            <select
              name="qyteti"
              style={{
                flex: '0 0 auto',
                width: '164px',
                border: 'none',
                outline: 'none',
                padding: '17px 12px',
                fontSize: '14px',
                color: '#1D1D1F',
                backgroundColor: 'transparent',
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
            <div style={{ width: '1px', background: 'rgba(0,0,0,0.08)', flexShrink: 0, margin: '12px 0' }} />
            <select
              name="rrezja"
              style={{
                flex: '0 0 auto',
                width: '164px',
                border: 'none',
                outline: 'none',
                padding: '17px 12px',
                fontSize: '14px',
                color: '#1D1D1F',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <option value="">Gjithë Shqipërinë</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
              <option value="200">200 km</option>
            </select>
            <button
              type="submit"
              style={{
                background: '#DA291C',
                color: '#fff',
                border: 'none',
                padding: '17px 28px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                flexShrink: 0,
                fontFamily: 'inherit',
                letterSpacing: '-0.1px',
              }}
            >
              Kërko
            </button>
          </div>
        </form>

        {/* Quick tags */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
          {['BMW', 'iPhone', 'Apartament', 'Laptop', 'Punë'].map(tag => (
            <a
              key={tag}
              href={`/kerko?q=${encodeURIComponent(tag)}`}
              style={{
                background: '#F5F5F7',
                color: '#1D1D1F',
                fontSize: '13px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid rgba(0,0,0,0.1)',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              {tag}
            </a>
          ))}
        </div>

        <p style={{
          fontSize: '14px',
          color: '#86868B',
          marginTop: '20px',
          fontWeight: '400',
        }}>
          Mijëra njoftime falas në Shqipëri dhe Kosovë.
        </p>
      </section>

      {/* ── Categories ── */}
      <section style={{ padding: '56px 32px', background: '#F5F5F7' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1D1D1F',
              letterSpacing: '-0.6px',
              margin: 0,
            }}>
              Kategoritë
            </h2>
            <a href="/kerko" style={{
              color: '#DA291C',
              fontSize: '14px',
              textDecoration: 'none',
              fontWeight: '500',
            }}>
              Shiko të gjitha →
            </a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '12px',
          }}>
            {KATEGORITË.map(cat => (
              <a
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '20px 8px 16px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px', lineHeight: '1' }}>{cat.icon}</div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#1D1D1F',
                  lineHeight: '1.3',
                  marginBottom: '4px',
                }}>
                  {cat.shortName}
                </div>
                {countPerCat[cat.slug] ? (
                  <div style={{ fontSize: '11px', color: '#86868B' }}>
                    {countPerCat[cat.slug].toLocaleString('de-DE')}
                  </div>
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest listings ── */}
      <section style={{ padding: '0 32px 64px', background: '#F5F5F7' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1D1D1F',
              letterSpacing: '-0.6px',
              margin: 0,
            }}>
              Njoftimet e fundit
            </h2>
            <a href="/kerko" style={{
              color: '#DA291C',
              fontSize: '14px',
              textDecoration: 'none',
              fontWeight: '500',
            }}>
              Shiko të gjitha →
            </a>
          </div>

          {njoftimet && njoftimet.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {njoftimet.map((ad) => (
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
                      height: '160px',
                      background: '#F5F5F7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '44px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      {ad.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ad.images[0]}
                          alt={ad.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        CATEGORY_ICON(ad.category)
                      )}
                    </div>
                    <div style={{ padding: '12px 14px 10px' }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1D1D1F',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '5px',
                        letterSpacing: '-0.1px',
                      }}>
                        {ad.title}
                      </div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#DA291C',
                        letterSpacing: '-0.2px',
                        marginBottom: '4px',
                      }}>
                        {ad.price.toLocaleString('de-DE')} €
                      </div>
                      <div style={{ fontSize: '11px', color: '#86868B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{ad.city}</span>
                        <MeldeModal anzeige_id={ad.id} />
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
              padding: '60px 24px',
              background: '#fff',
              borderRadius: '18px',
              color: '#86868B',
              fontSize: '15px',
            }}>
              Nuk ka njoftime aktualisht.{' '}
              <a href="/njoftim/shto" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '500' }}>
                Shto i pari!
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{
        background: '#1D1D1F',
        padding: '56px 32px',
      }}>
        <div style={{
          maxWidth: '640px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
          textAlign: 'center',
        }}>
          {[
            { num: '124', label: 'Njoftime aktive' },
            { num: '89', label: 'Përdorues' },
            { num: '3', label: 'Shtete' },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '0 24px',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <div style={{
                fontSize: '42px',
                fontWeight: '700',
                color: '#DA291C',
                letterSpacing: '-1px',
                lineHeight: '1',
                marginBottom: '8px',
              }}>
                {s.num}
              </div>
              <div style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: '500',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '80px 32px',
        background: '#fff',
        textAlign: 'center',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#1D1D1F',
          letterSpacing: '-0.8px',
          marginBottom: '12px',
        }}>
          Gati të <span style={{ color: '#E24B4A' }}>tregtoni?</span>
        </h2>
        <p style={{
          fontSize: '17px',
          color: '#6E6E73',
          marginBottom: '32px',
          fontWeight: '400',
        }}>
          Shto njoftimin tënd falas dhe arrij mijëra blerës.
        </p>
        <a
          href="/njoftim/shto"
          style={{
            display: 'inline-block',
            background: '#DA291C',
            color: '#fff',
            padding: '16px 40px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '14px',
            textDecoration: 'none',
            letterSpacing: '-0.2px',
          }}
        >
          Shto njoftim falas
        </a>
      </section>

      <Footer />
    </main>
  )
}
