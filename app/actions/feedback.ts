'use server'

import { createClient } from '@/lib/supabase/server'

export async function dergofeedback(
  prevState: { error: string; success: boolean },
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const message = (formData.get('message') as string)?.trim()
  if (!message) return { error: 'Ju lutem shkruani feedbackun tuaj.', success: false }

  const name    = (formData.get('name')   as string)?.trim() || null
  const email   = (formData.get('email')  as string)?.trim() || null
  const rating  = parseInt(formData.get('rating') as string) || null

  const supabase = await createClient()
  const { error } = await supabase.from('feedback').insert({ name, email, message, rating })

  if (error) return { error: 'Gabim gjatë dërgimit. Provoni përsëri.', success: false }
  return { error: '', success: true }
}
