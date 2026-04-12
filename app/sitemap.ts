import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

const BASE_URL = 'https://www.tregtoni.com'

const STATIC_PAGES = [
  { url: '/',           priority: 1.0,  changeFrequency: 'daily'   as const },
  { url: '/rreth-nesh', priority: 0.5,  changeFrequency: 'monthly' as const },
  { url: '/kontakt',    priority: 0.5,  changeFrequency: 'monthly' as const },
  { url: '/privatesia', priority: 0.3,  changeFrequency: 'monthly' as const },
  { url: '/cookies',    priority: 0.3,  changeFrequency: 'monthly' as const },
  { url: '/feedback',   priority: 0.4,  changeFrequency: 'monthly' as const },
  { url: '/kushtet',    priority: 0.3,  changeFrequency: 'monthly' as const },
]

const KATEGORI_SLUGS = [
  'makina',
  'imobiliare',
  'shtepi',
  'elektronik',
  'pune',
  'sherbime',
  'mode',
  'femije',
  'kafsha',
  'mesim',
  'bileta',
  'hobi',
  'muzike',
  'dhurate',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(p => ({
    url: `${BASE_URL}${p.url}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  const kategoriEntries: MetadataRoute.Sitemap = KATEGORI_SLUGS.map(slug => ({
    url: `${BASE_URL}/kategori/${slug}`,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }))

  // Fetch all active listings for dynamic URLs
  let njoftimEntries: MetadataRoute.Sitemap = []
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('njoftimet')
      .select('id, created_at, aktive')
      .eq('aktive', true)
      .order('created_at', { ascending: false })
      .limit(10000)

    if (data) {
      njoftimEntries = data.map(ad => ({
        url: `${BASE_URL}/njoftim/${ad.id}`,
        lastModified: new Date(ad.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch {
    // If DB is unreachable, return static entries only
  }

  return [...staticEntries, ...kategoriEntries, ...njoftimEntries]
}
