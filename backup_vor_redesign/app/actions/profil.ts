'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function ndryshoEmrin(
  prevState: { error: string; success: boolean },
  formData: FormData
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const emri    = (formData.get('emri')    as string)?.trim()
  const telefon = (formData.get('telefon') as string)?.trim() || null
  const qyteti  = (formData.get('qyteti')  as string)?.trim() || null

  if (!emri) return { error: 'Emri nuk mund të jetë bosh.', success: false }

  const { error: authErr } = await supabase.auth.updateUser({ data: { full_name: emri } })
  if (authErr) return { error: 'Gabim gjatë ndryshimit. Provoni përsëri.', success: false }

  await supabase.from('profiles').upsert({ id: user.id, full_name: emri, telefon, qyteti })

  revalidatePath('/profil')
  return { error: '', success: true }
}

export async function ndryshoFjalekalimin(
  prevState: { error: string; success: boolean },
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const fjalekalimi = (formData.get('fjalekalimi') as string)
  const konfirmo    = (formData.get('konfirmo')    as string)

  if (!fjalekalimi || fjalekalimi.length < 6)
    return { error: 'Fjalëkalimi duhet të ketë të paktën 6 karaktere.', success: false }
  if (fjalekalimi !== konfirmo)
    return { error: 'Fjalëkalimet nuk përputhen.', success: false }

  const { error } = await supabase.auth.updateUser({ password: fjalekalimi })
  if (error) return { error: 'Gabim gjatë ndryshimit. Provoni përsëri.', success: false }

  return { error: '', success: true }
}

export async function ndryshoAvatarin(
  prevState: { error: string; success: boolean; url: string },
  formData: FormData
): Promise<{ error: string; success: boolean; url: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const url = (formData.get('avatar_url') as string)?.trim()
  if (!url) return { error: 'URL mungon.', success: false, url: '' }

  await supabase.from('profiles').upsert({ id: user.id, avatar_url: url })
  revalidatePath('/profil')
  return { error: '', success: true, url }
}

export async function fshijNjoftimin(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('njoftimet')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath('/profil')
  redirect('/profil')
}

export async function ndryshoNjoftimin(
  id: string,
  prevState: { error: string },
  formData: FormData
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const subcategory = (formData.get('subcategory') as string) ?? ''
  const marka = (formData.get('marka') as string) ?? ''
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const city = formData.get('city') as string

  if (!title || !category || !description || !price || !city) {
    return { error: 'Të gjitha fushat e detyrueshme duhen plotësuar.' }
  }

  const { error } = await supabase
    .from('njoftimet')
    .update({ title, category, subcategory, marka, description, price: parseFloat(price), city })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Gabim gjatë ruajtjes. Provoni përsëri.' }

  redirect(`/njoftim/${id}`)
}
