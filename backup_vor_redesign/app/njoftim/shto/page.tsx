import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import ShtoForm from './ShtoForm'

export default function ShtoNjoftim() {
  return (
    <main>
      <NavBar />

      <section style={{background:'#fff',borderBottom:'3px solid #E24B4A',padding:'16px 24px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <a href="/" style={{color:'#999',fontSize:'13px',textDecoration:'none'}}>Kryefaqja</a>
          <span style={{color:'#999'}}>→</span>
          <span style={{fontSize:'13px',color:'#111'}}>Shto njoftim</span>
        </div>
        <h1 style={{fontSize:'24px',fontWeight:'600',color:'#111',marginTop:'8px'}}>Shto njoftim falas</h1>
      </section>

      <ShtoForm />

      <Footer />
    </main>
  )
}
