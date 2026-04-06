'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import PasswordInput from '@/app/components/PasswordInput'

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid rgba(0,0,0,0.12)',
  borderRadius: '10px',
  padding: '13px 16px',
  fontSize: '15px',
  color: '#1D1D1F',
  backgroundColor: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
}

export default function Login() {
  const [state, formAction, pending] = useActionState(login, { error: '' })

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <a href="/" style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#1D1D1F',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
          }}>
            Tregtoni<span style={{ color: '#DA291C' }}>.com</span>
          </a>
          <p style={{ color: '#6E6E73', fontSize: '15px', marginTop: '10px', fontWeight: '400' }}>
            Hyr në llogarinë tënde
          </p>
        </div>

        {state.error && (
          <div style={{
            background: '#FFF5F5',
            border: '1px solid rgba(218,41,28,0.2)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#DA291C',
            fontWeight: '500',
          }}>
            {state.error}
          </div>
        )}

        <form action={formAction}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#1D1D1F',
              marginBottom: '8px',
              letterSpacing: '-0.1px',
            }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#1D1D1F',
              marginBottom: '8px',
              letterSpacing: '-0.1px',
            }}>
              Fjalëkalimi
            </label>
            <PasswordInput name="password" placeholder="••••••••" required style={inputStyle} />
          </div>
          <button
            type="submit"
            disabled={pending}
            style={{
              width: '100%',
              background: pending ? '#999' : '#DA291C',
              color: '#fff',
              border: 'none',
              padding: '15px',
              fontSize: '15px',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: pending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '-0.1px',
            }}
          >
            {pending ? 'Duke hyrë...' : 'Hyr'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6E6E73', marginTop: '24px' }}>
          Nuk ke llogari?{' '}
          <a href="/register" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '600' }}>
            Regjistrohu
          </a>
        </p>
      </div>
    </main>
  )
}
