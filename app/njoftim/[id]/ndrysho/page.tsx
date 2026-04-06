import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import NdyshoForm from './NdyshoForm'

export default async function NdyshoNjoftimin({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: ad } = await supabase
    .from('njoftimet')
    .select('id, title, category, subcategory, marka, description, price, city, user_id, km, baujahr, kraftstoff, leistung_ps, getriebe, fahrzeugtyp, tueren, umweltplakette, schadstoffklasse, innen_material, farbe, ausstattung, innen_ausstattung, sicherheit, cilindrata, hu_gueltig, moto_art, angebotstyp, ofruesi, apt_type, shkembim, pajisjet, karakteristika, siperfaqja, dhoma, kati, disponueshem, zustand, dergesa, pajisja, ngjyra, ram, os, madhesia, el_lloji, numri_kepuces, mode_lloji')
    .eq('id', id)
    .single()

  if (!ad) notFound()
  if (ad.user_id !== user.id) redirect(`/njoftim/${id}`)

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      <section style={{
        background: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '20px 32px',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#86868B', marginBottom: '8px' }}>
            <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
            <span>›</span>
            <a href="/profil" style={{ color: '#86868B', textDecoration: 'none' }}>Profili im</a>
            <span>›</span>
            <span style={{ color: '#1D1D1F', fontWeight: '500' }}>Ndrysho njoftimin</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.6px' }}>
            Ndrysho njoftimin
          </h1>
        </div>
      </section>

      <NdyshoForm listing={ad} />

      <Footer />
    </main>
  )
}
