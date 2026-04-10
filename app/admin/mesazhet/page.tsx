import { createAdminClient } from '@/lib/supabase/admin'
import ConversationList, { type Conversation, type Message } from './ConversationList'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

export default async function MesazhetAdminPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const admin = createAdminClient()

  let query = admin
    .from('mesazhet')
    .select('id, sender_id, receiver_id, content, created_at, njoftim_id', { count: 'exact' })
    .order('created_at', { ascending: true })
    .limit(500)

  if (q) query = query.ilike('content', `%${q}%`)

  const { data: messages, count } = await query

  // Resolve profile names
  const userIds = [...new Set([
    ...(messages ?? []).map((m: any) => m.sender_id),
    ...(messages ?? []).map((m: any) => m.receiver_id),
  ].filter(Boolean))]

  const { data: profiles } = userIds.length
    ? await admin.from('profiles').select('id, full_name').in('id', userIds)
    : { data: [] }
  const pMap: Record<string, string> = Object.fromEntries(
    (profiles ?? []).map((p: any) => [p.id, p.full_name ?? p.id.slice(0, 8) + '…'])
  )

  // Group messages into conversations
  const convMap = new Map<string, { messages: Message[]; user1Id: string; user2Id: string }>()

  for (const m of messages ?? []) {
    const [a, b] = [m.sender_id, m.receiver_id].sort()
    const key = `${a}—${b}`
    if (!convMap.has(key)) {
      convMap.set(key, { messages: [], user1Id: a, user2Id: b })
    }
    convMap.get(key)!.messages.push(m as Message)
  }

  // Build sorted conversation list (most recent first)
  const conversations: Conversation[] = Array.from(convMap.entries())
    .map(([key, { messages: msgs, user1Id, user2Id }]) => {
      const lastMsg = msgs[msgs.length - 1]
      return {
        key,
        user1Id,
        user2Id,
        user1Name: pMap[user1Id] ?? user1Id.slice(0, 8) + '…',
        user2Name: pMap[user2Id] ?? user2Id.slice(0, 8) + '…',
        lastMessage: lastMsg.content,
        lastDate: lastMsg.created_at,
        messageCount: msgs.length,
        messages: msgs,
      }
    })
    .sort((a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime())

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1D1D1F', margin: 0, letterSpacing: '-0.5px' }}>
          Nachrichten
          <span style={{ marginLeft: '10px', fontSize: '16px', fontWeight: '500', color: '#86868B' }}>
            {conversations.length} Konversationen · {count ?? 0} Nachrichten
          </span>
        </h1>
      </div>

      {/* Search */}
      <form method="GET" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Nachrichteninhalt suchen..."
          style={{
            flex: 1, border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '9px',
            padding: '9px 14px', fontSize: '13px', fontFamily: FONT, outline: 'none', background: '#fff',
          }}
        />
        <button type="submit" style={{
          background: RED, color: '#fff', border: 'none', borderRadius: '9px',
          padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: FONT,
        }}>
          Suchen
        </button>
        {q && (
          <a href="/admin/mesazhet" style={{
            background: '#F5F5F7', color: '#1D1D1F', borderRadius: '9px',
            padding: '9px 14px', fontSize: '13px', fontWeight: '600', textDecoration: 'none',
          }}>
            Zurücksetzen
          </a>
        )}
      </form>

      <ConversationList conversations={conversations} />

      <div style={{ marginTop: '12px', fontSize: '12px', color: '#86868B' }}>
        Zeigt die letzten 500 Nachrichten, gruppiert nach Konversation. Klick auf eine Zeile öffnet den vollständigen Chatverlauf.
      </div>
    </div>
  )
}
