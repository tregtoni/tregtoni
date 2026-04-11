'use client'

import { useState } from 'react'
import { toggleFavorite } from '@/app/actions/favorites'

type Props = {
  njoftim_id: string
  userId: string | null
  initialFavorited: boolean
  variant?: 'overlay' | 'inline'
}

export default function FavoriteButton({ njoftim_id, userId, initialFavorited, variant = 'overlay' }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      window.location.href = '/login'
      return
    }

    if (loading) return
    setLoading(true)
    setFavorited(prev => !prev)

    try {
      const result = await toggleFavorite(njoftim_id)
      setFavorited(result.isFavorited)
    } catch {
      setFavorited(prev => !prev)
    } finally {
      setLoading(false)
    }
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={favorited ? 'Hiq nga të ruajtuarat' : 'Ruaj njoftimin'}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: favorited ? '#FFF0F0' : '#F5F5F7',
          border: `1.5px solid ${favorited ? 'rgba(226,75,74,0.25)' : 'rgba(0,0,0,0.08)'}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={favorited ? '#E24B4A' : 'none'} stroke={favorited ? '#E24B4A' : '#6E6E73'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={favorited ? 'Hiq nga të ruajtuarat' : 'Ruaj njoftimin'}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
        zIndex: 3,
        flexShrink: 0,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={favorited ? '#E24B4A' : 'none'} stroke={favorited ? '#E24B4A' : 'rgba(0,0,0,0.45)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  )
}
