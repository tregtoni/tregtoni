import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import MeldeModal from '@/app/components/MeldeModal'
import { CATEGORY_ICON } from '@/lib/kategori-data'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

export default async function PublicProfilPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const admin = createAdminClient()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await admin
    .from('profiles')
    .select('id, full_name, avatar_url, qyteti, bio, zeige_qyteti, zeige_telefon, created_at, konto_typ, firma_name, adresa, website, beschreibung_firma')
    .eq('id', id)
    .single()

  const { data: njoftimet } = await admin
    .from('njoftimet')
    .select('id, title, price, city, category, images, created_at')
    .eq('user_id', id)
    .neq('aktive', false)
    .order('created_at', { ascending: false })

  if (!profile && (!njoftimet || njoftimet.length === 0)) notFound()

  const kontoTyp   = (profile?.konto_typ  as string | null) ?? 'privat'
  const isBusiness = kontoTyp === 'biznes'
  const firmaName  = (profile?.firma_name as string | null) ?? null
  const fullName   = (profile?.full_name  as string | null) ?? ''
  const displayName = isBusiness && firmaName ? firmaName : fullName

  const nameParts = displayName.trim().split(/\s+/).filter(Boolean)
  const initials = nameParts.length >= 2
    ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    : nameParts[0]?.[0]?.toUpperCase() ?? ''
  const avatarUrl          = (profile?.avatar_url         as string | null) ?? null
  const bio                = (profile?.bio                as string | null) ?? null
  const zeigeQyteti        = (profile?.zeige_qyteti       as boolean | null) ?? true
  const qyteti             = (profile?.qyteti             as string | null) ?? null
  const adresa             = (profile?.adresa             as string | null) ?? null
  const website            = (profile?.website            as string | null) ?? null
  const beschreibungFirma  = (profile?.beschreibung_firma as string | null) ?? null

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at as string).toLocaleDateString('sq-AL', { month: 'long', year: 'numeric' })
    : null

  const isOwnProfile = user?.id === id
  const adCount = njoftimet?.length ?? 0

  return (
    <main style={{ minHeight: '100vh', background: '#F5F5F7', fontFamily: FONT }}>
      <NavBar />

      <div className="detail-container" style={{ maxWidth: '880px', margin: '0 auto', padding: '28px 24px 64px' }}>

        {/* ── Profile card ── */}
        <div style={{
          background: '#fff', borderRadius: '24px', padding: '40px 32px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{ flexShrink: 0 }}>
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={displayName} style={{
                  width: '88px', height: '88px', borderRadius: '50%',
                  objectFit: 'cover', border: `3px solid ${RED}`,
                }} />
              ) : (
                <div style={{
                  width: '88px', height: '88px', borderRadius: isBusiness ? '20px' : '50%',
                  background: RED, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '34px', fontWeight: '700', flexShrink: 0,
                }}>
                  {initials}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.5px' }}>
                  {displayName}
                </h1>
                {/* Tregtar badge */}
                {isBusiness && (
                  <span style={{
                    background: RED, color: '#fff',
                    fontSize: '11px', fontWeight: '700',
                    padding: '3px 9px', borderRadius: '6px',
                    letterSpacing: '0.3px', textTransform: 'uppercase',
                    flexShrink: 0,
                  }}>
                    Tregtar
                  </span>
                )}
                {!isOwnProfile && <MeldeModal nutzer_id={id} />}
                {isOwnProfile && (
                  <a href="/profil" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: '#F5F5F7', color: '#1D1D1F',
                    padding: '6px 14px', borderRadius: '8px',
                    fontSize: '12px', fontWeight: '600', textDecoration: 'none',
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}>
                    ✎ Ndrysho
                  </a>
                )}
              </div>

              {/* Contact person name for business */}
              {isBusiness && fullName && fullName !== displayName && (
                <div style={{ fontSize: '13px', color: '#86868B', marginBottom: '8px' }}>
                  Kontakt: {fullName}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {joinedDate && (
                  <span style={{ fontSize: '13px', color: '#86868B' }}>
                    Anëtar që nga {joinedDate}
                  </span>
                )}
                {zeigeQyteti && qyteti && (
                  <>
                    {joinedDate && <span style={{ color: '#D0D0D5' }}>·</span>}
                    <span style={{ fontSize: '13px', color: '#86868B' }}>📍 {qyteti}</span>
                  </>
                )}
              </div>

              {/* Business details */}
              {isBusiness && (adresa || website) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
                  {adresa && (
                    <span style={{ fontSize: '13px', color: '#3D3D3F' }}>📍 {adresa}</span>
                  )}
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '13px', color: RED, textDecoration: 'none', fontWeight: '500' }}
                    >
                      🌐 {website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              )}

              {/* Business description */}
              {isBusiness && beschreibungFirma && (
                <p style={{
                  fontSize: '14px', color: '#3D3D3F', lineHeight: '1.65',
                  margin: '0 0 8px', maxWidth: '480px', whiteSpace: 'pre-wrap',
                }}>
                  {beschreibungFirma}
                </p>
              )}

              {/* Personal bio */}
              {!isBusiness && bio && (
                <p style={{
                  fontSize: '14px', color: '#3D3D3F', lineHeight: '1.65',
                  margin: 0, maxWidth: '480px', whiteSpace: 'pre-wrap',
                }}>
                  {bio}
                </p>
              )}
            </div>

            {/* Stats badge */}
            <div style={{
              background: '#F5F5F7', borderRadius: '16px',
              padding: '20px 28px', textAlign: 'center', flexShrink: 0,
            }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: RED, letterSpacing: '-1px', lineHeight: 1 }}>
                {adCount}
              </div>
              <div style={{ fontSize: '12px', color: '#86868B', fontWeight: '500', marginTop: '4px' }}>
                njoftime
              </div>
            </div>
          </div>
        </div>

        {/* ── Listings ── */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1D1D1F', margin: '0 0 18px', letterSpacing: '-0.4px' }}>
            Njoftimet e {isBusiness && firmaName ? firmaName : fullName}
          </h2>

          {adCount === 0 ? (
            <div style={{
              background: '#fff', borderRadius: '18px', padding: '60px 24px', textAlign: 'center',
              color: '#86868B', fontSize: '15px',
              boxShadow: '0 1px 8px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)',
            }}>
              Ky shitës nuk ka njoftime aktualisht.
            </div>
          ) : (
            <div className="ad-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {njoftimet!.map(ad => {
                const images: string[] = (ad.images as string[] | null) ?? []
                return (
                  <div key={ad.id} style={{
                    background: '#fff', borderRadius: '18px', overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)',
                  }}>
                    <a href={`/njoftim/${ad.id}`} style={{ display: 'block', textDecoration: 'none' }}>
                      <div style={{
                        height: '160px', background: '#F5F5F7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '44px', overflow: 'hidden', position: 'relative',
                      }}>
                        {images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={images[0]} alt={ad.title as string}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : CATEGORY_ICON(ad.category)}
                        {/* Tregtar badge on card */}
                        {isBusiness && (
                          <span style={{
                            position: 'absolute', top: '8px', left: '8px',
                            background: RED, color: '#fff',
                            fontSize: '10px', fontWeight: '700',
                            padding: '2px 7px', borderRadius: '5px',
                            letterSpacing: '0.3px', textTransform: 'uppercase',
                          }}>
                            Tregtar
                          </span>
                        )}
                      </div>
                      <div style={{ padding: '12px 14px 12px' }}>
                        <div style={{
                          fontSize: '14px', fontWeight: '600', color: '#1D1D1F',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          marginBottom: '5px', letterSpacing: '-0.1px',
                        }}>
                          {ad.title}
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: RED, letterSpacing: '-0.2px', marginBottom: '4px' }}>
                          {(ad.price as number).toLocaleString('de-DE')} €
                        </div>
                        <div style={{ fontSize: '11px', color: '#86868B' }}>{ad.city}</div>
                      </div>
                    </a>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </main>
  )
}
