import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/app/components/NavBar'
import ChatView from './ChatView'

type Njoftim = {
  id: string
  title: string
  price: number
  category: string
  city: string
}

export default async function Chat({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { userId: otherUserId } = await params
  const sp = await searchParams
  const njoftimParam = sp['njoftim'] ?? null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (user.id === otherUserId) redirect('/')

  const { data: otherProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', otherUserId)
    .single()

  const otherUserName = otherProfile?.full_name ?? 'Përdorues'

  const { data: messages } = await supabase
    .from('mesazhet')
    .select('*')
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),` +
      `and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
    )
    .order('created_at', { ascending: true })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const njoftimIdFromMessages = (messages ?? []).find((m: any) => m.njoftim_id)?.njoftim_id ?? null
  const njoftimId: string | null = njoftimParam ?? njoftimIdFromMessages

  let njoftim: Njoftim | null = null
  if (njoftimId) {
    const { data, error } = await supabase
      .from('njoftimet')
      .select('id, title, price, category, city')
      .eq('id', njoftimId)
      .single()
    if (!error) njoftim = data
  }

  await supabase
    .from('mesazhet')
    .update({ read: true })
    .eq('sender_id', otherUserId)
    .eq('receiver_id', user.id)
    .eq('read', false)

  return (
    <main style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      {/* Chat header */}
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexShrink: 0,
      }}>
        <a href="/mesazhet" style={{
          color: '#DA291C',
          fontSize: '15px',
          textDecoration: 'none',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          ← Kthehu
        </a>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: '#DA291C',
          color: '#fff',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: '700',
        }}>
          {otherUserName.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1D1D1F', letterSpacing: '-0.2px' }}>
            {otherUserName}
          </div>
        </div>
      </div>

      <ChatView
        initialMessages={messages ?? []}
        currentUserId={user.id}
        otherUserId={otherUserId}
        njoftimId={njoftimId}
        njoftim={njoftim}
      />
    </main>
  )
}
