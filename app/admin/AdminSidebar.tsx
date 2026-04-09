'use client'

import { usePathname } from 'next/navigation'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED = '#DA291C'

const NAV = [
  { href: '/admin',            label: 'Dashboard',    icon: '📊' },
  { href: '/admin/meldungen',  label: 'Meldungen',    icon: '🚩' },
  { href: '/admin/njoftimet',  label: 'Anzeigen',     icon: '📋' },
  { href: '/admin/nutzer',     label: 'Nutzer',       icon: '👥' },
  { href: '/admin/statistika', label: 'Statistika',   icon: '📈' },
  { href: '/admin/mesazhet',   label: 'Nachrichten',  icon: '💬' },
]

export default function AdminSidebar({ meldungenOffen }: { meldungenOffen: number }) {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '230px',
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: FONT,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px',
            background: RED, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '800', letterSpacing: '-0.5px',
          }}>
            TG
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#1D1D1F' }}>Admin</div>
            <div style={{ fontSize: '10px', color: '#86868B' }}>Tregtoni</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {NAV.map(item => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '10px',
                marginBottom: '2px',
                textDecoration: 'none',
                background: isActive ? '#FFF5F5' : 'transparent',
                color: isActive ? RED : '#1D1D1F',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.label}
              </span>
              {item.href === '/admin/meldungen' && meldungenOffen > 0 && (
                <span style={{
                  background: RED, color: '#fff',
                  fontSize: '10px', fontWeight: '700',
                  padding: '2px 6px', borderRadius: '10px', lineHeight: '1.4',
                }}>
                  {meldungenOffen}
                </span>
              )}
            </a>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <a href="/" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '9px 12px', borderRadius: '10px',
          textDecoration: 'none', color: '#86868B', fontSize: '13px', fontWeight: '500',
        }}>
          ← Zurück zur Website
        </a>
      </div>
    </aside>
  )
}
