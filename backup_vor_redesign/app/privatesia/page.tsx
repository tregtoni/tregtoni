import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

export default function PrivatesiaPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />

      <section style={{ background: '#fff', borderBottom: '3px solid #E24B4A', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Kryefaqja</a>
          <span style={{ color: '#ccc' }}>→</span>
          <span style={{ color: '#111' }}>Politika e privatësisë</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginTop: '6px', marginBottom: 0 }}>Politika e privatësisë</h1>
        <p style={{ fontSize: '13px', color: '#999', marginTop: '4px', marginBottom: 0 }}>Versioni i fundit: Janar 2025</p>
      </section>

      <div style={{ maxWidth: '760px', margin: '32px auto', padding: '0 24px 48px' }}>
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.7', margin: 0 }}>
            Tregtoni respekton privatësinë tuaj. Kjo politikë shpjegon se çfarë të dhënash mbledhim, si i përdorim dhe si i mbrojmë.
          </p>

          {[
            {
              title: '1. Të dhënat që mbledhim',
              items: [
                'Të dhëna të regjistrimit: emri dhe adresa juaj e emailit kur krijoni llogari.',
                'Të dhëna të njoftimeve: informacionet që jepni kur publikoni njoftime (titull, përshkrim, çmim, qytet, foto).',
                'Të dhëna të përdorimit: adresa IP, lloji i shfletuesit dhe faqet e vizituara — për të përmirësuar shërbimin.',
                'Mesazhet: komunikimi mes përdoruesve nëpërmjet platformës.',
              ],
            },
            {
              title: '2. Si i përdorim të dhënat',
              items: [
                'Për të ofruar dhe mirëmbajtur shërbimin e Tregtoni.',
                'Për t\'ju dërguar njoftime të rëndësishme rreth llogarisë tuaj.',
                'Për të parandaluar mashtrimet dhe për të ruajtur sigurinë e platformës.',
                'Për të analizuar përdorimin dhe për të përmirësuar funksionalitetet.',
              ],
            },
            {
              title: '3. Ndarja e të dhënave',
              items: [
                'Nuk shesim dhe nuk ndajmë të dhënat tuaja personale me palë të treta për qëllime tregtare.',
                'Të dhënat mund t\'u shpërndahen ofruesve të shërbimeve teknike (p.sh. Supabase për ruajtjen e të dhënave) vetëm për qëllimet e nevojshme operative.',
                'Mund të zbulojmë të dhëna kur kërkohet nga ligji ose nga autoritetet kompetente.',
              ],
            },
            {
              title: '4. Ruajtja dhe siguria',
              items: [
                'Të dhënat ruhen në serverë të sigurt me enkriptim.',
                'Fjalëkalimet ruhen të hashëuara dhe nuk janë të dukshme as për ne.',
                'Të dhënat ruhen për aq kohë sa llogaria juaj është aktive, ose sipas kërkesave ligjore.',
              ],
            },
            {
              title: '5. Të drejtat tuaja',
              items: [
                'Keni të drejtën të aksesoni, korrigjoni ose fshini të dhënat tuaja personale.',
                'Mund të kërkoni eksportimin e të dhënave tuaja.',
                'Mund të mbyllni llogarinë tuaj në çdo kohë nga seksioni i profilit.',
                'Për çdo kërkesë rreth të dhënave, na shkruani në info@tregtoni.com.',
              ],
            },
            {
              title: '6. Cookies',
              items: [
                'Përdorim cookies të nevojshme për funksionimin e platformës (sesioni i autentikimit).',
                'Nuk përdorim cookies të reklamimit ose gjurmimit të palëve të treta.',
              ],
            },
          ].map(({ title, items }) => (
            <div key={title}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '12px' }}>{title}</h2>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map(item => (
                  <li key={item} style={{ fontSize: '14px', color: '#444', lineHeight: '1.6' }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '16px', fontSize: '13px', color: '#666' }}>
            Për pyetje rreth privatësisë tuaj, na kontaktoni në{' '}
            <a href="mailto:info@tregtoni.com" style={{ color: '#E24B4A', textDecoration: 'none' }}>info@tregtoni.com</a>.
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
