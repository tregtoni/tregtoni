'use client'

import { useActionState } from 'react'
import { ndryshoFjalekalimin } from '@/app/actions/profil'

export default function NdryshoFjalekalimin() {
  const [state, formAction, pending] = useActionState(ndryshoFjalekalimin, { error: '', success: false })

  return (
    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #E24B4A', paddingLeft: '10px', marginBottom: '20px' }}>
        Ndrysho fjalëkalimin
      </h2>

      {state.success && (
        <div style={{ background: '#f0fff4', border: '1px solid #b7ebc8', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#1a7340' }}>
          Fjalëkalimi u ndryshua me sukses.
        </div>
      )}
      {state.error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#c0392b' }}>
          {state.error}
        </div>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Fjalëkalimi i ri *</label>
          <input
            name="fjalekalimi"
            type="password"
            placeholder="Minimum 6 karaktere"
            required
            minLength={6}
            style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Konfirmo fjalëkalimin *</label>
          <input
            name="konfirmo"
            type="password"
            placeholder="Përsërit fjalëkalimin"
            required
            style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          style={{ background: pending ? '#999' : '#111', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: pending ? 'not-allowed' : 'pointer' }}
        >
          {pending ? 'Duke ndryshuar...' : 'Ndrysho fjalëkalimin'}
        </button>
      </form>
    </div>
  )
}
