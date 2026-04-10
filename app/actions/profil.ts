'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function ndryshoEmrin(
  prevState: { error: string; success: boolean },
  formData: FormData
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const emri                = (formData.get('emri')               as string)?.trim()
  const telefon             = (formData.get('telefon')            as string)?.trim() || null
  const qyteti              = (formData.get('qyteti')             as string)?.trim() || null
  const bio                 = (formData.get('bio')                as string)?.trim() || null
  const zeige_telefon       = formData.has('zeige_telefon')
  const zeige_qyteti        = formData.has('zeige_qyteti')
  const firma_name          = (formData.get('firma_name')         as string)?.trim() || null
  const adresa              = (formData.get('adresa')             as string)?.trim() || null
  const website             = (formData.get('website')            as string)?.trim() || null
  const beschreibung_firma  = (formData.get('beschreibung_firma') as string)?.trim() || null

  // Private accounts require a name; business accounts require firma_name
  if (!firma_name && !emri) return { error: 'Emri nuk mund të jetë bosh.', success: false }

  if (emri) {
    const { error: authErr } = await supabase.auth.updateUser({ data: { full_name: emri } })
    if (authErr) return { error: 'Gabim gjatë ndryshimit. Provoni përsëri.', success: false }
  }

  await supabase.from('profiles').upsert({
    id: user.id, full_name: emri || null, telefon, qyteti, bio,
    zeige_telefon, zeige_qyteti,
    firma_name, adresa, website, beschreibung_firma,
  })

  revalidatePath('/profil')
  revalidatePath(`/profil/${user.id}`)
  return { error: '', success: true }
}

