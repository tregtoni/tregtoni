import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  console.log('ADMIN_USER_ID:', process.env.ADMIN_USER_ID, 'USER:', user?.id)

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    notFound()
  }

  const admin = createAdminClient()
  const { count } = await admin
    .from('meldungen')
    .select('id', { count: 'exact', head: true })
    .eq('erledigt', false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F7' }}>
      <AdminSidebar meldungenOffen={count ?? 0} />
      <main style={{ flex: 1, padding: '32px', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
