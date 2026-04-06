'use client'

import { useActionState, useState } from 'react'
import { dergofeedback } from '@/app/actions/feedback'

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid rgba(0,0,0,0.1)',
  borderRadius: '10px',
  padding: '13px 16px',
  fontSize: '14px',
  color: '#1D1D1F',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
}

export default function FeedbackForm() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [state, formAction, pending] = useActionState(dergofeedback, { error: '', success: false })

  if (state.success) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '56px 36px',
        textAlign: 'center',
        boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.05)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: '#F0FFF4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '28px',
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1D1D1F', marginBottom: '12px', letterSpacing: '-0.4px' }}>
          Faleminderit!
        </h2>
        <p style={{ fontSize: '15px', color: '#6E6E73', lineHeight: '1.7', marginBottom: '28px', maxWidth: '320px', margin: '0 auto 28px' }}>
          Feedbacku juaj u dërgua me sukses. Do ta lexojmë me shumë vëmendje dhe do ta përdorim për të përmirësuar Tregtoni.
        </p>
        <a href="/" style={{
          display: 'inline-block',
          background: '#DA291C',
          color: '#fff',
          padding: '13px 32px',
          borderRadius: '14px',
          fontSize: '15px',
          fontWeight: '600',
          textDecoration: 'none',
        }}>
          Kthehu në kryefaqe
        </a>
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.05)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <p style={{ fontSize: '15px', color: '#6E6E73', lineHeight: '1.6', marginBottom: '28px' }}>
        Na ndihmoni ta bëjmë Tregtoni më të mirë. Çdo mendim është i vlefshëm për ne.
      </p>

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

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Vlerësimi juaj
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                style={{
                  background: star <= (hovered || rating) ? '#FFF5F5' : '#F5F5F7',
                  border: star <= (hovered || rating) ? '1.5px solid rgba(218,41,28,0.3)' : '1.5px solid rgba(0,0,0,0.08)',
                  borderRadius: '10px',
                  width: '44px',
                  height: '44px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {star <= (hovered || rating) ? '★' : '☆'}
              </button>
            ))}
          </div>
          <input type="hidden" name="rating" value={rating || ''} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Feedbacku juaj <span style={{ color: '#DA291C' }}>*</span>
          </label>
          <textarea
            name="message"
            placeholder="Çfarë ju pëlqen? Çfarë mund të bëjmë më mirë? Keni ndonjë ide apo problem?"
            rows={5}
            required
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Emri <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: '#86868B' }}>(opsional)</span>
          </label>
          <input name="name" type="text" placeholder="Emri juaj" style={inputStyle} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Email <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0, color: '#86868B' }}>(opsional — nëse dëshironi përgjigje)</span>
          </label>
          <input name="email" type="email" placeholder="emaili@shembull.com" style={inputStyle} />
        </div>

        <button
          type="submit"
          disabled={pending}
          style={{
            background: pending ? '#999' : '#DA291C',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            padding: '15px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: pending ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '-0.1px',
          }}
        >
          {pending ? 'Duke dërguar...' : 'Dërgo feedbackun'}
        </button>
      </form>
    </div>
  )
}
