import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
const RED  = '#E24B4A'

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: '20px',
  padding: '36px 40px',
  marginBottom: '16px',
  boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
  border: '1px solid rgba(0,0,0,0.05)',
}

const h2: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#111111',
  margin: '0 0 16px',
  letterSpacing: '-0.3px',
  paddingLeft: '16px',
  borderLeft: `4px solid ${RED}`,
  lineHeight: '1.3',
}

const p: React.CSSProperties = {
  fontSize: '15px',
  color: '#3D3D3F',
  lineHeight: '1.8',
  margin: '0 0 12px',
}

const pLast: React.CSSProperties = { ...p, margin: 0 }

const li: React.CSSProperties = {
  fontSize: '15px',
  color: '#3D3D3F',
  lineHeight: '1.8',
  marginBottom: '6px',
}

const label: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: '700',
  color: RED,
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  display: 'inline-block',
  marginBottom: '6px',
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
          <span style={label}>1</span>
          <h2 style={h2}>Hyrje</h2>
          <p style={p}>
            Tregtoni.com është një platformë shqiptare e njoftimeve të klasifikuara, e krijuar për të lehtësuar
            shitblerjen dhe shkëmbimin e mallrave dhe shërbimeve ndërmjet përdoruesve në Shqipëri dhe Kosovë.
          </p>
          <p style={p}>
            Kjo Politikë Privatësie shpjegon se çfarë të dhënash personale mbledhim, si i përdorim, me kë i
            ndajmë dhe cilat janë të drejtat tuaja. Baza kryesore ligjore është{' '}
            <strong>Ligji Nr. 9887 "Për mbrojtjen e të dhënave personale"</strong> (i ndryshuar me Ligjin
            Nr. 48/2012) dhe aktet nënligjore të{' '}
            <strong>Komisionerit për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave (KDIM)</strong>.
          </p>
          <p style={pLast}>
            Për përdoruesit e vendosur në Bashkimin Evropian — në veçanti diasporën shqiptare në Gjermani,
            Austri dhe Zvicër — respektojmë gjithashtu parimet e{' '}
            <strong>Rregullores së Përgjithshme të Mbrojtjes së të Dhënave (GDPR/DSGVO)</strong> si kornizë
            plotësuese. Duke përdorur Tregtoni.com, pranoni kushtet e kësaj politike.
          </p>
        </div>

        {/* 2. Të dhënat që mbledhim */}
        <div style={card}>
          <span style={label}>2</span>
          <h2 style={h2}>Të dhënat që mbledhim</h2>
          <p style={p}><strong>Gjatë regjistrimit:</strong></p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 14px' }}>
            <li style={li}>Emri i plotë dhe adresa e emailit</li>
            <li style={li}>Fjalëkalimi (i ruajtur i enkriptuar)</li>
            <li style={li}>Lloji i llogarisë (privat ose biznes) dhe emri i firmës nëse aplikohet</li>
          </ul>
          <p style={p}><strong>Gjatë publikimit të njoftimeve:</strong></p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 14px' }}>
            <li style={li}>Titulli, përshkrimi, çmimi, qyteti dhe kategoria e njoftimit</li>
            <li style={li}>Fotografitë e ngarkuara nga ju</li>
            <li style={li}>Të dhëna shtesë sipas kategorisë (p.sh. kilometrazhi, viti i prodhimit)</li>
          </ul>
          <p style={p}><strong>Gjatë përdorimit të platformës:</strong></p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 14px' }}>
            <li style={li}>Mesazhet e dërguara ndërmjet përdoruesve</li>
            <li style={li}>Numri i telefonit, qyteti dhe bio (nëse vendosni t'i shtoni)</li>
            <li style={li}>Foto profili</li>
          </ul>
          <p style={p}><strong>Të dhëna teknike:</strong></p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={li}>Adresa IP dhe lloji i shfletuesit</li>
            <li style={li}>Data dhe ora e hyrjes në platformë</li>
            <li style={li}>Cookies dhe të dhëna të sesionit (shih seksionin 8)</li>
          </ul>
        </div>

        {/* 3. Si i përdorim të dhënat */}
        <div style={card}>
          <span style={label}>3</span>
          <h2 style={h2}>Si i përdorim të dhënat</h2>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={li}>Për të ofruar dhe mirëmbajtur shërbimet e platformës</li>
            <li style={li}>Për t'ju lejuar të publikoni, ndryshoni dhe menaxhoni njoftimet tuaja</li>
            <li style={li}>Për të mundësuar komunikimin ndërmjet blerësve dhe shitësve</li>
            <li style={li}>Për të verifikuar identitetin dhe parandaluar mashtrimet</li>
            <li style={li}>Për të dërguar njoftime rreth llogarisë suaj (p.sh. mesazhe të reja)</li>
            <li style={li}>Për të analizuar dhe përmirësuar funksionimin e platformës</li>
            <li style={li}>Për të zbatuar Kushtet e Përdorimit dhe politikat e Tregtoni.com</li>
          </ul>
        </div>

        {/* 4. Baza ligjore */}
        <div style={card}>
          <span style={label}>4</span>
          <h2 style={h2}>Baza ligjore e përpunimit</h2>
          <p style={p}>
            Baza kryesore e përpunimit mbështetet në <strong>Ligjin Nr. 9887</strong> (i ndryshuar me
            Ligjin Nr. 48/2012). Për përdoruesit e vendosur në BE, zbatojmë njëkohësisht edhe bazat e
            nenit 6 të <strong>GDPR</strong> si kornizë plotësuese:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 16px' }}>
            <li style={li}><strong>Kontrata (neni 6§1/b GDPR · neni 6 Ligji 9887):</strong> Përpunimi i nevojshëm për ofrimin e shërbimeve të platformës (publikim njoftimesh, mesazhe, llogari).</li>
            <li style={li}><strong>Pëlqimi (neni 6§1/a GDPR · neni 5 Ligji 9887):</strong> Për cookies opsionale dhe komunikime marketingu — mund ta tërhiqni në çdo kohë.</li>
            <li style={li}><strong>Interesi legjitim (neni 6§1/f GDPR · neni 6 Ligji 9887):</strong> Siguria e platformës, parandalimi i abuzimeve dhe përmirësimi i shërbimeve.</li>
            <li style={li}><strong>Detyrimi ligjor (neni 6§1/c GDPR · neni 6 Ligji 9887):</strong> Kur kemi detyrim ligjor sipas legjislacionit shqiptar ose evropian në fuqi.</li>
          </ul>
          <div style={{
            background: '#F5F5F7', borderRadius: '10px', padding: '14px 18px',
            fontSize: '13px', color: '#6E6E73', lineHeight: '1.6',
          }}>
            Ligji shqiptar Nr. 9887 është ligji bazë për të gjithë përdoruesit. GDPR/DSGVO zbatohet si
            shtesë për përdoruesit rezidentë në vendet e BE-së (Gjermani, Austri, Zvicër etj.).
          </div>
        </div>

        {/* 5. Ruajtja */}
        <div style={card}>
          <span style={label}>5</span>
          <h2 style={h2}>Ruajtja e të dhënave</h2>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={li}><strong>Llogaria juaj:</strong> Ruhet deri sa ta fshini vetë ose të kërkoni fshirjen.</li>
            <li style={li}><strong>Njoftimet:</strong> Ruhen gjatë gjithë periudhës aktive dhe deri në 6 muaj pas fshirjes për qëllime sigurie.</li>
            <li style={li}><strong>Mesazhet:</strong> Ruhen për aq kohë sa llogaria është aktive.</li>
            <li style={li}><strong>Të dhënat teknike (logjet):</strong> Fshihen pas 90 ditësh.</li>
            <li style={li}><strong>Cookies:</strong> Sipas afateve të specifikuara në <a href="/cookies" style={{ color: RED, textDecoration: 'none', fontWeight: '500' }}>Politikën e Cookies</a>.</li>
          </ul>
        </div>

        {/* 6. Ndarja */}
        <div style={card}>
          <span style={label}>6</span>
          <h2 style={h2}>Ndarja e të dhënave</h2>
          <p style={p}>
            Tregtoni.com <strong>nuk shet</strong> dhe <strong>nuk jep me qira</strong> të dhënat tuaja personale
            palëve të treta. Të dhënat mund të ndahen vetëm në rastet e mëposhtme:
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={li}><strong>Supabase (supabase.com):</strong> Ofruesi ynë i infrastrukturës dhe bazës së të dhënave. Të dhënat ruhen në serverë të sigurt dhe Supabase vepron si përpunues i të dhënave sipas udhëzimeve tona.</li>
            <li style={li}><strong>Autoritetet kompetente:</strong> Kur kemi detyrim ligjor ose urdhër gjyqësor sipas legjislacionit shqiptar.</li>
            <li style={li}><strong>Mes përdoruesve:</strong> Informacioni i profilit publik (emri, qyteti, telefoni nëse e keni aktivizuar) është i dukshëm për përdoruesit e tjerë sipas cilësimeve tuaja të privatësisë.</li>
          </ul>
        </div>

        {/* 7. Të drejtat */}
        <div style={card}>
          <span style={label}>7</span>
          <h2 style={h2}>Të drejtat tuaja</h2>
          <p style={p}>
            Sipas Ligjit Nr. 9887 "Për mbrojtjen e të dhënave personale", keni të drejtat e mëposhtme:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 16px' }}>
            <li style={li}><strong>E drejta e aksesit:</strong> Të kërkoni një kopje të të dhënave tuaja personale.</li>
            <li style={li}><strong>E drejta e korrigjimit:</strong> Të korrigjoni të dhëna të pasakta ose të pakompletuara.</li>
            <li style={li}><strong>E drejta e fshirjes:</strong> Të kërkoni fshirjen e të dhënave tuaja kur nuk janë më të nevojshme.</li>
            <li style={li}><strong>E drejta e kufizimit:</strong> Të kufizoni mënyrën se si i përdorim të dhënat tuaja.</li>
            <li style={li}><strong>E drejta e kundërshtimit:</strong> Të kundërshtoni përpunimin e bazuar në interes legjitim.</li>
            <li style={li}><strong>E drejta e tërheqjes së pëlqimit:</strong> Të tërhiqni pëlqimin tuaj në çdo kohë pa ndikuar në ligjshmërinë e përpunimit të mëparshëm.</li>
          </ul>
          <div style={{
            background: '#FFF5F5', border: `1px solid rgba(226,75,74,0.2)`,
            borderRadius: '12px', padding: '16px 20px',
          }}>
            <p style={{ ...pLast, fontSize: '14px' }}>
              Për të ushtruar të drejtat tuaja ose për çdo ankesë, mund të na kontaktoni në{' '}
              <a href="mailto:info@tregtoni.com" style={{ color: RED, fontWeight: '600', textDecoration: 'none' }}>info@tregtoni.com</a>.
              Keni gjithashtu të drejtë të paraqisni ankesë pranë{' '}
              <strong>Komisionerit për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave (KDIM)</strong>,
              Rr. "Abdi Toptani", Tiranë, <a href="https://www.idp.al" target="_blank" rel="noopener noreferrer" style={{ color: RED, textDecoration: 'none', fontWeight: '500' }}>www.idp.al</a>.
            </p>
          </div>
        </div>

        {/* 8. Cookies */}
        <div style={card}>
          <span style={label}>8</span>
          <h2 style={h2}>Cookies</h2>
          <p style={pLast}>
            Tregtoni.com përdor cookies për të siguruar funksionimin e platformës dhe për të mbajtur mend
            preferencat tuaja. Për informacion të detajuar mbi llojet e cookies dhe mënyrën e menaxhimit të tyre,
            vizitoni{' '}
            <a href="/cookies" style={{ color: RED, fontWeight: '600', textDecoration: 'none' }}>
              Politikën tonë të Cookies
            </a>.
          </p>
        </div>

        {/* 9. Siguria */}
        <div style={card}>
          <span style={label}>9</span>
          <h2 style={h2}>Siguria</h2>
          <p style={p}>
            Tregtoni.com zbaton masa teknike dhe organizative për të mbrojtur të dhënat tuaja personale nga
            aksesi i paautorizuar, ndryshimi, zbulimi ose shkatërrimi:
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li style={li}>Enkriptim HTTPS për të gjithë trafikun e platformës</li>
            <li style={li}>Fjalëkalimet ruhen të hashuara me algoritme të sigurta (bcrypt)</li>
            <li style={li}>Kontrolle të aksesit bazuar në role (RLS) në bazën e të dhënave</li>
            <li style={li}>Autentifikim i sigurt përmes Supabase Auth</li>
            <li style={li}>Monitorim i vazhdueshëm për aktivitete të dyshimta</li>
          </ul>
        </div>

        {/* 10. Ndryshimet */}
        <div style={card}>
          <span style={label}>10</span>
          <h2 style={h2}>Ndryshimet e kësaj politike</h2>
          <p style={pLast}>
            Tregtoni.com rezervon të drejtën të ndryshojë këtë Politikë Privatësie në çdo kohë.
            Ndryshimet e rëndësishme do t'ju njoftohen me email ose me njoftim në platformë.
            Vazhdimi i përdorimit të platformës pas ndryshimeve përbën pranimin e politikës së re.
            Data e versionit të fundit është e shënuar në krye të kësaj faqeje.
          </p>
        </div>

        {/* 11. Kontakti */}
        <div style={card}>
          <span style={label}>11</span>
          <h2 style={h2}>Kontakti</h2>
          <p style={{ ...p, marginBottom: '16px' }}>
            Për çdo pyetje, kërkesë ose ankesë në lidhje me mbrojtjen e të dhënave tuaja personale:
          </p>
          <div style={{
            background: '#F5F5F7', borderRadius: '14px', padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div style={{ fontSize: '15px', color: '#111111', fontWeight: '600' }}>Tregtoni.com</div>
            <div style={{ fontSize: '14px', color: '#6E6E73' }}>
              Email:{' '}
              <a href="mailto:info@tregtoni.com" style={{ color: RED, textDecoration: 'none', fontWeight: '600' }}>
                info@tregtoni.com
              </a>
            </div>
            <div style={{ fontSize: '14px', color: '#6E6E73' }}>Shqipëri</div>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  )
}
