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
    .select('full_name, telefon, qyteti, avatar_url, created_at')
    .eq('id', user.id)
    .single()

  const { data: njoftimet } = await supabase
    .from('njoftimet')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const fullName  = (profile?.full_name  ?? user.user_metadata?.full_name ?? '') as string
  const telefon   = (profile?.telefon    ?? '') as string
  const qyteti    = (profile?.qyteti     ?? '') as string
  const avatarUrl = (profile?.avatar_url ?? '') as string
  const email     = user.email ?? ''
  const joinedAt  = new Date(profile?.created_at ?? user.created_at)
  const joinedDate = joinedAt.toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' })
  const initials  = fullName ? fullName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />

      <section style={{ background: '#fff', borderBottom: '3px solid #E24B4A', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Kryefaqja</a>
          <span style={{ color: '#ccc' }}>→</span>
          <span style={{ color: '#111' }}>Profili im</span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111', marginTop: '6px', marginBottom: 0 }}>Profili im</h1>
      </section>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Profile card */}
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
            <ProfilFoto initials={initials} avatarUrl={avatarUrl} />
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#111', marginBottom: '4px' }}>
                {fullName || 'Pa emër'}
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '2px' }}>{email}</div>
              {telefon && <div style={{ fontSize: '13px', color: '#666', marginBottom: '2px' }}>📞 {telefon}</div>}
              {qyteti  && <div style={{ fontSize: '13px', color: '#666', marginBottom: '2px' }}>📍 {qyteti}</div>}
              <div style={{ fontSize: '11px', color: '#bbb', marginTop: '6px' }}>Anëtar që nga {joinedDate}</div>
            </div>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', width: '100%' }}>
              <div style={{ fontSize: '26px', fontWeight: '700', color: '#E24B4A' }}>{njoftimet?.length ?? 0}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>njoftime aktive</div>
            </div>
          </div>

          {/* Password change */}
          <NdryshoFjalekalimin />
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Edit profile */}
          <ProfilInfo
            emriAktual={fullName}
            telefonAktual={telefon}
            qytetiAktual={qyteti}
          />

          {/* My listings */}
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', margin: 0 }}>
                Njoftimet e mia
              </h2>
              <a
                href="/njoftim/shto"
                style={{ background: '#E24B4A', color: '#fff', padding: '8px 16px', borderRadius: '7px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}
              >
                + Shto njoftim
              </a>
            </div>

            {!njoftimet || njoftimet.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📋</div>
                <p style={{ fontSize: '14px', marginBottom: '12px' }}>Nuk keni asnjë njoftim aktualisht.</p>
                <a href="/njoftim/shto" style={{ color: '#E24B4A', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
                  Shto njoftimin tënd të parë →
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {njoftimet.map((ad) => {
                  const fshijAction = fshijNjoftimin.bind(null, ad.id)
                  const images: string[] = ad.images ?? []
                  return (
                    <div key={ad.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', background: '#fafafa' }}>
                      <a href={`/njoftim/${ad.id}`} style={{ flexShrink: 0, width: '80px', height: '70px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', textDecoration: 'none', overflow: 'hidden' }}>
                        {images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={images[0]} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : CATEGORY_ICON(ad.category)}
                      </a>
                      <div style={{ flex: 1, minWidth: 0, padding: '8px 0' }}>
                        <a href={`/njoftim/${ad.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' }}>
                            {ad.title}
                          </div>
                        </a>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#E24B4A', marginBottom: '2px' }}>
                          {ad.price.toLocaleString('de-DE')} €
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          📍 {ad.city} · {new Date(ad.created_at).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', padding: '0 12px', flexShrink: 0 }}>
                        <a
                          href={`/njoftim/${ad.id}/ndrysho`}
                          style={{ background: '#fff', color: '#111', border: '1.5px solid #ddd', padding: '6px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}
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
