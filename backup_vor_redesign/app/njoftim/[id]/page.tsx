import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavBar from '@/app/components/NavBar'
import ImageGallery from './ImageGallery'
import { KATEGORI_MAP, CATEGORY_ICON } from '@/lib/kategori-data'

export default async function NjoftimDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: ad } = await supabase
    .from('njoftimet')
    .select('*')
    .eq('id', id)
    .single()

  if (!ad) notFound()

  const { data: seller } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', ad.user_id)
    .single()

  const sellerName = seller?.full_name ?? 'Shitës'
  const images: string[] = ad.images ?? []

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <NavBar />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Kryefaqja</a>
          <span style={{ color: '#ccc' }}>→</span>
          <a href={`/kategori/${ad.category}`} style={{ color: '#999', textDecoration: 'none' }}>
            {CATEGORY_ICON(ad.category)} {KATEGORI_MAP[ad.category]?.shortName ?? ad.category}
          </a>
          <span style={{ color: '#ccc' }}>→</span>
          <span style={{ color: '#111' }}>{ad.title}</span>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', marginBottom: '16px' }}>
          {/* Galeria e imazheve */}
          {images.length > 0 ? (
            <ImageGallery images={images} title={ad.title} />
          ) : (
            <div style={{ height: '260px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '72px', borderBottom: '1px solid #eee' }}>
              {CATEGORY_ICON(ad.category) ?? '📦'}
            </div>
          )}

          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111', margin: 0 }}>{ad.title}</h1>
              <span style={{ fontSize: '22px', fontWeight: '700', color: '#E24B4A', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                {ad.price.toLocaleString('de-DE')} €
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#666', background: '#f4f4f4', padding: '4px 10px', borderRadius: '20px' }}>
                📍 {ad.city}
              </span>
              <span style={{ fontSize: '12px', color: '#666', background: '#f4f4f4', padding: '4px 10px', borderRadius: '20px' }}>
                {CATEGORY_ICON(ad.category)} {KATEGORI_MAP[ad.category]?.shortName ?? ad.category}
              </span>
            </div>

            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>Përshkrimi</h2>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 }}>
              {ad.description}
            </p>
          </div>
        </div>

        {/* Karta e shitësit */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E24B4A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600' }}>
              {sellerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#999' }}>Shitësi</div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#111' }}>{sellerName}</div>
            </div>
          </div>

          {user && user.id !== ad.user_id && (
            <a
              href={`/mesazhet/${ad.user_id}?njoftim=${ad.id}`}
              style={{ background: '#E24B4A', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}
            >
              💬 Dërgo mesazh
            </a>
          )}
          {!user && (
            <a
              href="/login"
              style={{ background: '#111', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}
            >
              Hyr për të kontaktuar
            </a>
          )}
        </div>
      </div>
    </main>
  )
}
