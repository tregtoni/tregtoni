import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import ProfilInfo from './ProfilInfo'
import ProfilFoto from './ProfilFoto'
import NdryshoFjalekalimin from './NdryshoFjalekalimin'
import FshijButon from './FshijButon'
import { fshijNjoftimin } from '@/app/actions/profil'
import { CATEGORY_ICON } from '@/lib/kategori-data'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, telefon, qyteti, bio, zeige_telefon, zeige_qyteti, created_at, konto_typ, firma_name, adresa, website, beschreibung_firma')
    .eq('id', user.id)
    .single()

  const { data: njoftimet } = await supabase
    .from('njoftimet')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const fullName            = (profile?.full_name  ?? user.user_metadata?.full_name ?? '') as string
  const telefon             = (profile?.telefon    ?? '') as string
  const qyteti              = (profile?.qyteti     ?? '') as string
  const avatarUrl           = (profile?.avatar_url ?? '') as string
  const bio                 = (profile?.bio        ?? '') as string
  const zeigeTelefon        = (profile?.zeige_telefon ?? true) as boolean
  const zeigeQyteti         = (profile?.zeige_qyteti  ?? true) as boolean
  const kontoTyp            = (profile?.konto_typ     ?? 'privat') as string
  const firmaName           = (profile?.firma_name    ?? '') as string
  const adresa              = (profile?.adresa        ?? '') as string
  const website             = (profile?.website       ?? '') as string
  const beschreibungFirma   = (profile?.beschreibung_firma ?? '') as string
  const email           = user.email ?? ''
  const joinedAt        = new Date(profile?.created_at ?? user.created_at)
  const joinedDate      = joinedAt.toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' })
  const initials        = fullName ? fullName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      {/* Header */}
      <section style={{
        background: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '20px 32px',
      }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#86868B', marginBottom: '8px' }}>
            <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
            <span>›</span>
            <span style={{ color: '#1D1D1F', fontWeight: '500' }}>Profili im</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.4px' }}>
            Profili im
          </h1>
        </div>
      </section>

      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Profile card */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            textAlign: 'center',
            boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            <ProfilFoto initials={initials} avatarUrl={avatarUrl} />
            <div>
              <div style={{ fontSize: '19px', fontWeight: '700', color: '#1D1D1F', marginBottom: '4px', letterSpacing: '-0.3px' }}>
                {fullName || 'Pa emër'}
              </div>
              <div style={{ fontSize: '13px', color: '#6E6E73', marginBottom: '2px' }}>{email}</div>
              {telefon && <div style={{ fontSize: '13px', color: '#6E6E73', marginBottom: '2px' }}>{telefon}</div>}
              {qyteti  && <div style={{ fontSize: '13px', color: '#6E6E73', marginBottom: '2px' }}>{qyteti}</div>}
              <div style={{ fontSize: '12px', color: '#86868B', marginTop: '6px' }}>Anëtar që nga {joinedDate}</div>
            </div>
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px', width: '100%' }}>
              <div style={{ fontSize: '30px', fontWeight: '700', color: '#DA291C', letterSpacing: '-0.8px' }}>
                {njoftimet?.length ?? 0}
              </div>
              <div style={{ fontSize: '12px', color: '#86868B', fontWeight: '500', marginTop: '2px' }}>njoftime aktive</div>
            </div>
            <a
              href={`/profil/${user.id}`}
              style={{
                display: 'block',
                width: '100%',
                background: '#F5F5F7',
                color: '#1D1D1F',
                padding: '10px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              Shiko profilin publik →
            </a>
          </div>

          {/* Password change */}
          <NdryshoFjalekalimin />
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Edit profile */}
          <ProfilInfo
            emriAktual={fullName}
            telefonAktual={telefon}
            qytetiAktual={qyteti}
            bioAktual={bio}
            zeigeTelefonAktual={zeigeTelefon}
            zeigeQytetiAktual={zeigeQyteti}
            kontoTypAktual={kontoTyp}
            firmaNameAktual={firmaName}
            adresaAktuale={adresa}
            websiteAktual={website}
            beschreibungFirmaAktual={beschreibungFirma}
          />

          {/* My listings */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '17px',
                fontWeight: '700',
                color: '#1D1D1F',
                margin: 0,
                letterSpacing: '-0.3px',
              }}>
                Njoftimet e mia
              </h2>
              <a
                href="/njoftim/shto"
                style={{
                  background: '#DA291C',
                  color: '#fff',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                + Shto njoftim
              </a>
            </div>

            {!njoftimet || njoftimet.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#86868B' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: '#F5F5F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '22px',
                }}>
                  ≡
                </div>
                <p style={{ fontSize: '15px', color: '#6E6E73', marginBottom: '14px', fontWeight: '500' }}>
                  Nuk keni asnjë njoftim aktualisht.
                </p>
                <a href="/njoftim/shto" style={{ color: '#DA291C', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>
                  Shto njoftimin tënd të parë →
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {njoftimet.map((ad) => {
                  const fshijAction = fshijNjoftimin.bind(null, ad.id)
                  const images: string[] = ad.images ?? []
                  return (
                    <div key={ad.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      border: '1px solid rgba(0,0,0,0.07)',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      background: '#FAFAFA',
                    }}>
                      <a href={`/njoftim/${ad.id}`} style={{
                        flexShrink: 0,
                        width: '84px',
                        height: '72px',
                        background: '#F5F5F7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '26px',
                        textDecoration: 'none',
                        overflow: 'hidden',
                      }}>
                        {images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={images[0]} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : CATEGORY_ICON(ad.category)}
                      </a>
                      <div style={{ flex: 1, minWidth: 0, padding: '10px 0' }}>
                        <a href={`/njoftim/${ad.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#1D1D1F',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginBottom: '3px',
                          }}>
                            {ad.title}
                          </div>
                        </a>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#DA291C', letterSpacing: '-0.2px', marginBottom: '2px' }}>
                          {ad.price.toLocaleString('de-DE')} €
                        </div>
                        <div style={{ fontSize: '11px', color: '#86868B' }}>
                          {ad.city} · {new Date(ad.created_at).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', padding: '0 14px', flexShrink: 0 }}>
                        <a
                          href={`/njoftim/${ad.id}/ndrysho`}
                          style={{
                            background: '#fff',
                            color: '#1D1D1F',
                            border: '1.5px solid rgba(0,0,0,0.1)',
                            padding: '7px 14px',
                            borderRadius: '9px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textDecoration: 'none',
                          }}
                        >
                          Ndrysho
                        </a>
                        <FshijButon action={fshijAction} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
