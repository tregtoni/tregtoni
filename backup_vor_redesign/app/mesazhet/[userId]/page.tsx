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

  // Merr profilin e përdoruesit tjetër
  const { data: otherProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', otherUserId)
    .single()

  const otherUserName = otherProfile?.full_name ?? 'Përdorues'

  // Merr mesazhet fillestare
  const { data: messages } = await supabase
    .from('mesazhet')
    .select('*')
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),` +
      `and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
    )
    .order('created_at', { ascending: true })

  // njoftim_id: nga URL param ose nga mesazhet ekzistuese
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const njoftimIdFromMessages = (messages ?? []).find((m: any) => m.njoftim_id)?.njoftim_id ?? null
  const njoftimId: string | null = njoftimParam ?? njoftimIdFromMessages

  // Merr të dhënat e njoftimit për të shfaqur bannerin
  let njoftim: Njoftim | null = null
  if (njoftimId) {
    const { data, error } = await supabase
      .from('njoftimet')
      .select('id, title, price, category, city')
      .eq('id', njoftimId)
      .single()
    if (!error) njoftim = data
  }

  // Shëno mesazhet si të lexuara
  await supabase
    .from('mesazhet')
    .update({ read: true })
    .eq('sender_id', otherUserId)
    .eq('receiver_id', user.id)
    .eq('read', false)

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />

      {/* Chat header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #eee',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
        flexShrink: 0,
      }}>
        <a href="/mesazhet" style={{ color: '#999', fontSize: '18px', textDecoration: 'none', lineHeight: 1 }}>
          ←
        </a>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#E24B4A', color: '#fff', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', fontWeight: '600',
        }}>
          {otherUserName.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#111' }}>{otherUserName}</div>
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
