'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { register } from '@/app/actions/auth'
import { Suspense } from 'react'
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

function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, { error: '' })
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  if (success === 'confirm') {
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
          textAlign: 'center',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: '#F5F5F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '26px',
          }}>
            ✉
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1D1D1F', marginBottom: '10px', letterSpacing: '-0.4px' }}>
            Konfirmo emailin
          </h2>
          <p style={{ color: '#6E6E73', fontSize: '15px', marginBottom: '28px', lineHeight: '1.6' }}>
            Kemi dërguar një link konfirmimi në emailin tënd. Kontrolloje dhe kliko linkun.
          </p>
          <a href="/login" style={{ color: '#DA291C', fontSize: '15px', fontWeight: '600', textDecoration: 'none' }}>
            ← Kthehu te hyrja
          </a>
        </div>
      </main>
    )
  }

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
            Krijo llogarinë tënde falas
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
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1D1F', marginBottom: '8px' }}>
              Emri i plotë
            </label>
            <input name="fullName" type="text" placeholder="Emri Mbiemri" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1D1F', marginBottom: '8px' }}>
              Email
            </label>
            <input name="email" type="email" placeholder="email@example.com" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1D1F', marginBottom: '8px' }}>
              Fjalëkalimi
            </label>
            <PasswordInput name="password" placeholder="••••••••" required minLength={6} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1D1F', marginBottom: '8px' }}>
              Konfirmo fjalëkalimin
            </label>
            <PasswordInput name="confirmPassword" placeholder="••••••••" required style={inputStyle} />
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
            {pending ? 'Duke u regjistruar...' : 'Regjistrohu'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#6E6E73', marginTop: '24px' }}>
          Ke tashmë llogari?{' '}
          <a href="/login" style={{ color: '#DA291C', textDecoration: 'none', fontWeight: '600' }}>
            Hyr
          </a>
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
