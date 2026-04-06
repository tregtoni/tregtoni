import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

export default function RrethNeshPage() {
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
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#86868B', marginBottom: '8px' }}>
            <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
            <span>›</span>
            <span style={{ color: '#1D1D1F', fontWeight: '500' }}>Rreth nesh</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.6px' }}>
            Rreth Tregtoni
          </h1>
        </div>
      </section>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 32px 64px' }}>

        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '36px',
          marginBottom: '16px',
          boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1D1D1F', marginBottom: '14px', letterSpacing: '-0.4px' }}>
            Misioni ynë
          </h2>
          <p style={{ fontSize: '16px', color: '#3D3D3F', lineHeight: '1.75', margin: 0 }}>
            Tregtoni është platforma shqiptare e njoftimeve falas që lidh shitësit dhe blerësit në mënyrë të thjeshtë,
            të shpejtë dhe të sigurt. Besojmë se çdo gjë ka vlerën e saj — dhe dëshirojmë t'ju ndihmojmë ta gjeni atë vlerë.
          </p>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '36px',
          marginBottom: '16px',
          boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.4px' }}>
            Pse Tregtoni?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Falas', title: 'Falas për gjithmonë', text: 'Publiko njoftimet tua pa asnjë kosto. Nuk ka tarifa të fshehura.' },
              { label: '⚡', title: 'E shpejtë dhe e thjeshtë', text: 'Publiko një njoftim në pak sekonda — pa regjistrimin e detyrueshëm.' },
              { label: 'AL', title: 'Bërë për shqiptarët', text: 'Platformë e ndërtuar për komunitetin shqiptar, kudo që ndodheni.' },
              { label: '✓', title: 'E sigurt', text: 'Komunikimi direkt mes palëve, pa ndërmjetës të panevojshëm.' },
            ].map(({ label, title, text }) => (
              <div key={title} style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: '#F5F5F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#DA291C',
                  flexShrink: 0,
                }}>
                  {label}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1D1D1F', marginBottom: '4px', letterSpacing: '-0.1px' }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6E6E73', lineHeight: '1.6' }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '36px',
          marginBottom: '16px',
          boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1D1D1F', marginBottom: '14px', letterSpacing: '-0.4px' }}>
            Historia jonë
          </h2>
          <p style={{ fontSize: '16px', color: '#3D3D3F', lineHeight: '1.75', marginBottom: '14px' }}>
            Tregtoni lindi nga një ide e thjeshtë: të krijojmë vendin ku shqiptarët mund të shesin dhe blejnë gjithçka,
            lehtë dhe pa komplikime. Si startup i ri, jemi të përkushtuar ndaj komunitetit dhe vazhdimisht punojmë
            për të përmirësuar platformën.
          </p>
          <p style={{ fontSize: '16px', color: '#3D3D3F', lineHeight: '1.75', margin: 0 }}>
            Jemi ende në fillim të rrugës, por me çdo njoftim të publikuar dhe çdo transaksion të kryer,
            po ndërtojmë diçka të rëndësishme — tregun dixhital shqiptar.
          </p>
        </div>

        <div style={{
          background: '#1D1D1F',
          borderRadius: '20px',
          padding: '40px 36px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '10px', letterSpacing: '-0.4px' }}>
            Bashkohuni me ne
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)', marginBottom: '28px', lineHeight: '1.6' }}>
            Publiko njoftimin tënd falas sot dhe bëhu pjesë e komunitetit Tregtoni.
          </p>
          <a href="/njoftim/shto" style={{
            display: 'inline-block',
            background: '#DA291C',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: '14px',
            fontSize: '15px',
            fontWeight: '600',
            textDecoration: 'none',
            letterSpacing: '-0.1px',
          }}>
            Shto njoftim falas
          </a>
        </div>

      </div>

      <Footer />
    </main>
  )
}
