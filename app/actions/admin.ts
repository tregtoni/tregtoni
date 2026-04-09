'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    throw new Error('Unauthorized')
  }
}

// ── Meldungen ──────────────────────────────────────────────────────────────

export async function markeeMeldungErledigt(id: string) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('meldungen').update({ erledigt: true }).eq('id', id)
  revalidatePath('/admin/meldungen')
}

export async function loeschMeldung(id: string) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('meldungen').delete().eq('id', id)
  revalidatePath('/admin/meldungen')
}

// ── Njoftimet ──────────────────────────────────────────────────────────────

export async function loeschNjoftim(id: string) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('njoftimet').delete().eq('id', id)
  revalidatePath('/admin/njoftimet')
  revalidatePath('/admin/meldungen')
}

export async function toggleNjoftimAktive(id: string, aktive: boolean) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('njoftimet').update({ aktive }).eq('id', id)
  revalidatePath('/admin/njoftimet')
}

// ── Nutzer ─────────────────────────────────────────────────────────────────

export async function sperreNutzer(id: string) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('profiles').update({ gesperrt: true }).eq('id', id)
  revalidatePath('/admin/nutzer')
}

export async function entsperreNutzer(id: string) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('profiles').update({ gesperrt: false }).eq('id', id)
  revalidatePath('/admin/nutzer')
}

export async function loeschAlleNjoftimeVonNutzer(nutzerId: string) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('njoftimet').delete().eq('user_id', nutzerId)
  revalidatePath('/admin/nutzer')
  revalidatePath('/admin/njoftimet')
}

export async function loeschNutzer(id: string) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.auth.admin.deleteUser(id)
  revalidatePath('/admin/nutzer')
}
