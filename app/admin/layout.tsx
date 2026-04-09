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

  let count = 0
  try {
    const admin = createAdminClient()
    console.log('SERVICE_ROLE_KEY set:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    const result = await admin
      .from('meldungen')
      .select('id', { count: 'exact', head: true })
      .eq('erledigt', false)
    console.log('Admin query result — count:', result.count, 'error:', result.error)
    count = result.count ?? 0
  } catch (e) {
    console.error('createAdminClient error:', e)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F7' }}>
      <AdminSidebar meldungenOffen={count} />
      <main style={{ flex: 1, padding: '32px', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
