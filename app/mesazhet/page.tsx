import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

type Conversation = {
  other_user_id: string
  other_user_name: string
  last_message: string
  last_message_time: string
  unread_count: number
  njoftim_id: string | null
  njoftim_title: string | null
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'tani'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export default async function Mesazhet() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: conversations } = await supabase.rpc('get_conversations') as {
    data: Conversation[] | null
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 24px 48px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1D1D1F',
          marginBottom: '24px',
          letterSpacing: '-0.6px',
        }}>
          Mesazhet
        </h1>

        {!conversations || conversations.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '64px 24px',
            textAlign: 'center',
            boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#F5F5F7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '22px',
              color: '#86868B',
            }}>
              ✉
            </div>
            <p style={{ color: '#6E6E73', fontSize: '16px', fontWeight: '500', marginBottom: '10px' }}>
              Nuk ke biseda ende.
            </p>
            <a href="/" style={{ color: '#DA291C', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>
              Shiko njoftimet →
            </a>
          </div>
        ) : (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            {conversations.map((conv, i) => (
              <a
                key={conv.other_user_id}
                href={conv.njoftim_id
                  ? `/mesazhet/${conv.other_user_id}?njoftim=${conv.njoftim_id}`
                  : `/mesazhet/${conv.other_user_id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  textDecoration: 'none',
                  borderBottom: i < conversations.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: conv.unread_count > 0 ? '#FFFBF5' : '#fff',
                }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#DA291C',
                  color: '#fff',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '19px',
                  fontWeight: '700',
                }}>
                  {conv.other_user_name.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: conv.unread_count > 0 ? '700' : '600',
                      color: '#1D1D1F',
                    }}>
                      {conv.other_user_name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#86868B', fontWeight: '500' }}>
                      {timeAgo(conv.last_message_time)}
                    </span>
                  </div>

                  {conv.njoftim_title && (
                    <div style={{
                      fontSize: '11px',
                      color: '#DA291C',
                      fontWeight: '600',
                      marginBottom: '3px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      letterSpacing: '0.1px',
                    }}>
                      {conv.njoftim_title}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '13px',
                      color: conv.unread_count > 0 ? '#1D1D1F' : '#6E6E73',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '320px',
                      fontWeight: conv.unread_count > 0 ? '500' : '400',
                    }}>
                      {conv.last_message}
                    </span>
                    {conv.unread_count > 0 && (
                      <span style={{
                        background: '#DA291C',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: '700',
                        borderRadius: '10px',
                        padding: '2px 8px',
                        flexShrink: 0,
                        marginLeft: '10px',
                        minWidth: '20px',
                        textAlign: 'center',
                      }}>
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
