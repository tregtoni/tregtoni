import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import FeedbackForm from './FeedbackForm'

export default function FeedbackPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />

      <section style={{ background: '#fff', borderBottom: '3px solid #E24B4A', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Kryefaqja</a>
          <span style={{ color: '#ccc' }}>→</span>
          <span style={{ color: '#111' }}>Feedback</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginTop: '6px', marginBottom: 0 }}>Feedback</h1>
      </section>

      <div style={{ maxWidth: '560px', margin: '32px auto', padding: '0 24px 48px' }}>
        <FeedbackForm />
      </div>

      <Footer />
    </main>
  )
}
