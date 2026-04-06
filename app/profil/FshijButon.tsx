'use client'

export default function FshijButon({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <button
        type="submit"
        style={{
          background: '#FFF5F5',
          color: '#DA291C',
          border: '1.5px solid rgba(218,41,28,0.25)',
          padding: '7px 14px',
          borderRadius: '9px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        }}
        onClick={(e) => { if (!confirm('Jeni i sigurt që dëshironi të fshini këtë njoftim?')) e.preventDefault() }}
      >
        Fshi
      </button>
    </form>
  )
}
