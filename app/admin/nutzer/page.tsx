import { createAdminClient } from '@/lib/supabase/admin'
import { sperreNutzer, entsperreNutzer, loeschAlleNjoftimeVonNutzer, loeschNutzer } from '@/app/actions/admin'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

function fmt(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function ActionBtn({ action, label, variant = 'grey' }: { action: () => Promise<void>; label: string; variant?: 'grey' | 'red' | 'green' }) {
  const bg = variant === 'red' ? '#FFF0F0' : variant === 'green' ? '#F0FFF4' : '#F5F5F7'
  const color = variant === 'red' ? RED : variant === 'green' ? '#1A7F37' : '#1D1D1F'
  return (
    <form action={action} style={{ display: 'inline' }}>
      <button type="submit" style={{
        background: bg, color, border: 'none', borderRadius: '7px',
        padding: '5px 10px', fontSize: '11px', fontWeight: '600',
        cursor: 'pointer', fontFamily: FONT, whiteSpace: 'nowrap',
      }}>
        {label}
      </button>
    </form>
  )
}

export default async function NutzerPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const admin = createAdminClient()

  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })

  const { data: profiles } = await admin.from('profiles').select('id, full_name, gesperrt, qyteti')
  const pMap: Record<string, { full_name?: string; gesperrt?: boolean; qyteti?: string }> =
    Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p]))

  const { data: adRows } = await admin.from('njoftimet').select('user_id')
  const countMap: Record<string, number> = {}
  for (const row of adRows ?? []) {
    countMap[row.user_id] = (countMap[row.user_id] || 0) + 1
  }

  let users = authUsers
  if (q) {
    const lq = q.toLowerCase()
    users = users.filter(u =>
      u.email?.toLowerCase().includes(lq) ||
      pMap[u.id]?.full_name?.toLowerCase().includes(lq)
    )
  }

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1D1D1F', margin: 0, letterSpacing: '-0.5px' }}>
          Nutzer
          <span style={{ marginLeft: '10px', fontSize: '16px', fontWeight: '500', color: '#86868B' }}>{users.length} gesamt</span>
        </h1>
      </div>

      {/* Search */}
      <form method="GET" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Email oder Name suchen..."
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
          <a href="/admin/nutzer" style={{
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
              {['Status', 'Email', 'Name', 'Stadt', 'Anzeigen', 'Registriert', 'Letzter Login', 'Aktionen'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const profile = pMap[user.id]
              const gesperrt = profile?.gesperrt ?? false
              const adCount = countMap[user.id] ?? 0
              return (
                <tr key={user.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)', opacity: gesperrt ? 0.6 : 1 }}>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                      background: gesperrt ? '#FFF0F0' : '#F0FFF4',
                      color: gesperrt ? RED : '#1A7F37',
                    }}>
                      {gesperrt ? 'Gesperrt' : 'Aktiv'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: '#1D1D1F', fontWeight: '500' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: '#6E6E73' }}>
                    {profile?.full_name ?? '—'}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '12px', color: '#6E6E73' }}>
                    {profile?.qyteti ?? '—'}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: '700', color: adCount > 0 ? '#1D1D1F' : '#86868B' }}>
                    {adCount}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '11px', color: '#86868B', whiteSpace: 'nowrap' }}>
                    {fmt(user.created_at)}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '11px', color: '#86868B', whiteSpace: 'nowrap' }}>
                    {user.last_sign_in_at ? fmt(user.last_sign_in_at) : '—'}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {gesperrt ? (
                        <ActionBtn action={entsperreNutzer.bind(null, user.id)} label="Entsperren" variant="green" />
                      ) : (
                        <ActionBtn action={sperreNutzer.bind(null, user.id)} label="Sperren" variant="grey" />
                      )}
                      {adCount > 0 && (
                        <ActionBtn action={loeschAlleNjoftimeVonNutzer.bind(null, user.id)} label={`${adCount} Anzeigen löschen`} variant="red" />
                      )}
                      <ActionBtn action={loeschNutzer.bind(null, user.id)} label="Nutzer löschen" variant="red" />
                    </div>
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', fontSize: '14px', color: '#86868B' }}>
                  Keine Nutzer gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
