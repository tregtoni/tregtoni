'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      setVisible(true)
    }
  }, [])

  function acceptAll() {
    localStorage.setItem('cookie_consent', 'all')
    setVisible(false)
  }

  function acceptNecessary() {
    localStorage.setItem('cookie_consent', 'necessary')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      padding: '0 16px 16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px 20px 16px 16px',
        boxShadow: '0 -2px 24px rgba(0,0,0,0.10), 0 1px 10px rgba(0,0,0,0.06)',
        padding: '24px 28px',
        maxWidth: '860px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div>
          <div style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#1D1D1F',
            marginBottom: '6px',
            letterSpacing: '-0.2px',
          }}>
            Kjo faqe përdor cookies
          </div>
          <p style={{
            fontSize: '13px',
            color: '#6E6E73',
            margin: 0,
            lineHeight: '1.6',
          }}>
            Tregtoni.com përdor cookies për të siguruar funksionimin e duhur të platformës dhe për të përmirësuar
            përvojën tuaj. Cookies të nevojshme janë të domosdoshme për autentikimin dhe funksionet bazë.
            Cookies opsionale na ndihmojnë të kuptojmë si përdoret platforma.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <button
            onClick={acceptAll}
            style={{
              background: '#DA291C',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '-0.1px',
            }}
          >
            Pranoj të gjitha
          </button>

          <button
            onClick={acceptNecessary}
            style={{
              background: '#fff',
              color: '#1D1D1F',
              border: '1px solid rgba(0,0,0,0.18)',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '-0.1px',
            }}
          >
            Vetëm të nevojshme
          </button>

          <a
            href="/cookies"
            style={{
              background: '#fff',
              color: '#1D1D1F',
              border: '1px solid rgba(0,0,0,0.18)',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              display: 'inline-block',
              fontFamily: 'inherit',
              letterSpacing: '-0.1px',
            }}
          >
            Më shumë informacion
          </a>
        </div>
      </div>
    </div>
  )
}