export async function ndryshoFjalekalimin(
  prevState: { error: string; success: boolean },
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const fjalekalimi_aktual = (formData.get('fjalekalimi_aktual') as string)
  const fjalekalimi        = (formData.get('fjalekalimi') as string)
  const konfirmo           = (formData.get('konfirmo')    as string)

  if (!fjalekalimi_aktual)
    return { error: 'Ju lutem shkruani fjalëkalimin aktual.', success: false }

  // Verify current password by attempting a sign-in
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: fjalekalimi_aktual,
  })
  if (signInErr) return { error: 'Fjalëkalimi aktual është i gabuar.', success: false }

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

  // Use admin client to bypass any RLS edge cases on upsert
  const admin = createAdminClient()
  const { error } = await admin
    .from('profiles')
    .update({ avatar_url: url })
    .eq('id', user.id)

  if (error) return { error: 'Gabim gjatë ruajtjes së fotos.', success: false, url: '' }

  revalidatePath('/profil')
  revalidatePath(`/profil/${user.id}`)
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

  const kmRaw         = formData.get('km') as string
  const baujahrRaw    = formData.get('baujahr') as string
  const kraftstoff    = (formData.get('kraftstoff') as string) || null
  const leistungRaw   = formData.get('leistung_ps') as string
  const getriebe      = (formData.get('getriebe') as string) || null
  const fahrzeugtyp   = (formData.get('fahrzeugtyp') as string) || null
  const tueren        = (formData.get('tueren') as string) || null
  const schadstoffklasse = (formData.get('schadstoffklasse') as string) || null
  const innen_material = (formData.get('innen_material') as string) || null
  const farbe         = (formData.get('farbe') as string) || null
  const ausstattung   = formData.getAll('ausstattung').map(v => v.toString()).filter(Boolean)
  const innen_ausstattung = formData.getAll('innen_ausstattung').map(v => v.toString()).filter(Boolean)
  const sicherheit    = formData.getAll('sicherheit').map(v => v.toString()).filter(Boolean)

  const cilindRaw   = formData.get('cilindrata') as string
  const huRaw       = formData.get('hu_gueltig') as string
  const moto_art    = (formData.get('moto_art') as string) || null
  const angebotstyp = (formData.get('angebotstyp') as string) || null
  const ofruesi     = (formData.get('ofruesi') as string) || null

  const isMotoSub    = subcategory === 'Motorra'
  const isApartSub   = category === 'imobiliare' &&
    (subcategory === 'Apartamente në shitje' || subcategory === 'Apartamente me qira')
  const isElektronik = category === 'elektronik'
  const isMode       = category === 'mode'

  const aptFields = isApartSub ? {
    apt_type:      (formData.get('apt_type') as string) || null,
    shkembim:      (formData.get('shkembim') as string) || null,
    angebotstyp:   (formData.get('angebotstyp') as string) || null,
    ofruesi:       (formData.get('ofruesi') as string) || null,
    siperfaqja:    formData.get('siperfaqja') ? parseInt(formData.get('siperfaqja') as string) : null,
    dhoma:         formData.get('dhoma') ? parseInt(formData.get('dhoma') as string) : null,
    kati:          formData.get('kati') ? parseInt(formData.get('kati') as string) : null,
    disponueshem:  (formData.get('disponueshem') as string) || null,
    pajisjet:      formData.getAll('pajisjet').map(v => v.toString()).filter(Boolean),
    karakteristika: formData.getAll('karakteristika').map(v => v.toString()).filter(Boolean),
  } : {}

  const carFields = category === 'makina' && !isMotoSub ? {
    km:               kmRaw ? parseInt(kmRaw) : null,
    baujahr:          baujahrRaw ? parseInt(baujahrRaw) : null,
    kraftstoff, leistung_ps: leistungRaw ? parseInt(leistungRaw) : null,
    getriebe, fahrzeugtyp, tueren, schadstoffklasse,
    innen_material, farbe, ausstattung, innen_ausstattung, sicherheit,
  } : {}

  const motoFields = category === 'makina' && isMotoSub ? {
    km:          kmRaw ? parseInt(kmRaw) : null,
    baujahr:     baujahrRaw ? parseInt(baujahrRaw) : null,
    leistung_ps: leistungRaw ? parseInt(leistungRaw) : null,
    cilindrata:  cilindRaw ? parseInt(cilindRaw) : null,
    hu_gueltig:  huRaw ? parseInt(huRaw) : null,
    getriebe, moto_art, angebotstyp, ofruesi,
  } : {}

  const elFields = isElektronik ? {
    marka:       (formData.get('marka')       as string) || null,
    zustand:     (formData.get('zustand')     as string) || null,
    angebotstyp: (formData.get('angebotstyp') as string) || null,
    ofruesi:     (formData.get('ofruesi')     as string) || null,
    dergesa:     (formData.get('dergesa')     as string) || null,
    pajisja:     (formData.get('pajisja')     as string) || null,
    ngjyra:      (formData.get('ngjyra')      as string) || null,
    ram:         (formData.get('ram')         as string) || null,
    os:          (formData.get('os')          as string) || null,
    madhesia:    (formData.get('madhesia')    as string) || null,
    el_lloji:    (formData.get('el_lloji')    as string) || null,
  } : {}

  const modeFields = isMode ? {
    marka:         (formData.get('marka')         as string) || null,
    zustand:       (formData.get('zustand')       as string) || null,
    angebotstyp:   (formData.get('angebotstyp')   as string) || null,
    ofruesi:       (formData.get('ofruesi')       as string) || null,
    dergesa:       (formData.get('dergesa')       as string) || null,
    madhesia:      (formData.get('madhesia')      as string) || null,
    ngjyra:        (formData.get('ngjyra')        as string) || null,
    numri_kepuces: (formData.get('numri_kepuces') as string) || null,
    mode_lloji:    (formData.get('mode_lloji')    as string) || null,
  } : {}

  const { error } = await supabase
    .from('njoftimet')
    .update({ title, category, subcategory, marka: (isElektronik || isMode) ? undefined : marka, description, price: parseFloat(price), city, ...carFields, ...motoFields, ...aptFields, ...elFields, ...modeFields })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Gabim gjatë ruajtjes. Provoni përsëri.' }

  redirect(`/njoftim/${id}`)
}
