import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import ShtoForm from './ShtoForm'

export default function ShtoNjoftim() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      <section style={{
        background: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '20px 32px',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#86868B', marginBottom: '8px' }}>
            <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
            <span>›</span>
            <span style={{ color: '#1D1D1F', fontWeight: '500' }}>Shto njoftim</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.6px' }}>
            Shto njoftim falas
          </h1>
        </div>
      </section>

      <ShtoForm />

      <Footer />
    </main>
  )
}
