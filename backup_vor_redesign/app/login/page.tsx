'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function Login() {
  const [state, formAction, pending] = useActionState(login, { error: '' })

  return (
    <main style={{minHeight:'100vh',background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:'12px',padding:'40px',width:'100%',maxWidth:'420px',border:'1px solid #eee'}}>
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <a href="/" style={{fontSize:'28px',fontWeight:'700',color:'#111',textDecoration:'none'}}>Tregtoni</a>
          <p style={{color:'#666',fontSize:'14px',marginTop:'8px'}}>Hyr në llogarinë tënde</p>
        </div>

        {state.error && (
          <div style={{background:'#fff0f0',border:'1px solid #ffcccc',borderRadius:'8px',padding:'12px 14px',marginBottom:'16px',fontSize:'13px',color:'#c0392b'}}>
            {state.error}
          </div>
        )}

        <form action={formAction}>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#111',marginBottom:'6px'}}>Email</label>
            <input name="email" type="email" placeholder="email@example.com" required style={{width:'100%',border:'1.5px solid #ddd',borderRadius:'8px',padding:'12px 14px',fontSize:'14px',color:'#111',backgroundColor:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#111',marginBottom:'6px'}}>Fjalëkalimi</label>
            <input name="password" type="password" placeholder="••••••••" required style={{width:'100%',border:'1.5px solid #ddd',borderRadius:'8px',padding:'12px 14px',fontSize:'14px',color:'#111',backgroundColor:'#fff',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <button type="submit" disabled={pending} style={{width:'100%',background: pending ? '#999' : '#E24B4A',color:'#fff',border:'none',padding:'14px',fontSize:'15px',fontWeight:'500',borderRadius:'8px',cursor: pending ? 'not-allowed' : 'pointer'}}>
            {pending ? 'Duke hyrë...' : 'Hyr'}
          </button>
        </form>

        <p style={{textAlign:'center',fontSize:'13px',color:'#666',marginTop:'24px'}}>
          Nuk ke llogari?{' '}
          <a href="/register" style={{color:'#E24B4A',textDecoration:'none',fontWeight:'500'}}>Regjistrohu</a>
        </p>
      </div>
    </main>
  )
}
