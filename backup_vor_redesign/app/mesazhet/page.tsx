import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/app/components/NavBar'

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
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111', marginBottom: '16px', borderLeft: '3px solid #E24B4A', paddingLeft: '10px' }}>
          Mesazhet
        </h1>

        {!conversations || conversations.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '48px 24px', textAlign: 'center', border: '1px solid #eee' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
            <p style={{ color: '#666', fontSize: '14px' }}>Nuk ke biseda ende.</p>
            <a href="/" style={{ color: '#E24B4A', fontSize: '13px', textDecoration: 'none', marginTop: '8px', display: 'inline-block' }}>
              Shiko njoftimet →
            </a>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
            {conversations.map((conv, i) => (
              <a
                key={conv.other_user_id}
                href={conv.njoftim_id
                  ? `/mesazhet/${conv.other_user_id}?njoftim=${conv.njoftim_id}`
                  : `/mesazhet/${conv.other_user_id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px', textDecoration: 'none',
                  borderBottom: i < conversations.length - 1 ? '1px solid #f0f0f0' : 'none',
                  background: '#fff',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: '#E24B4A', color: '#fff', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: '600',
                }}>
                  {conv.other_user_name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: conv.unread_count > 0 ? '600' : '500', color: '#111' }}>
                      {conv.other_user_name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#999' }}>
                      {timeAgo(conv.last_message_time)}
                    </span>
                  </div>

                  {/* Njoftim tag */}
                  {conv.njoftim_title && (
                    <div style={{ fontSize: '11px', color: '#E24B4A', fontWeight: '500', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      📌 {conv.njoftim_title}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '13px', color: '#666',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      maxWidth: '280px',
                      fontWeight: conv.unread_count > 0 ? '500' : 'normal',
                    }}>
                      {conv.last_message}
                    </span>
                    {conv.unread_count > 0 && (
                      <span style={{
                        background: '#E24B4A', color: '#fff', fontSize: '11px', fontWeight: '600',
                        borderRadius: '10px', padding: '2px 7px', flexShrink: 0, marginLeft: '8px',
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
    </main>
  )
}
