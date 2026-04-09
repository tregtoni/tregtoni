'use server'

import { createClient } from '@/lib/supabase/server'

export async function dergeMeldimin(data: {
  anzeige_id?: string
  gemeldeter_nutzer_id?: string
  verstoss_kategoria: string
  freitext?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Jo i autorizuar')

  const { error } = await supabase.from('meldungen').insert({
    anzeige_id: data.anzeige_id ?? null,
    gemeldeter_nutzer_id: data.gemeldeter_nutzer_id ?? null,
    reporter_id: user.id,
    verstoss_kategoria: data.verstoss_kategoria,
    freitext: data.freitext ?? null,
  })

  if (error) throw new Error(error.message)
}
