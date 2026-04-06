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
    <nav style={{
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
            <a href="/mesazhet" style={{
              position: 'relative',
              color: '#1D1D1F',
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              fontWeight: '500',
            }}>
              Mesazhet
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
            <a href="/profil" style={{
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
