'use server'

import { createClient } from '@/lib/supabase/server'

export async function toggleFavorite(njoftim_id: string): Promise<{ isFavorited: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Jo i autorizuar')

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('njoftim_id', njoftim_id)
    .maybeSingle()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    return { isFavorited: false }
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, njoftim_id })
    return { isFavorited: true }
  }
}
