import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

export default function RrethNeshPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />

      <section style={{ background: '#fff', borderBottom: '3px solid #E24B4A', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Kryefaqja</a>
          <span style={{ color: '#ccc' }}>→</span>
          <span style={{ color: '#111' }}>Rreth nesh</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginTop: '6px', marginBottom: 0 }}>Rreth Tregtoni</h1>
      </section>

      <div style={{ maxWidth: '760px', margin: '32px auto', padding: '0 24px 48px' }}>

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '32px', marginBottom: '20px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚀</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '12px' }}>Misioni ynë</h2>
          <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.7', margin: 0 }}>
            Tregtoni është platforma shqiptare e njoftimeve falas që lidh shitësit dhe blerësit në mënyrë të thjeshtë,
            të shpejtë dhe të sigurt. Besojmë se çdo gjë ka vlerën e saj — dhe dëshirojmë t'ju ndihmojmë ta gjeni atë vlerë.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '32px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '20px' }}>Pse Tregtoni?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '💸', title: 'Falas për gjithmonë', text: 'Publiko njoftimet tua pa asnjë kosto. Nuk ka tarifa të fshehura.' },
              { icon: '⚡', title: 'E shpejtë dhe e thjeshtë', text: 'Publiko një njoftim në pak sekonda — pa regjistrimin e detyrueshëm.' },
              { icon: '🇦🇱', title: 'Bërë për shqiptarët', text: 'Platformë e ndërtuar për komunitetin shqiptar, kudo që ndodheni.' },
              { icon: '🔒', title: 'E sigurt', text: 'Komunikimi direkt mes palëve, pa ndërmjetës të panevojshëm.' },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>{title}</div>
                  <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '32px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '12px' }}>Historia jonë</h2>
          <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.7', marginBottom: '14px' }}>
            Tregtoni lindi nga një ide e thjeshtë: të krijojmë vendin ku shqiptarët mund të shesin dhe blejnë gjithçka,
            lehtë dhe pa komplikime. Si startup i ri, jemi të përkushtuar ndaj komunitetit dhe vazhdimisht punojmë
            për të përmirësuar platformën.
          </p>
          <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.7', margin: 0 }}>
            Jemi ende në fillim të rrugës, por me çdo njoftim të publikuar dhe çdo transaksion të kryer,
            po ndërtojmë diçka të rëndësishme — tregun dixhital shqiptar.
          </p>
        </div>

        <div style={{ background: '#E24B4A', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>Bashkohuni me ne</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginBottom: '20px', lineHeight: '1.6' }}>
            Publiko njoftimin tënd falas sot dhe bëhu pjesë e komunitetit Tregtoni.
          </p>
          <a href="/njoftim/shto" style={{ display: 'inline-block', background: '#fff', color: '#E24B4A', padding: '12px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
            + Shto njoftim falas
          </a>
        </div>

      </div>

      <Footer />
    </main>
  )
}
