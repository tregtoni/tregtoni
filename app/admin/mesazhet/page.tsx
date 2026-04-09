import { createAdminClient } from '@/lib/supabase/admin'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

function fmt(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default async function MesazhetAdminPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const admin = createAdminClient()

  // Get recent messages with pagination
  let query = admin
    .from('mesazhet')
    .select('id, sender_id, receiver_id, content, created_at, njoftim_id', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

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
  const pMap: Record<string, string> = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p.full_name ?? '—']))

  // Conversation stats: unique (sender, receiver) pairs
  const convSet = new Set<string>()
  for (const m of messages ?? []) {
    const key = [m.sender_id, m.receiver_id].sort().join('—')
    convSet.add(key)
  }

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1D1D1F', margin: 0, letterSpacing: '-0.5px' }}>
          Nachrichten
          <span style={{ marginLeft: '10px', fontSize: '16px', fontWeight: '500', color: '#86868B' }}>
            {count ?? 0} gesamt · {convSet.size} Konversationen (letzte 50)
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

      <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F5F5F7' }}>
              {['Von', 'An', 'Inhalt', 'Anzeige', 'Datum'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(messages ?? []).map((m: any) => (
              <tr key={m.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding: '11px 14px', fontSize: '12px', color: '#1D1D1F', fontWeight: '500', whiteSpace: 'nowrap' }}>
                  {pMap[m.sender_id] ?? m.sender_id?.slice(0, 8) + '…'}
                </td>
                <td style={{ padding: '11px 14px', fontSize: '12px', color: '#1D1D1F', whiteSpace: 'nowrap' }}>
                  {pMap[m.receiver_id] ?? m.receiver_id?.slice(0, 8) + '…'}
                </td>
                <td style={{ padding: '11px 14px', maxWidth: '300px' }}>
                  <div style={{ fontSize: '12px', color: '#6E6E73', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.content}
                  </div>
                </td>
                <td style={{ padding: '11px 14px' }}>
                  {m.njoftim_id ? (
                    <a href={`/njoftim/${m.njoftim_id}`} target="_blank" rel="noreferrer" style={{
                      fontSize: '11px', color: RED, fontWeight: '600', textDecoration: 'none',
                    }}>
                      Anzeige →
                    </a>
                  ) : <span style={{ fontSize: '11px', color: '#86868B' }}>—</span>}
                </td>
                <td style={{ padding: '11px 14px', fontSize: '11px', color: '#86868B', whiteSpace: 'nowrap' }}>
                  {fmt(m.created_at)}
                </td>
              </tr>
            ))}
            {(messages ?? []).length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', fontSize: '14px', color: '#86868B' }}>
                  Keine Nachrichten gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '12px', fontSize: '12px', color: '#86868B' }}>
        Zeige die letzten 50 Nachrichten. Zum Löschen bitte direkt in der Supabase-Datenbank.
      </div>
    </div>
  )
}
