import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import { CATEGORY_ICON } from '@/lib/kategori-data'
import FavoriteButton from '@/app/components/FavoriteButton'
import MeldeModal from '@/app/components/MeldeModal'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'

export default async function FavoritesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: favRows } = await supabase
    .from('favorites')
    .select('njoftim_id, krijuar_me')
    .eq('user_id', user.id)
    .order('krijuar_me', { ascending: false })

  const njoftimIds = (favRows ?? []).map(r => r.njoftim_id)

  let njoftimet: Record<string, unknown>[] = []
  if (njoftimIds.length > 0) {
    const { data } = await supabase
      .from('njoftimet')
      .select('*')
      .in('id', njoftimIds)
      .neq('aktive', false)
    njoftimet = data ?? []
  }

  // Preserve favorites order
  const adMap: Record<string, Record<string, unknown>> = Object.fromEntries(njoftimet.map(ad => [ad.id as string, ad]))
  const sortedAds = njoftimIds.map(id => adMap[id]).filter(Boolean)

  // Batch-fetch seller profiles for biznes badges
  const userIds = [...new Set(sortedAds.map(ad => ad.user_id as string).filter(Boolean))]
  const admin = createAdminClient()
  const { data: sellerProfiles } = userIds.length
    ? await admin.from('profiles').select('id, konto_typ, firma_name, avatar_url').in('id', userIds)
    : { data: [] }
  const sellerMap: Record<string, { konto_typ?: string; firma_name?: string; avatar_url?: string }> =
    Object.fromEntries((sellerProfiles ?? []).map(p => [p.id, p]))

  return (
    <main style={{ minHeight: '100vh', background: '#F5F5F7', fontFamily: FONT }}>
      <NavBar />

      {/* Header */}
      <section style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '20px 32px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#86868B', marginBottom: '8px' }}>
            <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
            <span>›</span>
            <span style={{ color: '#111111', fontWeight: '500' }}>Të ruajtuarat</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#E24B4A" stroke="#E24B4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111111', margin: 0, letterSpacing: '-0.6px' }}>
              Njoftime të ruajtura
            </h1>
            {sortedAds.length > 0 && (
              <span style={{
                background: '#F5F5F7',
                color: '#6E6E73',
                fontSize: '13px',
                fontWeight: '600',
                padding: '3px 10px',
                borderRadius: '20px',
              }}>
                {sortedAds.length}
              </span>
            )}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 32px 64px' }}>
        {sortedAds.length === 0 ? (
          /* Empty state */
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '80px 32px',
            textAlign: 'center',
            boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            <div style={{ marginBottom: '20px' }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D1D1D6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1D1D1F', marginBottom: '8px', letterSpacing: '-0.3px' }}>
              Nuk keni njoftime të ruajtura
            </h2>
            <p style={{ fontSize: '15px', color: '#6E6E73', marginBottom: '28px', lineHeight: '1.6', maxWidth: '360px', margin: '0 auto 28px' }}>
              Klikoni ikonën e zemrës mbi njoftimet që ju interesojnë për t&apos;i ruajtur këtu.
            </p>
            <a href="/" style={{
              display: 'inline-block',
              background: '#E24B4A',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              letterSpacing: '-0.1px',
            }}>
              Shfleto njoftime
            </a>
          </div>
        ) : (
          <div className="fav-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {sortedAds.map((ad) => {
              const isTregtar = sellerMap[ad.user_id as string]?.konto_typ === 'biznes'
              return (
                <div
                  key={ad.id as string}
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
                      {(ad.images as string[])?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={(ad.images as string[])[0]}
                          alt={ad.title as string}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        CATEGORY_ICON(ad.category as string)
                      )}
                      {isTregtar && (
                        <span style={{
                          position: 'absolute', top: '8px', left: '8px',
                          background: '#DA291C', color: '#fff',
                          fontSize: '10px', fontWeight: '700',
                          padding: '2px 7px', borderRadius: '5px',
                          letterSpacing: '0.3px', textTransform: 'uppercase',
                        }}>Tregtar</span>
                      )}
                      {isTregtar && sellerMap[ad.user_id as string]?.avatar_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={sellerMap[ad.user_id as string].avatar_url!}
                          alt=""
                          style={{
                            position: 'absolute', bottom: '8px', right: '8px',
                            width: '34px', height: '34px',
                            borderRadius: '50%',
                            border: '2px solid #fff',
                            objectFit: 'cover',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                          }}
                        />
                      )}
                      <FavoriteButton
                        njoftim_id={ad.id as string}
                        userId={user.id}
                        initialFavorited={true}
                      />
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
                        {ad.title as string}
                      </div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#DA291C',
                        letterSpacing: '-0.2px',
                        marginBottom: '4px',
                      }}>
                        {(ad.price as number).toLocaleString('de-DE')} €
                      </div>
                      <div style={{ fontSize: '11px', color: '#86868B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{ad.city as string}</span>
                        <MeldeModal anzeige_id={ad.id as string} />
                      </div>
                    </div>
                  </a>
                  {user.id !== (ad.user_id as string) && (
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
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
