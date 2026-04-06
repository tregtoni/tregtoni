'use client'

import { useState } from 'react'

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)

  return (
    <div style={{ borderBottom: '1px solid #eee' }}>
      {/* Imazhi kryesor */}
      <div style={{ height: '320px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={title}
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive(i => (i - 1 + images.length) % images.length)}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Foto e mëparshme"
            >‹</button>
            <button
              onClick={() => setActive(i => (i + 1) % images.length)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Foto tjetër"
            >›</button>
            <span style={{ position: 'absolute', bottom: '10px', right: '12px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '12px', padding: '3px 8px', borderRadius: '12px' }}>
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Miniaturat */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', background: '#fafafa', overflowX: 'auto' }}>
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{ flexShrink: 0, width: '60px', height: '60px', border: i === active ? '2px solid #DA291C' : '2px solid transparent', borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
