'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type Props = {
  name: string
  placeholder?: string
  required?: boolean
  minLength?: number
  defaultValue?: string
  style?: React.CSSProperties
}

export default function PasswordInput({ name, placeholder, required, minLength, defaultValue, style }: Props) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <input
        name={name}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        defaultValue={defaultValue}
        style={{ ...style, paddingRight: '44px' }}
      />
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: hovered ? '#4B5563' : '#9CA3AF',
        }}
        tabIndex={-1}
        aria-label={visible ? 'Fshih fjalëkalimin' : 'Trego fjalëkalimin'}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}
