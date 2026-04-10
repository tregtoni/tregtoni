import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

export default function CookiesPage() {
  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '20px',
    padding: '36px',
    marginBottom: '16px',
    boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.05)',
  }

  const h2Style: React.CSSProperties = {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: '16px',
    marginTop: 0,
    letterSpacing: '-0.2px',
    paddingLeft: '14px',
    borderLeft: '3px solid #DA291C',
  }

  const pStyle: React.CSSProperties = {
    fontSize: '15px',
    color: '#3D3D3F',
    lineHeight: '1.75',
    margin: 0,
  }

  const cookieTypes = [
    {
      name: 'Cookies të sesionit (Session)',
      type: 'Të nevojshme',
      required: true,
      purpose: 'Ruajnë gjendjen e autentikimit të llogarisë suaj gjatë vizitës. Pa këto cookies nuk mund të qëndroni të kyçur.',
      duration: 'Fshihen kur mbyllni shfletuesin',
    },
    {
      name: 'Cookies të preferencave',
      type: 'Funksionale',
      required: true,
      purpose: "Ruajnë preferencat tuaja si gjuha dhe cilësimet e shfaqjes. Ndihmojnë platformën t'ju ofrojë një përvojë të personalizuar.",
      duration: 'Deri në 1 vit',
    },
    {
      name: 'Cookies analitike',
      type: 'Opsionale',
      required: false,
      purpose: 'Na ndihmojnë të kuptojmë si e përdorin vizitorët platformën — cilat faqe vizitohen më shumë, sa kohë qëndrojnë dhe ku ndodhin gabimet. Të dhënat janë të anonimizuara.',
      duration: 'Deri në 2 vjet',
    },
    {
      name: 'Cookie e pëlqimit',
      type: 'Të nevojshme',
      required: true,
      purpose: 'Ruan zgjedhjen tuaj mbi cookies (pranoj të gjitha / vetëm të nevojshme) në localStorage të shfletuesit tuaj. Nevojitet për të mos shfaqur bannerin e cookies çdo herë.',
      duration: 'Deri në 1 vit (localStorage)',
    },
  ]

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      <section style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '20px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#86868B', marginBottom: '8px' }}>
            <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
            <span>›</span>
            <span style={{ color: '#1D1D1F', fontWeight: '500' }}>Cookies</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.6px' }}>
            Politika e Cookies
          </h1>
          <p style={{ fontSize: '13px', color: '#86868B', marginTop: '6px', marginBottom: 0, fontWeight: '500' }}>
            Versioni i fundit: Prill 2026
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 32px 64px' }}>

        {/* Intro */}
        <div style={cardStyle}>
          <p style={pStyle}>
            Cookies janë skedarë të vegjël teksti që ruhen në pajisjen tuaj (kompjuter, telefon, tablet) kur vizitoni
            një faqe interneti. Ata ndihmojnë faqen të funksionojë siç duhet, të mbajë mend preferencat tuaja dhe
            të sigurojë përvojë të personalizuar. Kjo faqe shpjegon se cilat cookies përdorim dhe pse.
          </p>
        </div>

        {/* Cookie types table */}
        <div style={cardStyle}>
          <h2 style={h2Style}>Llojet e cookies që përdorim</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cookieTypes.map((cookie) => (
              <div
                key={cookie.name}
                style={{
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '14px',
                  padding: '20px 22px',
                  background: '#FAFAFA',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '10px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#1D1D1F', letterSpacing: '-0.1px' }}>
                    {cookie.name}
                  </div>
                  <span style={{
                    display: 'inline-block',
                    background: cookie.required ? '#E8F5E9' : '#FFF3E0',
                    color: cookie.required ? '#2E7D32' : '#E65100',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    letterSpacing: '0.2px',
                    flexShrink: 0,
                  }}>
                    {cookie.type}
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: '#3D3D3F', lineHeight: '1.65', margin: '0 0 10px' }}>
                  {cookie.purpose}
                </p>

                <div>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Kohëzgjatja
                  </span>
                  <div style={{ fontSize: '13px', color: '#6E6E73', marginTop: '2px' }}>{cookie.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Managing cookies */}
        <div style={cardStyle}>
          <h2 style={h2Style}>Si t'i menaxhoni cookies</h2>
          <p style={pStyle}>
            Mund të menaxhoni preferencat e cookies në mënyrat e mëposhtme:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#F5F5F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                color: '#DA291C',
                flexShrink: 0,
              }}>1</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1D1D1F', marginBottom: '3px' }}>
                  Banneri i cookies
                </div>
                <div style={{ fontSize: '14px', color: '#6E6E73', lineHeight: '1.6' }}>
                  Kur vizitoni Tregtoni.com për herë të parë, do t'ju shfaqet banneri i cookies ku mund të zgjidhni "Pranoj të gjitha" ose "Vetëm të nevojshme".
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#F5F5F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                color: '#DA291C',
                flexShrink: 0,
              }}>2</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1D1D1F', marginBottom: '3px' }}>
                  Cilësimet e shfletuesit
                </div>
                <div style={{ fontSize: '14px', color: '#6E6E73', lineHeight: '1.6' }}>
                  Mund të bllokoni ose fshini cookies direkt nga cilësimet e shfletuesit tuaj (Chrome, Firefox, Safari, Edge). Kini parasysh që bllokimi i cookies të nevojshme mund të ndikojë në funksionimin e platformës.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#F5F5F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '700',
                color: '#DA291C',
                flexShrink: 0,
              }}>3</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1D1D1F', marginBottom: '3px' }}>
                  Rivendosja e zgjedhjes
                </div>
                <div style={{ fontSize: '14px', color: '#6E6E73', lineHeight: '1.6' }}>
                  Mund ta rivendosni zgjedhjen tuaj duke fshirë të dhënat e localStorage të shfletuesit tuaj ose duke na kontaktuar.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={cardStyle}>
          <h2 style={h2Style}>Pyetje mbi cookies</h2>
          <p style={pStyle}>
            Nëse keni pyetje rreth përdorimit të cookies nga Tregtoni.com ose dëshironi të ushtroni të drejtat tuaja,
            mund të na kontaktoni gjithmonë:
          </p>
          <div style={{
            background: '#F5F5F7',
            borderRadius: '12px',
            padding: '16px 20px',
            marginTop: '14px',
            fontSize: '14px',
            color: '#6E6E73',
          }}>
            Email: <a href="mailto:info@tregtoni.com" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '600' }}>info@tregtoni.com</a>
            <span style={{ margin: '0 10px', color: '#D1D1D6' }}>·</span>
            <a href="/privatesia" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '600' }}>Politika e privatësisë</a>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  )
}
