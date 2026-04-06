'use client'

import { useActionState } from 'react'
import { ndryshoFjalekalimin } from '@/app/actions/profil'
import PasswordInput from '@/app/components/PasswordInput'

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid rgba(0,0,0,0.1)',
  borderRadius: '10px',
  padding: '12px 14px',
  fontSize: '14px',
  color: '#1D1D1F',
  backgroundColor: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
}

export default function NdryshoFjalekalimin() {
  const [state, formAction, pending] = useActionState(ndryshoFjalekalimin, { error: '', success: false })

  return (
    <div style={{
      background: '#fff',
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.05)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <h2 style={{
        fontSize: '17px',
        fontWeight: '700',
        color: '#1D1D1F',
        marginBottom: '24px',
        letterSpacing: '-0.3px',
      }}>
        Ndrysho fjalëkalimin
      </h2>

      {state.success && (
        <div style={{
          background: '#F0FFF4',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#16a34a',
          fontWeight: '500',
        }}>
          Fjalëkalimi u ndryshua me sukses.
        </div>
      )}
      {state.error && (
        <div style={{
          background: '#FFF5F5',
          border: '1px solid rgba(218,41,28,0.2)',
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#DA291C',
          fontWeight: '500',
        }}>
          {state.error}
        </div>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Fjalëkalimi aktual *
          </label>
          <PasswordInput name="fjalekalimi_aktual" placeholder="Shkruani fjalëkalimin tuaj aktual" required style={inputStyle} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Fjalëkalimi i ri *
          </label>
          <PasswordInput name="fjalekalimi" placeholder="Minimum 6 karaktere" required minLength={6} style={inputStyle} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Konfirmo fjalëkalimin *
          </label>
          <PasswordInput name="konfirmo" placeholder="Përsërit fjalëkalimin" required style={inputStyle} />
        </div>

        <button
          type="submit"
          disabled={pending}
          style={{
            background: pending ? '#999' : '#1D1D1F',
            color: '#fff',
            border: 'none',
            padding: '13px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: pending ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {pending ? 'Duke ndryshuar...' : 'Ndrysho fjalëkalimin'}
        </button>
      </form>
    </div>
  )
}
