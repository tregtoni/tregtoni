import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    console.error('Admin access denied - user:', user?.id, 'expected:', process.env.ADMIN_USER_ID)
    notFound()
  }

  let count = 0
  try {
    const admin = createAdminClient()
    const { count: c } = await admin
      .from('meldungen')
      .select('id', { count: 'exact', head: true })
      .eq('erledigt', false)
    count = c ?? 0
  } catch {
    // Service role key not configured or DB error — dashboard still renders
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
