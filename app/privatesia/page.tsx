import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

export default function PrivatesiaPage() {
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
    marginBottom: '12px',
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

  const ulStyle: React.CSSProperties = {
    margin: '10px 0 0',
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  const liStyle: React.CSSProperties = {
    fontSize: '15px',
    color: '#3D3D3F',
    lineHeight: '1.7',
  }

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
            <span style={{ color: '#1D1D1F', fontWeight: '500' }}>Privatësia</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.6px' }}>
            Politika e privatësisë
          </h1>
          <p style={{ fontSize: '13px', color: '#86868B', marginTop: '6px', marginBottom: 0, fontWeight: '500' }}>
            Versioni i fundit: Prill 2026 · Bazuar në DSGVO dhe Ligjin Nr. 9887 të Shqipërisë
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 32px 64px' }}>

        {/* Intro */}
        <div style={cardStyle}>
          <p style={pStyle}>
            Tregtoni.com respekton privatësinë tuaj dhe është e përkushtuar ndaj mbrojtjes së të dhënave tuaja personale.
            Kjo politikë privatësie shpjegon se cilat të dhëna mbledhim, pse i mbledhim, si i përdorim dhe cilat janë
            të drejtat tuaja, në përputhje me Rregulloren e Përgjithshme të Mbrojtjes së të Dhënave (DSGVO/GDPR) dhe
            Ligjin Nr. 9887 "Për Mbrojtjen e të Dhënave Personale" të Republikës së Shqipërisë.
          </p>
        </div>

        {/* 1. Kush jemi */}
        <div style={cardStyle}>
          <h2 style={h2Style}>1. Kush jemi ne</h2>
          <p style={pStyle}>
            Kontrollues i të dhënave personale është:
          </p>
          <div style={{
            background: '#F5F5F7',
            borderRadius: '12px',
            padding: '16px 20px',
            marginTop: '14px',
            fontSize: '14px',
            color: '#3D3D3F',
            lineHeight: '1.7',
          }}>
            <strong>Tregtoni.com</strong><br />
            Platforma shqiptare e njoftimeve të klasifikuara<br />
            Email: <a href="mailto:info@tregtoni.com" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '600' }}>info@tregtoni.com</a>
          </div>
        </div>

        {/* 2. Çfarë të dhënash mbledhim */}
        <div style={cardStyle}>
          <h2 style={h2Style}>2. Çfarë të dhënash mbledhim</h2>
          <p style={pStyle}>Mbledhim vetëm të dhënat e nevojshme për funksionimin e platformës:</p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Të dhëna të llogarisë:</strong> emri i plotë dhe adresa e emailit kur krijoni llogari.</li>
            <li style={liStyle}><strong>Të dhëna të njoftimeve:</strong> titull, përshkrim, çmim, qytet, kategori dhe fotografi që ngarkoni vetë.</li>
            <li style={liStyle}><strong>Mesazhe:</strong> komunikimet mes përdoruesve nëpërmjet sistemit të mesazheve të platformës.</li>
            <li style={liStyle}><strong>Të dhëna teknike:</strong> adresa IP, lloji i shfletuesit, sistemi operativ dhe faqet e vizituara — të mbledhura automatikisht për siguri dhe funksionim.</li>
            <li style={liStyle}><strong>Cookies:</strong> skedarë të vegjël teksti të ruajtur në pajisjen tuaj — shih seksionin 6 dhe faqen tonë të <a href="/cookies" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '600' }}>Cookies</a>.</li>
          </ul>
        </div>

        {/* 3. Pse i mbledhim */}
        <div style={cardStyle}>
          <h2 style={h2Style}>3. Pse i mbledhim (baza ligjore)</h2>
          <p style={pStyle}>Të dhënat tuaja përpunohen bazuar në:</p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>Ekzekutimi i kontratës (neni 6(1)(b) DSGVO):</strong> për të ofruar shërbimet e platformës — regjistrimi, publikimi i njoftimeve, mesazhet.</li>
            <li style={liStyle}><strong>Interesi legjitim (neni 6(1)(f) DSGVO):</strong> për parandalimin e mashtrimit, sigurimin e platformës dhe analizën e brendshme të funksionimit.</li>
            <li style={liStyle}><strong>Detyrimi ligjor (neni 6(1)(c) DSGVO):</strong> kur ligji kërkon ruajtjen ose zbulimin e të dhënave.</li>
            <li style={liStyle}><strong>Pëlqimi (neni 6(1)(a) DSGVO):</strong> për cookies opsionale analitike, kur jepni pëlqimin përmes bannerit të cookies.</li>
          </ul>
        </div>

        {/* 4. Sa gjatë i ruajmë */}
        <div style={cardStyle}>
          <h2 style={h2Style}>4. Sa gjatë i ruajmë të dhënat</h2>
          <ul style={ulStyle}>
            <li style={liStyle}>Të dhënat e llogarisë ruhen deri sa llogaria juaj të jetë aktive ose të mbyllet.</li>
            <li style={liStyle}>Njoftime të fshira ruhen deri në 30 ditë në kopje rezervë, pastaj fshihen përfundimisht.</li>
            <li style={liStyle}>Mesazhet ruhen ndërmjet palëve të përfshira dhe fshihen kur një nga palët fshin llogarinë.</li>
            <li style={liStyle}>Të dhënat teknike dhe regjistrat e sistemit ruhen deri në 90 ditë për qëllime sigurie.</li>
            <li style={liStyle}>Kur nuk ekziston asnjë bazë ligjore për ruajtje të mëtejshme, të dhënat fshihen ose anonymizohen.</li>
          </ul>
        </div>

        {/* 5. Të drejtat tuaja */}
        <div style={cardStyle}>
          <h2 style={h2Style}>5. Të drejtat tuaja</h2>
          <p style={pStyle}>
            Sipas DSGVO dhe Ligjit Nr. 9887, keni të drejtat e mëposhtme:
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}><strong>E drejta e aksesit (neni 15 DSGVO):</strong> mund të kërkoni kopjen e të dhënave tuaja personale.</li>
            <li style={liStyle}><strong>E drejta e korrigjimit (neni 16 DSGVO):</strong> mund të kërkoni korrigjimin e të dhënave të pasakta.</li>
            <li style={liStyle}><strong>E drejta e fshirjes (neni 17 DSGVO):</strong> mund të kërkoni fshirjen e të dhënave tuaja ("e drejta e harrimit").</li>
            <li style={liStyle}><strong>E drejta e kufizimit (neni 18 DSGVO):</strong> mund të kufizoni mënyrën si i përpunojmë të dhënat tuaja.</li>
            <li style={liStyle}><strong>E drejta e portabilitetit (neni 20 DSGVO):</strong> mund të merrni të dhënat tuaja në format të lexueshëm nga makina.</li>
            <li style={liStyle}><strong>E drejta e kundërshtimit (neni 21 DSGVO):</strong> mund të kundërshtoni përpunimin e bazuar në interesin legjitim.</li>
            <li style={liStyle}><strong>Tërheqja e pëlqimit:</strong> kur përpunimi bazohet në pëlqim, mund ta tërhiqni atë në çdo kohë pa ndikuar ligjshmërinë e përpunimit të mëparshëm.</li>
            <li style={liStyle}><strong>E drejta e ankesës:</strong> keni të drejtën të ankoheni te autoriteti mbikëqyrës kompetent — Komisioneri për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave Personale (KDIM) i Shqipërisë.</li>
          </ul>
          <div style={{
            background: '#F5F5F7',
            borderRadius: '12px',
            padding: '14px 18px',
            marginTop: '16px',
            fontSize: '14px',
            color: '#6E6E73',
          }}>
            Për të ushtruar të drejtat tuaja, na kontaktoni:{' '}
            <a href="mailto:info@tregtoni.com" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '600' }}>info@tregtoni.com</a>
          </div>
        </div>

        {/* 6. Cookies */}
        <div style={cardStyle}>
          <h2 style={h2Style}>6. Cookies</h2>
          <p style={pStyle}>
            Tregtoni.com përdor cookies për të siguruar funksionimin e duhur të platformës. Cookies të nevojshme
            aktivizohen automatikisht sepse janë të domosdoshme. Cookies opsionale aktivizohen vetëm me pëlqimin
            tuaj të shprehur nëpërmjet bannerit të cookies.
          </p>
          <p style={{ ...pStyle, marginTop: '12px' }}>
            Mund të gjeni listën e plotë të cookies dhe mundësinë e menaxhimit të tyre në faqen tonë të{' '}
            <a href="/cookies" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '600' }}>Cookies</a>.
          </p>
        </div>

        {/* 7. Ndarja me palë të treta */}
        <div style={cardStyle}>
          <h2 style={h2Style}>7. Ndarja me palë të treta</h2>
          <ul style={ulStyle}>
            <li style={liStyle}>Nuk shesim, nuk jepim me qira dhe nuk ndajmë të dhënat tuaja personale me palë të treta për qëllime tregtare.</li>
            <li style={liStyle}><strong>Supabase:</strong> platformë cloud për ruajtjen e të dhënave dhe autentikimin. Të dhënat ruhen me enkriptim. Supabase vepron si përpunues i të dhënave (Data Processor) sipas marrëveshjes sonë me ta.</li>
            <li style={liStyle}>Mund të zbulojmë të dhëna kur kërkohet nga ligji, nga urdhri gjyqësor ose nga autoritetet kompetente shtetërore.</li>
            <li style={liStyle}>Në rast blerjeje ose bashkimi të kompanisë, të dhënat mund t'i transferohen blerësit, i cili do të vazhdojë t'i përpunojë në përputhje me këtë politikë privatësie.</li>
          </ul>
        </div>

        {/* 8. Siguria */}
        <div style={cardStyle}>
          <h2 style={h2Style}>8. Siguria e të dhënave</h2>
          <ul style={ulStyle}>
            <li style={liStyle}>Të gjitha të dhënat transmetohen nëpërmjet protokollit HTTPS me enkriptim TLS.</li>
            <li style={liStyle}>Fjalëkalimet ruhen të hashëuara me algoritme të sigurta — nuk janë të lexueshme as për ne.</li>
            <li style={liStyle}>Aksesi në bazën e të dhënave është i kufizuar vetëm për stafin teknik të autorizuar.</li>
            <li style={liStyle}>Kryejmë rishikime periodike të sigurisë dhe veprojmë menjëherë në rast të incidenteve.</li>
          </ul>
        </div>

        {/* 9. Kontakti */}
        <div style={cardStyle}>
          <h2 style={h2Style}>9. Kontakti</h2>
          <p style={pStyle}>
            Për çdo pyetje, kërkesë ose ankesë lidhur me privatësinë tuaj dhe mbrojtjen e të dhënave personale,
            na kontaktoni drejtpërdrejt:
          </p>
          <div style={{
            background: '#F5F5F7',
            borderRadius: '12px',
            padding: '16px 20px',
            marginTop: '14px',
            fontSize: '14px',
            color: '#3D3D3F',
            lineHeight: '1.7',
          }}>
            <strong>Tregtoni.com — Mbrojtja e të Dhënave</strong><br />
            Email: <a href="mailto:info@tregtoni.com" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '600' }}>info@tregtoni.com</a><br />
            Do të përgjigjemi brenda 30 ditëve nga marrja e kërkesës suaj.
          </div>
        </div>

      </div>

      <Footer />
    </main>
  )
}
