'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { register } from '@/app/actions/auth'
import { Suspense } from 'react'

function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, { error: '' })
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  if (success === 'confirm') {
    return (
      <main style={{minHeight:'100vh',background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:'#fff',borderRadius:'12px',padding:'40px',width:'100%',maxWidth:'420px',border:'1px solid #eee',textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'16px'}}>📧</div>
          <h2 style={{fontSize:'20px',fontWeight:'600',color:'#111',marginBottom:'8px'}}>Konfirmo emailin</h2>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'24px'}}>Kemi dërguar një link konfirmimi në emailin tënd. Kontrolloje dhe kliko linkun.</p>
          <a href="/login" style={{color:'#E24B4A',fontSize:'14px',fontWeight:'500',textDecoration:'none'}}>← Kthehu te hyrja</a>
        </div>
      </main>
    )
  }

  return (
    <main style={{minHeight:'100vh',background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:'12px',padding:'40px',width:'100%',maxWidth:'420px',border:'1px solid #eee'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <a href="/" style={{fontSize:'28px',fontWeight:'700',color:'#111',textDecoration:'none'}}>Tregtoni</a>
          <p style={{color:'#666',fontSize:'14px',marginTop:'8px'}}>Krijo llogarinë tënde falas</p>
        </div>

        {state.error && (
          <div style={{background:'#fff0f0',border:'1px solid #ffcccc',borderRadius:'8px',padding:'12px 14px',marginBottom:'16px',fontSize:'13px',color:'#c0392b'}}>
            {state.error}
          </div>
        )}

        <form action={formAction}>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#111',marginBottom:'6px'}}>Emri i plotë</label>
            <input name="fullName" type="text" placeholder="Emri Mbiemri" required style={{width:'100%',border:'1.5px solid #ddd',borderRadius:'8px',padding:'12px 14px',fontSize:'14px',color:'#111',backgroundColor:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#111',marginBottom:'6px'}}>Email</label>
            <input name="email" type="email" placeholder="email@example.com" required style={{width:'100%',border:'1.5px solid #ddd',borderRadius:'8px',padding:'12px 14px',fontSize:'14px',color:'#111',backgroundColor:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#111',marginBottom:'6px'}}>Fjalëkalimi</label>
            <input name="password" type="password" placeholder="••••••••" required minLength={6} style={{width:'100%',border:'1.5px solid #ddd',borderRadius:'8px',padding:'12px 14px',fontSize:'14px',color:'#111',backgroundColor:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#111',marginBottom:'6px'}}>Konfirmo fjalëkalimin</label>
            <input name="confirmPassword" type="password" placeholder="••••••••" required style={{width:'100%',border:'1.5px solid #ddd',borderRadius:'8px',padding:'12px 14px',fontSize:'14px',color:'#111',backgroundColor:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <button type="submit" disabled={pending} style={{width:'100%',background: pending ? '#999' : '#E24B4A',color:'#fff',border:'none',padding:'14px',fontSize:'15px',fontWeight:'500',borderRadius:'8px',cursor: pending ? 'not-allowed' : 'pointer'}}>
            {pending ? 'Duke u regjistruar...' : 'Regjistrohu'}
          </button>
        </form>

        <p style={{textAlign:'center',fontSize:'13px',color:'#666',marginTop:'24px'}}>
          Ke tashmë llogari?{' '}
          <a href="/login" style={{color:'#E24B4A',textDecoration:'none',fontWeight:'500'}}>Hyr</a>
        </p>
      </div>
    </main>
  )
}

export default function Register() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
