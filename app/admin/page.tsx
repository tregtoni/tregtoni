import { createAdminClient } from '@/lib/supabase/admin'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color?: string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '16px', padding: '24px 28px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)',
      fontFamily: FONT,
    }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
        {label}
      </div>
      <div style={{ fontSize: '36px', fontWeight: '800', color: color ?? '#1D1D1F', letterSpacing: '-1px', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '12px', color: '#86868B', marginTop: '6px' }}>{sub}</div>}
    </div>
  )
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function AdminDashboard() {
  const admin = createAdminClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    { count: totalAds },
    { count: totalMeldungen },
    { count: offeneMeldungen },
    { count: heuteAds },
    { data: recentAds },
    { data: recentMeldungen },
    { data: { users: authUsers } },
  ] = await Promise.all([
    admin.from('njoftimet').select('id', { count: 'exact', head: true }),
    admin.from('meldungen').select('id', { count: 'exact', head: true }),
    admin.from('meldungen').select('id', { count: 'exact', head: true }).eq('erledigt', false),
    admin.from('njoftimet').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    admin.from('njoftimet').select('id, title, category, city, created_at').order('created_at', { ascending: false }).limit(6),
    admin.from('meldungen').select('id, verstoss_kategoria, krijuar_me, erledigt').order('krijuar_me', { ascending: false }).limit(6),
    admin.auth.admin.listUsers({ perPage: 1 }),
  ])

  const { data: { users: allUsersPage } } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const totalUsers = allUsersPage.length
  const heuteNutzer = allUsersPage.filter(u => new Date(u.created_at) >= today).length

  const VERSTOSS: Record<string, string> = {
    spam: 'Spam / Reklamë', mashtrim: 'Mashtrim', cmim: 'Çmim i gabuar',
    ndaluar: 'Përmbajtje e ndaluar', ngacmim: 'Ngacmim', tjeter: 'Tjetër',
  }

  const CATEGORY: Record<string, string> = {
    makina: '🚗', imobiliare: '🏢', shtepi: '🏡', elektronik: '📱', pune: '💼',
    sherbime: '🛠️', mode: '👗', femije: '👶', kafshe: '🐾', mesim: '📚',
    bileta: '🎟️', hobi: '🎨', muzike: '🎵', dhurate: '🎁',
  }

  return (
    <div style={{ fontFamily: FONT }}>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1D1D1F', marginBottom: '28px', letterSpacing: '-0.5px' }}>
        Dashboard
      </h1>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Nutzer gesamt" value={totalUsers} sub={`+${heuteNutzer} heute`} />
        <StatCard label="Anzeigen gesamt" value={totalAds ?? 0} sub={`+${heuteAds ?? 0} heute`} />
        <StatCard label="Meldungen offen" value={offeneMeldungen ?? 0} color={offeneMeldungen ? RED : '#1D1D1F'} sub={`${totalMeldungen ?? 0} gesamt`} />
        <StatCard label="Neue Nutzer heute" value={heuteNutzer} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Recent ads */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1D1D1F' }}>Neueste Anzeigen</div>
            <a href="/admin/njoftimet" style={{ fontSize: '12px', color: RED, textDecoration: 'none', fontWeight: '600' }}>Alle →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(recentAds ?? []).map(ad => (
              <div key={ad.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{CATEGORY[ad.category] ?? '📦'}</span>
                  <a href={`/njoftim/${ad.id}`} target="_blank" rel="noreferrer" style={{
                    fontSize: '13px', color: '#1D1D1F', textDecoration: 'none', fontWeight: '500',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {ad.title}
                  </a>
                </div>
                <div style={{ fontSize: '11px', color: '#86868B', flexShrink: 0 }}>{fmt(ad.created_at)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reports */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1D1D1F' }}>Neueste Meldungen</div>
            <a href="/admin/meldungen" style={{ fontSize: '12px', color: RED, textDecoration: 'none', fontWeight: '600' }}>Alle →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(recentMeldungen ?? []).map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%',
                    background: m.erledigt ? '#34C759' : RED, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '13px', color: '#1D1D1F', fontWeight: '500' }}>
                    {VERSTOSS[m.verstoss_kategoria] ?? m.verstoss_kategoria}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#86868B', flexShrink: 0 }}>{fmt(m.krijuar_me)}</div>
              </div>
            ))}
            {(recentMeldungen ?? []).length === 0 && (
              <div style={{ fontSize: '13px', color: '#86868B' }}>Keine Meldungen</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
