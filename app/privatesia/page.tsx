import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED  = '#E24B4A'

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: '20px',
  padding: '40px 44px',
  marginBottom: '16px',
  boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
  border: '1px solid rgba(0,0,0,0.05)',
}

const h2: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#111111',
  margin: '0 0 18px',
  letterSpacing: '-0.3px',
  paddingLeft: '18px',
  borderLeft: `4px solid ${RED}`,
  lineHeight: '1.3',
}

const p: React.CSSProperties = {
  fontSize: '15px',
  color: '#3D3D3F',
  lineHeight: '1.85',
  margin: '0 0 14px',
}

const pLast: React.CSSProperties = { ...p, margin: 0 }

const li: React.CSSProperties = {
  fontSize: '15px',
  color: '#3D3D3F',
  lineHeight: '1.85',
  marginBottom: '8px',
}

const note: React.CSSProperties = {
  background: '#F5F5F7',
  borderRadius: '12px',
  padding: '16px 20px',
  fontSize: '14px',
  color: '#6E6E73',
  lineHeight: '1.7',
  marginTop: '16px',
}

export default function PrivatesiaPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#F5F5F7', fontFamily: FONT }}>
      <NavBar />

      {/* Header */}
      <section style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '20px 32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#86868B', marginBottom: '8px' }}>
            <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
            <span>›</span>
            <span style={{ color: '#111111', fontWeight: '500' }}>Privatësia</span>
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#111111', margin: '0 0 6px', letterSpacing: '-0.6px' }}>
            Politika e Privatësisë
          </h1>
          <p style={{ fontSize: '13px', color: '#86868B', margin: 0, fontWeight: '500' }}>
            Versioni i fundit: Prill 2026 &nbsp;·&nbsp; Tregtoni.com
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 32px 64px' }}>

        {/* 1. Hyrje */}
        <div style={card}>
          <h2 style={h2}>Hyrje</h2>
          <p style={p}>
            Tregtoni.com është platforma shqiptare e njoftimeve të klasifikuara për shitblerjen e mallrave
            dhe shërbimeve. Kjo politikë shpjegon çfarë të dhënash mbledhim, si i përdorim dhe cilat janë
            të drejtat tuaja.
          </p>
          <p style={pLast}>
            Baza kryesore ligjore është <strong>Ligji Nr. 9887 "Për mbrojtjen e të dhënave personale"</strong>{' '}
            (i ndryshuar me Ligjin Nr. 48/2012). Për përdoruesit rezidentë në Bashkimin Evropian —
            në veçanti diasporën shqiptare në Gjermani, Austri dhe Zvicër — respektojmë gjithashtu
            parimet e <strong>GDPR/DSGVO</strong> si kornizë plotësuese.
          </p>
        </div>

        {/* 2. Të dhënat që mbledhim */}
        <div style={card}>
          <h2 style={h2}>Të dhënat që mbledhim</h2>
          <p style={p}><strong>Gjatë regjistrimit:</strong> emri, adresa e emailit, fjalëkalimi i enkriptuar dhe lloji i llogarisë (privat ose biznes).</p>
          <p style={p}><strong>Gjatë publikimit të njoftimeve:</strong> titulli, përshkrimi, çmimi, qyteti, kategoria, fotografitë dhe të dhëna shtesë sipas kategorisë.</p>
          <p style={pLast}><strong>Të dhëna teknike:</strong> adresa IP, lloji i shfletuesit, data dhe ora e hyrjes, si dhe cookies të sesionit.</p>
        </div>

        {/* 3. Si i përdorim të dhënat */}
        <div style={card}>
          <h2 style={h2}>Si i përdorim të dhënat</h2>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={li}>Për të ofruar dhe mirëmbajtur shërbimet e platformës</li>
            <li style={li}>Për të mundësuar publikimin dhe menaxhimin e njoftimeve tuaja</li>
            <li style={li}>Për të verifikuar identitetin dhe parandaluar mashtrimet</li>
            <li style={li}>Për të dërguar njoftime rreth llogarisë suaj</li>
            <li style={li}>Për të analizuar dhe përmirësuar funksionimin e platformës</li>
            <li style={li}>Për të zbatuar Kushtet e Përdorimit dhe politikat e Tregtoni.com</li>
          </ul>
        </div>

        {/* 4. Baza ligjore */}
        <div style={card}>
          <h2 style={h2}>Baza ligjore e përpunimit</h2>
          <p style={p}>
            Baza kryesore mbështetet në <strong>Ligjin Nr. 9887</strong>. Për përdoruesit e BE-së,
            zbatojmë njëkohësisht edhe bazat e nenit 6 të <strong>GDPR</strong>:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 16px' }}>
            <li style={li}><strong>Kontrata</strong> — për ofrimin e shërbimeve të kërkuara prej jush.</li>
            <li style={li}><strong>Pëlqimi</strong> — për cookies opsionale, të tërhequshëm në çdo kohë.</li>
            <li style={li}><strong>Interesi legjitim</strong> — siguria e platformës dhe parandalimi i abuzimeve.</li>
            <li style={li}><strong>Detyrimi ligjor</strong> — kur kërkohet nga legjislacioni shqiptar ose evropian.</li>
          </ul>
          <div style={note}>
            Ligji Nr. 9887 zbatohet për të gjithë përdoruesit. GDPR/DSGVO zbatohet si shtesë për
            përdoruesit rezidentë në vendet e BE-së.
          </div>
        </div>

        {/* 5. Ruajtja */}
        <div style={card}>
          <h2 style={h2}>Ruajtja e të dhënave</h2>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={li}><strong>Llogaria juaj:</strong> ruhet deri sa ta fshini vetë ose të kërkoni fshirjen.</li>
            <li style={li}><strong>Njoftimet:</strong> ruhen gjatë periudhës aktive dhe deri në 6 muaj pas fshirjes.</li>
            <li style={li}><strong>Të dhënat teknike:</strong> fshihen pas 90 ditësh.</li>
            <li style={li}><strong>Cookies:</strong> sipas afateve të specifikuara në <a href="/cookies" style={{ color: RED, textDecoration: 'none', fontWeight: '500' }}>Politikën e Cookies</a>.</li>
          </ul>
        </div>

        {/* 6. Ndarja */}
        <div style={card}>
          <h2 style={h2}>Ndarja e të dhënave</h2>
          <p style={p}>
            Tregtoni.com <strong>nuk shet</strong> dhe <strong>nuk jep me qira</strong> të dhënat tuaja
            personale palëve të treta. Të dhënat mund të ndahen vetëm në rastet e mëposhtme:
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={li}><strong>Ofruesit e infrastrukturës:</strong> platforma përdor shërbime të palëve të treta për hosting dhe ruajtjen e të dhënave, të cilët veprojnë si përpunues të të dhënave sipas udhëzimeve tona dhe janë të detyruar të zbatojnë standardet e privatësisë.</li>
            <li style={li}><strong>Autoritetet kompetente:</strong> kur kemi detyrim ligjor ose urdhër gjyqësor.</li>
            <li style={li}><strong>Mes përdoruesve:</strong> informacioni i profilit publik është i dukshëm sipas cilësimeve tuaja të privatësisë.</li>
          </ul>
        </div>

        {/* 7. Të drejtat */}
        <div style={card}>
          <h2 style={h2}>Të drejtat tuaja</h2>
          <p style={p}>Sipas Ligjit Nr. 9887 dhe GDPR (për rezidentët e BE-së), keni të drejtat e mëposhtme:</p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 16px' }}>
            <li style={li}><strong>Aksesi:</strong> të kërkoni një kopje të të dhënave tuaja personale.</li>
            <li style={li}><strong>Korrigjimi:</strong> të korrigjoni të dhëna të pasakta ose të pakompletuara.</li>
            <li style={li}><strong>Fshirja:</strong> të kërkoni fshirjen e të dhënave kur nuk janë më të nevojshme.</li>
            <li style={li}><strong>Kufizimi:</strong> të kufizoni mënyrën e përpunimit të të dhënave tuaja.</li>
            <li style={li}><strong>Kundërshtimi:</strong> të kundërshtoni përpunimin e bazuar në interes legjitim.</li>
            <li style={li}><strong>Tërheqja e pëlqimit:</strong> të tërhiqni pëlqimin tuaj në çdo kohë.</li>
          </ul>
          <div style={note}>
            Për të ushtruar të drejtat tuaja, na kontaktoni në{' '}
            <a href="mailto:info@tregtoni.com" style={{ color: RED, fontWeight: '600', textDecoration: 'none' }}>
              info@tregtoni.com
            </a>.
            Keni gjithashtu të drejtë të paraqisni ankesë pranë autoritetit kompetent të mbrojtjes
            së të dhënave në vendin tuaj të rezidencës.
          </div>
        </div>

        {/* 8. Cookies */}
        <div style={card}>
          <h2 style={h2}>Cookies</h2>
          <p style={pLast}>
            Tregtoni.com përdor cookies për të siguruar funksionimin e platformës dhe për të mbajtur
            mend preferencat tuaja. Për informacion të detajuar mbi llojet e cookies dhe mënyrën e
            menaxhimit të tyre, vizitoni{' '}
            <a href="/cookies" style={{ color: RED, fontWeight: '600', textDecoration: 'none' }}>
              Politikën tonë të Cookies
            </a>.
          </p>
        </div>

        {/* 9. Siguria */}
        <div style={card}>
          <h2 style={h2}>Siguria</h2>
          <p style={pLast}>
            Mbrojtja e të dhënave tuaja është prioritet për ne. Zbatojmë masa të forta teknike dhe
            organizative për të garantuar konfidencialitetin, integritetin dhe disponueshmërinë e
            informacionit tuaj personal, në përputhje me standardet më të mira të industrisë.
          </p>
        </div>

        {/* 10. Ndryshimet */}
        <div style={card}>
          <h2 style={h2}>Ndryshimet e kësaj politike</h2>
          <p style={pLast}>
            Tregtoni.com rezervon të drejtën të ndryshojë këtë politikë në çdo kohë. Ndryshimet e
            rëndësishme do t'ju njoftohen me email ose me njoftim në platformë. Vazhdimi i përdorimit
            të platformës pas ndryshimeve përbën pranimin e politikës së re. Data e versionit të fundit
            është e shënuar në krye të kësaj faqeje.
          </p>
        </div>

        {/* 11. Kontakti */}
        <div style={card}>
          <h2 style={h2}>Kontakti</h2>
          <p style={{ ...p, marginBottom: '16px' }}>
            Për çdo pyetje ose kërkesë në lidhje me mbrojtjen e të dhënave tuaja personale:
          </p>
          <div style={{
            background: '#F5F5F7', borderRadius: '14px', padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: '6px',
          }}>
            <div style={{ fontSize: '15px', color: '#111111', fontWeight: '600' }}>Tregtoni.com</div>
            <div style={{ fontSize: '14px', color: '#6E6E73' }}>
              Email:{' '}
              <a href="mailto:info@tregtoni.com" style={{ color: RED, textDecoration: 'none', fontWeight: '600' }}>
                info@tregtoni.com
              </a>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  )
}
