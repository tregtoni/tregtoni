'use client'

import { useActionState, useState } from 'react'
import { dergofeedback } from '@/app/actions/feedback'

export default function FeedbackForm() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [state, formAction, pending] = useActionState(dergofeedback, { error: '', success: false })

  if (state.success) {
    return (
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '10px' }}>Faleminderit!</h2>
        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', marginBottom: '24px' }}>
          Feedbacku juaj u dërgua me sukses. Do ta lexojmë me shumë vëmendje dhe do ta përdorim për të përmirësuar Tregtoni.
        </p>
        <a href="/" style={{ display: 'inline-block', background: '#E24B4A', color: '#fff', padding: '12px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
          Kthehu në kryefaqe
        </a>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '32px' }}>
      <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>
        Na ndihmoni ta bëjmë Tregtoni më të mirë. Çdo mendim është i vlefshëm për ne.
      </p>

      {state.error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: '#c0392b' }}>
          {state.error}
        </div>
      )}

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '10px' }}>Vlerësimi juaj</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                  fontSize: '32px', lineHeight: 1,
                  filter: star <= (hovered || rating) ? 'none' : 'grayscale(1) opacity(0.3)',
                  transform: star <= (hovered || rating) ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.1s, filter 0.1s',
                }}
              >⭐</button>
            ))}
          </div>
          <input type="hidden" name="rating" value={rating || ''} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>
            Feedbacku juaj <span style={{ color: '#E24B4A' }}>*</span>
          </label>
          <textarea
            name="message"
            placeholder="Çfarë ju pëlqen? Çfarë mund të bëjmë më mirë? Keni ndonjë ide apo problem?"
            rows={5}
            required
            style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>
            Emri <span style={{ fontSize: '11px', color: '#999', fontWeight: '400' }}>(opsional)</span>
          </label>
          <input
            name="name"
            type="text"
            placeholder="Emri juaj"
            style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>
            Email <span style={{ fontSize: '11px', color: '#999', fontWeight: '400' }}>(opsional — nëse dëshironi përgjigje)</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="emaili@shembull.com"
            style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          style={{
            background: pending ? '#999' : '#E24B4A', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '600',
            cursor: pending ? 'not-allowed' : 'pointer',
          }}
        >
          {pending ? 'Duke dërguar...' : 'Dërgo feedbackun'}
        </button>
      </form>
    </div>
  )
}
