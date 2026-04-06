'use client'

export default function FshijButon({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <button
        type="submit"
        style={{ background: '#fff', color: '#E24B4A', border: '1.5px solid #E24B4A', padding: '7px 14px', borderRadius: '7px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
        onClick={(e) => { if (!confirm('Jeni i sigurt që dëshironi të fshini këtë njoftim?')) e.preventDefault() }}
      >
        Fshi
      </button>
    </form>
  )
}
