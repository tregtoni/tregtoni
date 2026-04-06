import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

export default function KushtetPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      <section style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '20px 32px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#86868B', marginBottom: '8px' }}>
            <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
            <span>›</span>
            <span style={{ color: '#1D1D1F', fontWeight: '500' }}>Kushtet</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.6px' }}>
            Kushtet e përdorimit
          </h1>
          <p style={{ fontSize: '13px', color: '#86868B', marginTop: '6px', marginBottom: 0, fontWeight: '500' }}>
            Versioni i fundit: Janar 2025
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 32px 64px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}>
          {[
            {
              title: '1. Pranimi i kushteve',
              text: 'Duke përdorur platformën Tregtoni, pranoni plotësisht këto kushte përdorimi. Nëse nuk jeni dakord me ndonjë pjesë të tyre, ju lutemi mos e përdorni platformën. Tregtoni rezervon të drejtën të ndryshojë këto kushte në çdo kohë, duke njoftuar përdoruesit nëpërmjet platformës.',
            },
            {
              title: '2. Shërbimi',
              text: 'Tregtoni është platformë falas e njoftimeve që mundëson shitjen dhe blerjen e mallrave e shërbimeve mes individëve dhe bizneseve. Nuk jemi palë në asnjë transaksion mes shitësit dhe blerësit dhe nuk mbajmë përgjegjësi për produktet ose shërbimet e reklamuara.',
            },
            {
              title: '3. Regjistrimi dhe llogaria',
              text: 'Disa funksionalitete kërkojnë regjistrim me email. Jeni përgjegjës për ruajtjen e fshehtësisë së fjalëkalimit tuaj dhe për të gjitha aktivitetet që ndodhin nën llogarinë tuaj. Njoftojeni menjëherë Tregtoni nëse dyshoni në përdorim të paautorizuar.',
            },
            {
              title: '4. Rregullat e njoftimeve',
              text: 'Duke publikuar njoftime pranoni se: (a) keni të drejtën të shisni artikujt e listuar, (b) informacioni i dhënë është i saktë dhe jo mashtrues, (c) njoftimet nuk përmbajnë mallra të paligjshme, të ndaluara ose të rrezikshme, (d) nuk do të postoni njoftimin e njëjtë disa herë.',
            },
            {
              title: '5. Ndalimet',
              text: 'Është e ndaluar të publikoni: mallra të vjedhura ose të falsifikuara, armë e municion, substanca të kontrolluara, produkte për të miturit, shërbime seksuale, njoftimet mashtruese ose spam. Tregtoni ka të drejtën të heqë çdo njoftim dhe të mbyllë çdo llogari që shkel këto rregulla.',
            },
            {
              title: '6. Kufizimi i përgjegjësisë',
              text: 'Tregtoni ofron platformën "siç është" pa garanci të çfarëdolloji. Nuk garantojmë disponueshmërinë e pandërprerë të shërbimit dhe nuk jemi përgjegjës për humbje ose dëme që rrjedhin nga përdorimi i platformës ose nga transaksionet mes përdoruesve.',
            },
            {
              title: '7. Ligji i zbatueshëm',
              text: 'Këto kushte rregullohen nga legjislacioni i Republikës së Shqipërisë. Çdo mosmarrëveshje do të zgjidhet nga gjykatat kompetente shqiptare.',
            },
          ].map(({ title, text }) => (
            <div key={title}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1D1D1F',
                marginBottom: '10px',
                letterSpacing: '-0.2px',
                paddingLeft: '14px',
                borderLeft: '2px solid #DA291C',
              }}>
                {title}
              </h2>
              <p style={{ fontSize: '15px', color: '#3D3D3F', lineHeight: '1.75', margin: 0 }}>{text}</p>
            </div>
          ))}

          <div style={{
            background: '#F5F5F7',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
            color: '#6E6E73',
          }}>
            Për pyetje rreth kushteve të përdorimit, na kontaktoni në{' '}
            <a href="mailto:info@tregtoni.com" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '600' }}>
              info@tregtoni.com
            </a>.
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
