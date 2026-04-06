'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function shtoNjoftim(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const city = formData.get('city') as string
  const subcategory = (formData.get('subcategory') as string) ?? ''
  const marka = (formData.get('marka') as string) ?? ''
  const images = formData.getAll('image_url').map(v => v.toString()).filter(Boolean)

  if (!title || !category || !description || !price || !city) {
    return { error: 'Të gjitha fushat e detyrueshme duhen plotësuar.' }
  }

  const { error } = await supabase.from('njoftimet').insert({
    user_id: user.id,
    title,
    category,
    subcategory,
    marka,
    description,
    price: parseFloat(price),
    city,
    images,
  })

  if (error) {
    console.error('[shtoNjoftim]', error.code, error.message)
    if (error.code === 'PGRST204') {
      return { error: 'Kolona "images" mungon. Ekzekuto SQL-in e migrimit në Supabase.' }
    }
    return { error: 'Gabim gjatë publikimit. Provoni përsëri.' }
  }

  redirect('/?success=njoftim')
}
