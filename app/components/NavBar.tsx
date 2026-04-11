import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'

export default async function NavBar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const fullName = user?.user_metadata?.full_name as string | undefined

  let unreadCount = 0
  let favCount = 0
  if (user) {
    const [{ count: unread }, { count: fav }] = await Promise.all([
      supabase.from('mesazhet').select('id', { count: 'exact', head: true }).eq('receiver_id', user.id).eq('read', false),
      supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ])
    unreadCount = unread ?? 0
    favCount = fav ?? 0
  }

  return (
    <nav className="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      padding: '0 32px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <a href="/" style={{
        color: '#1D1D1F',
        fontSize: '20px',
        fontWeight: '700',
        textDecoration: 'none',
        letterSpacing: '-0.5px',
      }}>
        Tregtoni<span style={{ color: '#DA291C' }}>.com</span>
      </a>

      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {user ? (
          <>
            <a href="/favorites" style={{
              position: 'relative',
              color: '#1D1D1F',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 12px',
              borderRadius: '8px',
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {favCount > 0 && (
                <span style={{
                  background: '#DA291C',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '700',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  lineHeight: '16px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}>
                  {favCount}
                </span>
              )}
            </a>
            <a href="/mesazhet" style={{
              position: 'relative',
              color: '#1D1D1F',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 12px',
              borderRadius: '8px',
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              {unreadCount > 0 && (
                <span style={{
                  background: '#DA291C',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '700',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  lineHeight: '16px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}>
                  {unreadCount}
                </span>
              )}
            </a>
            <a href="/profil" className="nav-name" style={{
              color: '#1D1D1F',
              fontSize: '14px',
              textDecoration: 'none',
              padding: '7px 12px',
              borderRadius: '8px',
              fontWeight: '500',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {fullName ?? user.email}
            </a>
            <form action={logout} style={{ margin: 0 }}>
              <button type="submit" style={{
                background: 'transparent',
                color: '#6E6E73',
                border: '1px solid rgba(0,0,0,0.14)',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500',
                fontFamily: 'inherit',
              }}>
                Dil
              </button>
            </form>
          </>
        ) : (
          <>
            <a href="/login" style={{
              color: '#1D1D1F',
              fontSize: '14px',
              textDecoration: 'none',
              padding: '7px 14px',
              borderRadius: '8px',
              fontWeight: '500',
            }}>
              Hyr
            </a>
            <a href="/register" style={{
              background: '#DA291C',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
            }}>
              Regjistrohu
            </a>
          </>
        )}
      </div>
    </nav>
  )
}
