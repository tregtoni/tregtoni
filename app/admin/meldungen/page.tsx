import { createAdminClient } from '@/lib/supabase/admin'
import { markeeMeldungErledigt, loeschMeldung, loeschNjoftim, sperreNutzer } from '@/app/actions/admin'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

const VERSTOSS: Record<string, string> = {
  spam: 'Spam / Reklamë', mashtrim: 'Mashtrim / Fake', cmim: 'Çmim i gabuar',
  ndaluar: 'Përmbajtje e ndaluar', ngacmim: 'Ngacmim', tjeter: 'Tjetër',
}

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

export default async function MeldungenPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams
  const admin = createAdminClient()

  let query = admin.from('meldungen')
    .select('*, njoftim:anzeige_id(id, title)')
    .order('krijuar_me', { ascending: false })

  if (filter === 'offen') query = query.eq('erledigt', false)
  else if (filter === 'erledigt') query = query.eq('erledigt', true)

  const { data: meldungen } = await query

  // Resolve user names
  const userIds = [...new Set([
    ...(meldungen ?? []).map((m: any) => m.gemeldeter_nutzer_id).filter(Boolean),
    ...(meldungen ?? []).map((m: any) => m.reporter_id).filter(Boolean),
  ])]
  const { data: profiles } = userIds.length
    ? await admin.from('profiles').select('id, full_name').in('id', userIds)
    : { data: [] }
  const pMap: Record<string, string> = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p.full_name ?? '—']))

  const offenCount = (meldungen ?? []).filter((m: any) => !m.erledigt).length

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1D1D1F', margin: 0, letterSpacing: '-0.5px' }}>
          Meldungen
          {offenCount > 0 && (
            <span style={{ marginLeft: '10px', background: RED, color: '#fff', fontSize: '13px', fontWeight: '700', padding: '3px 9px', borderRadius: '10px', verticalAlign: 'middle' }}>
              {offenCount} offen
            </span>
          )}
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[['', 'Alle'], ['offen', 'Offen'], ['erledigt', 'Erledigt']].map(([val, label]) => (
            <a key={val} href={val ? `/admin/meldungen?filter=${val}` : '/admin/meldungen'} style={{
              padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
              textDecoration: 'none',
              background: (filter ?? '') === val ? RED : '#fff',
              color: (filter ?? '') === val ? '#fff' : '#1D1D1F',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              {label}
            </a>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F5F5F7' }}>
              {['Status', 'Anzeige', 'Gemeldet', 'Melder', 'Verstoß', 'Freitext', 'Datum', 'Aktionen'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(meldungen ?? []).map((m: any) => (
              <tr key={m.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                    background: m.erledigt ? '#F0FFF4' : '#FFF0F0',
                    color: m.erledigt ? '#1A7F37' : RED,
                  }}>
                    {m.erledigt ? 'Erledigt' : 'Offen'}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', maxWidth: '160px' }}>
                  {m.njoftim ? (
                    <a href={`/njoftim/${m.njoftim.id}`} target="_blank" rel="noreferrer" style={{
                      fontSize: '12px', color: '#1D1D1F', fontWeight: '500', textDecoration: 'none',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block',
                    }}>
                      {m.njoftim.title}
                    </a>
                  ) : <span style={{ fontSize: '12px', color: '#86868B' }}>—</span>}
                </td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#1D1D1F' }}>
                  {m.gemeldeter_nutzer_id ? (pMap[m.gemeldeter_nutzer_id] ?? m.gemeldeter_nutzer_id.slice(0, 8) + '…') : '—'}
                </td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#86868B' }}>
                  {m.reporter_id ? (pMap[m.reporter_id] ?? m.reporter_id.slice(0, 8) + '…') : '—'}
                </td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#1D1D1F', whiteSpace: 'nowrap' }}>
                  {VERSTOSS[m.verstoss_kategoria] ?? m.verstoss_kategoria}
                </td>
                <td style={{ padding: '12px 14px', fontSize: '12px', color: '#6E6E73', maxWidth: '180px' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.freitext ?? '—'}
                  </div>
                </td>
                <td style={{ padding: '12px 14px', fontSize: '11px', color: '#86868B', whiteSpace: 'nowrap' }}>
                  {fmt(m.krijuar_me)}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {!m.erledigt && (
                      <ActionBtn action={markeeMeldungErledigt.bind(null, m.id)} label="✓ Erledigt" variant="green" />
                    )}
                    {m.njoftim && (
                      <ActionBtn action={loeschNjoftim.bind(null, m.njoftim.id)} label="Anzeige löschen" variant="red" />
                    )}
                    {m.gemeldeter_nutzer_id && (
                      <ActionBtn action={sperreNutzer.bind(null, m.gemeldeter_nutzer_id)} label="Nutzer sperren" variant="red" />
                    )}
                    <ActionBtn action={loeschMeldung.bind(null, m.id)} label="Meldung löschen" />
                  </div>
                </td>
              </tr>
            ))}
            {(meldungen ?? []).length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', fontSize: '14px', color: '#86868B' }}>
                  Keine Meldungen vorhanden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
