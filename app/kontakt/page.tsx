import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

export default function KontaktPage() {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#1D1D1F',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      <section style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '20px 32px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#86868B', marginBottom: '8px' }}>
            <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
            <span>›</span>
            <span style={{ color: '#1D1D1F', fontWeight: '500' }}>Kontakti</span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.6px' }}>
            Na kontaktoni
          </h1>
        </div>
      </section>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 32px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '20px', letterSpacing: '-0.3px' }}>
              Informacioni
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: '@', title: 'Email', value: 'info@tregtoni.com' },
                { label: '◷', title: 'Orari', value: 'E Hënë – E Premte\n09:00 – 18:00' },
                { label: '◎', title: 'Mbulimi', value: 'Shqipëri, Kosovë\ndhe diaspora shqiptare' },
              ].map(({ label, title, value }) => (
                <div key={title} style={{ display: 'flex', gap: '14px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: '#F5F5F7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '15px', color: '#DA291C', flexShrink: 0, fontWeight: '700',
                  }}>
                    {label}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#86868B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                      {title}
                    </div>
                    <div style={{ fontSize: '14px', color: '#1D1D1F', whiteSpace: 'pre-line', fontWeight: '500' }}>
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '18px', letterSpacing: '-0.3px' }}>
              Pyetje të shpeshta
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { q: 'Si publikoj një njoftim?', a: 'Kliko "+ Shto njoftim" dhe plotëso formularin.' },
                { q: 'A është falas?', a: 'Po, plotësisht falas për të gjithë.' },
                { q: 'Si fshij njoftimin tim?', a: 'Nga profili yt, kliko "Fshi" pranë njoftimit.' },
              ].map(({ q, a }) => (
                <div key={q}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1D1D1F', marginBottom: '3px' }}>{q}</div>
                  <div style={{ fontSize: '13px', color: '#6E6E73', lineHeight: '1.5' }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 1px 10px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
            Dërgo mesazh
          </h2>
          <form action={`mailto:info@tregtoni.com`} method="GET" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Emri juaj *
              </label>
              <input name="name" type="text" placeholder="p.sh. Artan Berisha" required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email adresa *
              </label>
              <input name="email" type="email" placeholder="emri@shembull.com" required style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tema *
              </label>
              <select required style={inputStyle}>
                <option value="">Zgjidh temën</option>
                <option>Pyetje të përgjithshme</option>
                <option>Problem teknik</option>
                <option>Raportim njoftimi</option>
                <option>Partneritet</option>
                <option>Tjetër</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Mesazhi *
              </label>
              <textarea
                name="body"
                placeholder="Shkruani mesazhin tuaj këtu..."
                rows={5}
                required
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <button type="submit" style={{
              background: '#DA291C', color: '#fff', border: 'none',
              padding: '13px', borderRadius: '12px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Dërgo mesazhin
            </button>
          </form>
        </div>

      </div>

      <Footer />
    </main>
  )
}
