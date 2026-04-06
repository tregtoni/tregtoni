import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'

export default function KontaktPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />

      <section style={{ background: '#fff', borderBottom: '3px solid #E24B4A', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Kryefaqja</a>
          <span style={{ color: '#ccc' }}>→</span>
          <span style={{ color: '#111' }}>Kontakti</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginTop: '6px', marginBottom: 0 }}>Na kontaktoni</h1>
      </section>

      <div style={{ maxWidth: '760px', margin: '32px auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '16px' }}>Informacioni</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '📧', label: 'Email', value: 'info@tregtoni.com' },
                { icon: '⏰', label: 'Orari', value: 'E Hënë – E Premte\n09:00 – 18:00' },
                { icon: '🌍', label: 'Mbulimi', value: 'Shqipëri, Kosovë\ndhe diaspora shqiptare' },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '14px', color: '#111', whiteSpace: 'pre-line' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '14px' }}>Pyetje të shpeshta</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { q: 'Si publikoj një njoftim?', a: 'Kliko "+ Shto njoftim" dhe plotëso formularin.' },
                { q: 'A është falas?', a: 'Po, plotësisht falas për të gjithë.' },
                { q: 'Si fshij njoftimin tim?', a: 'Nga profili yt, kliko "Fshi" pranë njoftimit.' },
              ].map(({ q, a }) => (
                <div key={q}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '3px' }}>{q}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '20px' }}>Dërgo mesazh</h2>
          <form action={`mailto:info@tregtoni.com`} method="GET" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Emri juaj *</label>
              <input
                name="name"
                type="text"
                placeholder="p.sh. Artan Berisha"
                required
                style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Email adresa *</label>
              <input
                name="email"
                type="email"
                placeholder="emri@shembull.com"
                required
                style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Tema *</label>
              <select
                required
                style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="">Zgjidh temën</option>
                <option>Pyetje të përgjithshme</option>
                <option>Problem teknik</option>
                <option>Raportim njoftimi</option>
                <option>Partneritet</option>
                <option>Tjetër</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Mesazhi *</label>
              <textarea
                name="body"
                placeholder="Shkruani mesazhin tuaj këtu..."
                rows={5}
                required
                style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>
            <button
              type="submit"
              style={{ background: '#E24B4A', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Dërgo mesazhin
            </button>
          </form>
        </div>

      </div>

      <Footer />
    </main>
  )
}
