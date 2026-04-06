import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'

export default async function NavBar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const fullName = user?.user_metadata?.full_name as string | undefined

  let unreadCount = 0
  if (user) {
    const { count } = await supabase
      .from('mesazhet')
      .select('id', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('read', false)
    unreadCount = count ?? 0
  }

  return (
    <nav style={{ background: '#111', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <a href="/" style={{ color: '#fff', fontSize: '22px', fontWeight: '600', textDecoration: 'none' }}>Tregtoni<span style={{ color: '#E24B4A' }}>.com</span></a>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {user ? (
          <>
            {/* Mesazhet me badge */}
            <a href="/mesazhet" style={{ position: 'relative', color: 'rgba(255,255,255,0.75)', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              💬 Mesazhet
              {unreadCount > 0 && (
                <span style={{
                  background: '#E24B4A', color: '#fff',
                  fontSize: '10px', fontWeight: '700',
                  borderRadius: '10px', padding: '1px 6px',
                  lineHeight: '16px',
                }}>
                  {unreadCount}
                </span>
              )}
            </a>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>|</span>
            <a href="/profil" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', textDecoration: 'none' }}>
              {fullName ?? user.email}
            </a>
            <form action={logout}>
              <button type="submit" style={{ background: 'transparent', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>
                Dil
              </button>
            </form>
          </>
        ) : (
          <>
            <a href="/login" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', textDecoration: 'none' }}>Hyr</a>
            <a href="/register" style={{ background: '#E24B4A', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', textDecoration: 'none' }}>Regjistrohu</a>
          </>
        )}
      </div>
    </nav>
  )
}
