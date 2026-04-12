export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(0,0,0,0.08)',
      background: '#F5F5F7',
      padding: '48px 32px 28px',
      marginTop: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '36px',
          flexWrap: 'wrap',
          gap: '32px',
        }}>
          <div>
            <div style={{
              fontSize: '19px',
              fontWeight: '700',
              color: '#1D1D1F',
              letterSpacing: '-0.4px',
              marginBottom: '8px',
            }}>
              Tregtoni<span style={{ color: '#DA291C' }}>.com</span>
            </div>
            <p style={{
              fontSize: '13px',
              color: '#6E6E73',
              margin: 0,
              maxWidth: '220px',
              lineHeight: '1.6',
            }}>
              Platforma shqiptare për njoftime falas.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap' }}>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#1D1D1F',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                marginBottom: '14px',
              }}>
                Platforma
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="/rreth-nesh" style={{ color: '#6E6E73', fontSize: '13px', textDecoration: 'none' }}>Rreth nesh</a>
                <a href="/kontakt" style={{ color: '#6E6E73', fontSize: '13px', textDecoration: 'none' }}>Kontakti</a>
                <a href="/feedback" style={{ color: '#6E6E73', fontSize: '13px', textDecoration: 'none' }}>Feedback</a>
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#1D1D1F',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                marginBottom: '14px',
              }}>
                Ligjore
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="/kushtet" style={{ color: '#6E6E73', fontSize: '13px', textDecoration: 'none' }}>Kushtet</a>
                <a href="/privatesia" style={{ color: '#6E6E73', fontSize: '13px', textDecoration: 'none' }}>Privatësia</a>
                <a href="/cookies" style={{ color: '#6E6E73', fontSize: '13px', textDecoration: 'none' }}>Cookies</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '20px' }}>
          <p style={{ fontSize: '12px', color: '#86868B', margin: 0 }}>
            © 2025 Tregtoni.com – Të gjitha të drejtat e rezervuara
          </p>
        </div>
      </div>
    </footer>
  )
}
