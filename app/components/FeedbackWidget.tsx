'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import { dergofeedback } from '@/app/actions/feedback'

export default function FeedbackWidget() {
  const [open, setOpen]     = useState(false)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [state, formAction, pending] = useActionState(dergofeedback, { error: '', success: false })

  // Drag state — start bottom-right
  const [pos, setPos]       = useState({ x: 24, y: 24 }) // distance from bottom-right
  const dragging            = useRef(false)
  const didDrag             = useRef(false)
  const dragStart           = useRef({ px: 0, py: 0, x: 0, y: 0 })
  const btnRef              = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current) return
      const dx = e.clientX - dragStart.current.px
      const dy = e.clientY - dragStart.current.py
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true

      const btn = btnRef.current
      const bw = btn?.offsetWidth  ?? 120
      const bh = btn?.offsetHeight ?? 40

      // pos is distance from bottom-right corner
      const newX = Math.max(8, Math.min(window.innerWidth  - bw - 8,  dragStart.current.x - dx))
      const newY = Math.max(8, Math.min(window.innerHeight - bh - 8,  dragStart.current.y - dy))
      setPos({ x: newX, y: newY })
    }

    function onUp() {
      dragging.current = false
      document.body.style.userSelect = ''
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }
  }, [])

  function handlePointerDown(e: React.PointerEvent) {
    dragging.current  = true
    didDrag.current   = false
    dragStart.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y }
    document.body.style.userSelect = 'none'
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handleClick() {
    if (didDrag.current) return // suppress click after drag
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setRating(0)
    setHovered(0)
  }

  return (
    <>
      {/* Draggable trigger button */}
      <button
        ref={btnRef}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        title="Tërhiq për ta lëvizur"
        style={{
          position: 'fixed',
          bottom: `${pos.y}px`,
          right: `${pos.x}px`,
          zIndex: 900,
          background: '#111', color: '#fff', border: 'none',
          borderRadius: '24px', padding: '11px 18px',
          fontSize: '13px', fontWeight: '600',
          cursor: dragging.current ? 'grabbing' : 'grab',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', gap: '6px',
          touchAction: 'none', // required for pointer capture on mobile
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#DA291C')}
        onMouseLeave={e => (e.currentTarget.style.background = '#111')}
      >
        💡 Jep feedback
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Modal */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '440px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ background: '#DA291C', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>💡 Jep feedback</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>Na ndihmoni ta përmirësojmë Tregtoni</div>
              </div>
              <button
                onClick={handleClose}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0 }}
              >×</button>
            </div>

            {state.success ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '14px' }}>🎉</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>Faleminderit!</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
                  Feedbacku juaj u dërgua me sukses. Do ta lexojmë me shumë vëmendje.
                </p>
                <button
                  onClick={handleClose}
                  style={{ background: '#DA291C', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Mbyll
                </button>
              </div>
            ) : (
              <form action={formAction} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {state.error && (
                  <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#c0392b' }}>
                    {state.error}
                  </div>
                )}

                {/* Star rating */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '8px' }}>Vlerësimi</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                          fontSize: '28px', lineHeight: 1,
                          color: star <= (hovered || rating) ? '#FFD700' : '#D1D1D6',
                          transform: star <= (hovered || rating) ? 'scale(1.15)' : 'scale(1)',
                          transition: 'transform 0.1s, color 0.1s',
                        }}
                      >★</button>
                    ))}
                  </div>
                  <input type="hidden" name="rating" value={rating || ''} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>
                    Feedbacku juaj <span style={{ color: '#DA291C' }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Çfarë ju pëlqen? Çfarë mund të bëjmë më mirë?"
                    rows={4}
                    required
                    style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
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
                    style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>
                    Email <span style={{ fontSize: '11px', color: '#999', fontWeight: '400' }}>(opsional)</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="nese deshironi pergjigje"
                    style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={pending}
                  style={{
                    background: pending ? '#999' : '#DA291C', color: '#fff', border: 'none',
                    borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600',
                    cursor: pending ? 'not-allowed' : 'pointer',
                  }}
                >
                  {pending ? 'Duke dërguar...' : 'Dërgo feedbackun'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
