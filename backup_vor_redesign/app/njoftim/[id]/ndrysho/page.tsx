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
    .select('id, title, category, subcategory, marka, description, price, city, user_id')
    .eq('id', id)
    .single()

  if (!ad) notFound()
  if (ad.user_id !== user.id) redirect(`/njoftim/${id}`)

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />

      <section style={{ background: '#fff', borderBottom: '3px solid #E24B4A', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Kryefaqja</a>
          <span style={{ color: '#ccc' }}>→</span>
          <a href="/profil" style={{ color: '#999', textDecoration: 'none' }}>Profili im</a>
          <span style={{ color: '#ccc' }}>→</span>
          <span style={{ color: '#111' }}>Ndrysho njoftimin</span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111', marginTop: '6px' }}>Ndrysho njoftimin</h1>
      </section>

      <NdyshoForm listing={ad} />

      <Footer />
    </main>
  )
}
