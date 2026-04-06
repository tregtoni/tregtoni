import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

export default function KushtetPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />

      <section style={{ background: '#fff', borderBottom: '3px solid #E24B4A', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Kryefaqja</a>
          <span style={{ color: '#ccc' }}>→</span>
          <span style={{ color: '#111' }}>Kushtet e përdorimit</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginTop: '6px', marginBottom: 0 }}>Kushtet e përdorimit</h1>
        <p style={{ fontSize: '13px', color: '#999', marginTop: '4px', marginBottom: 0 }}>Versioni i fundit: Janar 2025</p>
      </section>

      <div style={{ maxWidth: '760px', margin: '32px auto', padding: '0 24px 48px' }}>
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

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
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '10px' }}>{title}</h2>
              <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.7', margin: 0 }}>{text}</p>
            </div>
          ))}

          <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '16px', fontSize: '13px', color: '#666' }}>
            Për pyetje rreth kushteve të përdorimit, na kontaktoni në{' '}
            <a href="mailto:info@tregtoni.com" style={{ color: '#E24B4A', textDecoration: 'none' }}>info@tregtoni.com</a>.
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
