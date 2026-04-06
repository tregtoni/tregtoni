import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

export default function PrivatesiaPage() {
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
            <span style={{ color: '#1D1D1F', fontWeight: '500' }}>Privatësia</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.6px' }}>
            Politika e privatësisë
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

          <p style={{ fontSize: '15px', color: '#3D3D3F', lineHeight: '1.75', margin: 0 }}>
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
              <h2 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#1D1D1F',
                marginBottom: '12px',
                letterSpacing: '-0.2px',
                paddingLeft: '14px',
                borderLeft: '2px solid #DA291C',
              }}>
                {title}
              </h2>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map(item => (
                  <li key={item} style={{ fontSize: '15px', color: '#3D3D3F', lineHeight: '1.7' }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{
            background: '#F5F5F7',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
            color: '#6E6E73',
          }}>
            Për pyetje rreth privatësisë tuaj, na kontaktoni në{' '}
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
