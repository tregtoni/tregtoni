import { createAdminClient } from '@/lib/supabase/admin'
import { loeschNjoftim, toggleNjoftimAktive } from '@/app/actions/admin'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

const CATEGORY_LABEL: Record<string, string> = {
  makina: '🚗 Automjete', imobiliare: '🏢 Imobiliare', shtepi: '🏡 Shtëpi',
  elektronik: '📱 Elektronik', pune: '💼 Punë', sherbime: '🛠️ Shërbime',
  mode: '👗 Modë', femije: '👶 Fëmijë', kafshe: '🐾 Kafshë',
  mesim: '📚 Mësim', bileta: '🎟️ Bileta', hobi: '🎨 Hobi',
  muzike: '🎵 Muzikë', dhurate: '🎁 Dhuratë',
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
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

export default async function NjoftimetPage({ searchParams }: { searchParams: Promise<{ q?: string; kategoria?: string; faqe?: string }> }) {
  const { q, kategoria, faqe } = await searchParams
  const page = Math.max(1, parseInt(faqe ?? '1'))
  const PER_PAGE = 30

  const admin = createAdminClient()

  let query = admin.from('njoftimet')
    .select('id, title, category, city, user_id, created_at, aktive, price', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1)

  if (q) query = query.ilike('title', `%${q}%`)
  if (kategoria) query = query.eq('category', kategoria)

  const { data: njoftimet, count } = await query

  // Get profile names for user_ids
  const userIds = [...new Set((njoftimet ?? []).map((a: any) => a.user_id).filter(Boolean))]
  const { data: profiles } = userIds.length
    ? await admin.from('profiles').select('id, full_name').in('id', userIds)
    : { data: [] }
  const pMap: Record<string, string> = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p.full_name ?? '—']))

  const totalPages = Math.ceil((count ?? 0) / PER_PAGE)

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1D1D1F', margin: 0, letterSpacing: '-0.5px' }}>
          Anzeigen
          <span style={{ marginLeft: '10px', fontSize: '16px', fontWeight: '500', color: '#86868B' }}>{count ?? 0} gesamt</span>
        </h1>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Anzeige suchen..."
          style={{
            flex: 1, minWidth: '200px', border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '9px',
            padding: '9px 14px', fontSize: '13px', fontFamily: FONT, outline: 'none', background: '#fff',
          }}
        />
        <select name="kategoria" defaultValue={kategoria ?? ''} style={{
          border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '9px',
          padding: '9px 14px', fontSize: '13px', fontFamily: FONT, background: '#fff', cursor: 'pointer',
        }}>
          <option value="">Alle Kategorien</option>
          {Object.entries(CATEGORY_LABEL).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button type="submit" style={{
          background: RED, color: '#fff', border: 'none', borderRadius: '9px',
          padding: '9px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: FONT,
        }}>
          Suchen
        </button>
        {(q || kategoria) && (
          <a href="/admin/njoftimet" style={{
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
              {['Status', 'Titel', 'Kategorie', 'Preis', 'Stadt', 'Nutzer', 'Datum', 'Aktionen'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(njoftimet ?? []).map((ad: any) => (
              <tr key={ad.id} style={{ borderTop: '1px solid rgba(0,0,0,0.05)', opacity: ad.aktive ? 1 : 0.5 }}>
                <td style={{ padding: '11px 14px' }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                    background: ad.aktive ? '#F0FFF4' : '#F5F5F7',
                    color: ad.aktive ? '#1A7F37' : '#86868B',
                  }}>
                    {ad.aktive ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                <td style={{ padding: '11px 14px', maxWidth: '200px' }}>
                  <a href={`/njoftim/${ad.id}`} target="_blank" rel="noreferrer" style={{
                    fontSize: '13px', color: '#1D1D1F', fontWeight: '500', textDecoration: 'none',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block',
                  }}>
                    {ad.title}
                  </a>
                </td>
                <td style={{ padding: '11px 14px', fontSize: '12px', color: '#6E6E73', whiteSpace: 'nowrap' }}>
                  {CATEGORY_LABEL[ad.category] ?? ad.category}
                </td>
                <td style={{ padding: '11px 14px', fontSize: '12px', fontWeight: '600', color: RED, whiteSpace: 'nowrap' }}>
                  {ad.price?.toLocaleString('de-DE')} €
                </td>
                <td style={{ padding: '11px 14px', fontSize: '12px', color: '#6E6E73' }}>{ad.city}</td>
                <td style={{ padding: '11px 14px', fontSize: '12px', color: '#1D1D1F' }}>
                  <a href={`/admin/nutzer?id=${ad.user_id}`} style={{ color: '#1D1D1F', textDecoration: 'none', fontWeight: '500' }}>
                    {pMap[ad.user_id] ?? ad.user_id?.slice(0, 8) + '…'}
                  </a>
                </td>
                <td style={{ padding: '11px 14px', fontSize: '11px', color: '#86868B', whiteSpace: 'nowrap' }}>
                  {fmt(ad.created_at)}
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <ActionBtn
                      action={toggleNjoftimAktive.bind(null, ad.id, !ad.aktive)}
                      label={ad.aktive ? 'Deaktivieren' : 'Aktivieren'}
                      variant={ad.aktive ? 'grey' : 'green'}
                    />
                    <ActionBtn action={loeschNjoftim.bind(null, ad.id)} label="Löschen" variant="red" />
                  </div>
                </td>
              </tr>
            ))}
            {(njoftimet ?? []).length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', fontSize: '14px', color: '#86868B' }}>
                  Keine Anzeigen gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'center' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <a key={p} href={`/admin/njoftimet?${new URLSearchParams({ ...(q ? { q } : {}), ...(kategoria ? { kategoria } : {}), faqe: String(p) })}`} style={{
              padding: '7px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none',
              background: p === page ? RED : '#fff', color: p === page ? '#fff' : '#1D1D1F',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
