import { createAdminClient } from '@/lib/supabase/admin'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

const CATEGORY_LABEL: Record<string, string> = {
  makina: '🚗 Automjete', imobiliare: '🏢 Imobiliare', shtepi: '🏡 Shtëpi',
  elektronik: '📱 Elektronik', pune: '💼 Punë', sherbime: '🛠️ Shërbime',
  mode: '👗 Modë', femije: '👶 Fëmijë', kafshe: '🐾 Kafshë',
  mesim: '📚 Mësim', bileta: '🎟️ Bileta', hobi: '🎨 Hobi',
  muzike: '🎵 Muzikë', dhurate: '🎁 Dhuratë',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px 28px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)', fontFamily: FONT }}>
      <div style={{ fontSize: '15px', fontWeight: '700', color: '#1D1D1F', marginBottom: '20px' }}>{title}</div>
      {children}
    </div>
  )
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
      <div style={{ width: '160px', fontSize: '12px', color: '#1D1D1F', fontWeight: '500', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </div>
      <div style={{ flex: 1, height: '8px', background: '#F5F5F7', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: RED, borderRadius: '4px', transition: 'width 0.3s' }} />
      </div>
      <div style={{ width: '36px', fontSize: '13px', fontWeight: '700', color: '#1D1D1F', textAlign: 'right', flexShrink: 0 }}>{value}</div>
    </div>
  )
}

function MonthRow({ month, value, max }: { month: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  const [y, m] = month.split('-')
  const label = new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString('de-DE', { month: 'short', year: '2-digit' })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
      <div style={{ width: '52px', fontSize: '11px', color: '#86868B', fontWeight: '600', flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: '7px', background: '#F5F5F7', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: '#1D1D1F', borderRadius: '4px' }} />
      </div>
      <div style={{ width: '28px', fontSize: '12px', fontWeight: '700', color: '#1D1D1F', textAlign: 'right', flexShrink: 0 }}>{value}</div>
    </div>
  )
}

export default async function StatistikaPage() {
  const admin = createAdminClient()

  const [
    { data: adRows },
    { data: { users: authUsers } },
    { data: cityRows },
  ] = await Promise.all([
    admin.from('njoftimet').select('category, user_id, created_at'),
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from('njoftimet').select('city'),
  ])

  // Ads per category
  const byCategory: Record<string, number> = {}
  for (const ad of adRows ?? []) {
    byCategory[ad.category] = (byCategory[ad.category] || 0) + 1
  }
  const sortedCategories = Object.entries(byCategory).sort(([, a], [, b]) => b - a)
  const maxCategory = sortedCategories[0]?.[1] ?? 1

  // Ads per month (last 12 months)
  const adsByMonth: Record<string, number> = {}
  for (const ad of adRows ?? []) {
    const month = ad.created_at?.substring(0, 7)
    if (month) adsByMonth[month] = (adsByMonth[month] || 0) + 1
  }
  const last12AdMonths = Object.entries(adsByMonth).sort(([a], [b]) => a.localeCompare(b)).slice(-12)
  const maxAdMonth = Math.max(...last12AdMonths.map(([, v]) => v), 1)

  // Users per month (last 12 months)
  const usersByMonth: Record<string, number> = {}
  for (const u of authUsers) {
    const month = u.created_at?.substring(0, 7)
    if (month) usersByMonth[month] = (usersByMonth[month] || 0) + 1
  }
  const last12UserMonths = Object.entries(usersByMonth).sort(([a], [b]) => a.localeCompare(b)).slice(-12)
  const maxUserMonth = Math.max(...last12UserMonths.map(([, v]) => v), 1)

  // Most active users (top 10)
  const userAdCount: Record<string, number> = {}
  for (const ad of adRows ?? []) {
    userAdCount[ad.user_id] = (userAdCount[ad.user_id] || 0) + 1
  }
  const topUserIds = Object.entries(userAdCount).sort(([, a], [, b]) => b - a).slice(0, 10).map(([id]) => id)
  const { data: topProfiles } = topUserIds.length
    ? await admin.from('profiles').select('id, full_name').in('id', topUserIds)
    : { data: [] }
  const topPMap: Record<string, string> = Object.fromEntries((topProfiles ?? []).map((p: any) => [p.id, p.full_name]))
  const topUsers = Object.entries(userAdCount).sort(([, a], [, b]) => b - a).slice(0, 10)
  const maxUserAds = topUsers[0]?.[1] ?? 1

  // Top cities
  const byCities: Record<string, number> = {}
  for (const row of cityRows ?? []) {
    if (row.city) byCities[row.city] = (byCities[row.city] || 0) + 1
  }
  const topCities = Object.entries(byCities).sort(([, a], [, b]) => b - a).slice(0, 10)
  const maxCity = topCities[0]?.[1] ?? 1

  return (
    <div style={{ fontFamily: FONT }}>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1D1D1F', marginBottom: '28px', letterSpacing: '-0.5px' }}>
        Statistika
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Ads per category */}
        <Section title="Anzeigen pro Kategorie">
          {sortedCategories.map(([cat, count]) => (
            <BarRow key={cat} label={CATEGORY_LABEL[cat] ?? cat} value={count} max={maxCategory} />
          ))}
          {sortedCategories.length === 0 && <div style={{ fontSize: '13px', color: '#86868B' }}>Keine Daten</div>}
        </Section>

        {/* Top cities */}
        <Section title="Top Städte">
          {topCities.map(([city, count]) => (
            <BarRow key={city} label={city} value={count} max={maxCity} />
          ))}
          {topCities.length === 0 && <div style={{ fontSize: '13px', color: '#86868B' }}>Keine Daten</div>}
        </Section>

        {/* Ads per month */}
        <Section title="Neue Anzeigen pro Monat">
          {last12AdMonths.map(([month, count]) => (
            <MonthRow key={month} month={month} value={count} max={maxAdMonth} />
          ))}
          {last12AdMonths.length === 0 && <div style={{ fontSize: '13px', color: '#86868B' }}>Keine Daten</div>}
        </Section>

        {/* Users per month */}
        <Section title="Neue Nutzer pro Monat">
          {last12UserMonths.map(([month, count]) => (
            <MonthRow key={month} month={month} value={count} max={maxUserMonth} />
          ))}
          {last12UserMonths.length === 0 && <div style={{ fontSize: '13px', color: '#86868B' }}>Keine Daten</div>}
        </Section>

        {/* Most active users */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Section title="Aktivste Nutzer (nach Anzeigenanzahl)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
              {topUsers.map(([id, count]) => (
                <BarRow key={id} label={topPMap[id] ?? id.slice(0, 12) + '…'} value={count} max={maxUserAds} />
              ))}
            </div>
            {topUsers.length === 0 && <div style={{ fontSize: '13px', color: '#86868B' }}>Keine Daten</div>}
          </Section>
        </div>

      </div>
    </div>
  )
}
