export default function Footer() {
  return (
    <footer style={{ background: '#111', padding: '20px 24px', marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <a href="/rreth-nesh" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>Rreth nesh</a>
        <a href="/kontakt" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>Kontakti</a>
        <a href="/kushtet" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>Kushtet</a>
        <a href="/privatesia" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>Privatësia</a>
        <a href="/feedback" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textDecoration: 'none' }}>Feedback</a>
      </div>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px', borderTop: '0.5px solid #333', paddingTop: '14px', margin: 0 }}>
        © 2025 Tregtoni.com – Të gjitha të drejtat e rezervuara
      </p>
    </footer>
  )
}
