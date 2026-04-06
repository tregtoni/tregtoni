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

  // car-specific fields (only saved for makina category)
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

  // moto-specific fields
  const cilindRaw    = formData.get('cilindrata') as string
  const huRaw        = formData.get('hu_gueltig') as string
  const moto_art     = (formData.get('moto_art') as string) || null
  const angebotstyp  = (formData.get('angebotstyp') as string) || null
  const ofruesi      = (formData.get('ofruesi') as string) || null

  const isMotoSub    = subcategory === 'Motorra'
  const isApartSub   = category === 'imobiliare' &&
    (subcategory === 'Apartamente në shitje' || subcategory === 'Apartamente me qira')
  const isElektronik = category === 'elektronik'
  const isPune       = category === 'pune'
  const isSherbime   = category === 'sherbime'
  const isFemije     = category === 'femije'
  const isKafshe     = category === 'kafsha'
  const isBileta     = category === 'bileta'
  const isMesim      = category === 'mesim'
  const isMode       = category === 'mode'
  const isHobi       = category === 'hobi'
  const isMuzike     = category === 'muzike'
  const isDhurate    = category === 'dhurate'

  const carFields = category === 'makina' && !isMotoSub ? {
    km:               kmRaw ? parseInt(kmRaw) : null,
    baujahr:          baujahrRaw ? parseInt(baujahrRaw) : null,
    kraftstoff,
    leistung_ps:      leistungRaw ? parseInt(leistungRaw) : null,
    getriebe,
    fahrzeugtyp,
    tueren,
    schadstoffklasse,
    innen_material,
    farbe,
    ausstattung,
    innen_ausstattung,
    sicherheit,
  } : {}

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

  const motoFields = category === 'makina' && isMotoSub ? {
    km:          kmRaw ? parseInt(kmRaw) : null,
    baujahr:     baujahrRaw ? parseInt(baujahrRaw) : null,
    leistung_ps: leistungRaw ? parseInt(leistungRaw) : null,
    cilindrata:  cilindRaw ? parseInt(cilindRaw) : null,
    hu_gueltig:  huRaw ? parseInt(huRaw) : null,
    getriebe,
    moto_art,
    angebotstyp,
    ofruesi,
  } : {}

  const elFields = isElektronik ? {
    marka:      (formData.get('marka')      as string) || null,
    zustand:    (formData.get('zustand')    as string) || null,
    angebotstyp:(formData.get('angebotstyp') as string) || null,
    ofruesi:    (formData.get('ofruesi')    as string) || null,
    dergesa:    (formData.get('dergesa')    as string) || null,
    pajisja:    (formData.get('pajisja')    as string) || null,
    ngjyra:     (formData.get('ngjyra')     as string) || null,
    ram:        (formData.get('ram')        as string) || null,
    os:         (formData.get('os')         as string) || null,
    madhesia:   (formData.get('madhesia')   as string) || null,
    el_lloji:   (formData.get('el_lloji')   as string) || null,
  } : {}

  const puneFields = isPune ? {
    lloji_punes:   (formData.get('lloji_punes')   as string) || null,
    ofruesi:       (formData.get('ofruesi')        as string) || null,
    fusha:         (formData.get('fusha')          as string) || null,
    lloji_voz:     (formData.get('lloji_voz')      as string) || null,
    patenta:       (formData.get('patenta')        as string) || null,
    roli:          (formData.get('roli')           as string) || null,
    gjuha:         (formData.get('gjuha')          as string) || null,
    lloji_shitjes: (formData.get('lloji_shitjes')  as string) || null,
  } : {}

  const sherbimeFields = isSherbime ? {
    lloji_sherbimi: (formData.get('lloji_sherbimi') as string) || null,
    angebotstyp:    (formData.get('angebotstyp')    as string) || null,
    ofruesi:        (formData.get('ofruesi')         as string) || null,
  } : {}

  const femijeFields = isFemije ? {
    zustand:      (formData.get('zustand')      as string) || null,
    mosha:        (formData.get('mosha')        as string) || null,
    gjinia:       (formData.get('gjinia')       as string) || null,
    madhesia:     (formData.get('madhesia')     as string) || null,
    femije_lloji: (formData.get('femije_lloji') as string) || null,
  } : {}

  const kafsheFields = isKafshe ? {
    gjinia:       (formData.get('gjinia')       as string) || null,
    mosha:        (formData.get('mosha')        as string) || null,
    raca:         (formData.get('raca')         as string) || null,
    me_origjine:  (formData.get('me_origjine')  as string) || null,
    kafshe_lloji: (formData.get('kafshe_lloji') as string) || null,
  } : {}

  const biletaFields = isBileta ? {
    data_eventit: (formData.get('data_eventit') as string) || null,
    bileta_lloji: (formData.get('bileta_lloji') as string) || null,
    destinacioni: (formData.get('destinacioni') as string) || null,
  } : {}

  const dhurateFields = isDhurate ? {
    zustand:             (formData.get('zustand')             as string) || null,
    mosha:               (formData.get('mosha')               as string) || null,
    gjinia:              (formData.get('gjinia')              as string) || null,
    dhurate_lloji:       (formData.get('dhurate_lloji')       as string) || null,
    dhurate_kohezgjatja: (formData.get('dhurate_kohezgjatja') as string) || null,
  } : {}

  const muzikeFields = isMuzike ? {
    zustand:       (formData.get('zustand')       as string) || null,
    muzike_lloji:  (formData.get('muzike_lloji')  as string) || null,
    muzike_zhanri: (formData.get('muzike_zhanri') as string) || null,
    gjuha:         (formData.get('gjuha')         as string) || null,
  } : {}

  const hobiFields = isHobi ? {
    zustand:       (formData.get('zustand')       as string) || null,
    hobi_lloji:    (formData.get('hobi_lloji')    as string) || null,
    hobi_periudha: (formData.get('hobi_periudha') as string) || null,
    destinacioni:  (formData.get('destinacioni')  as string) || null,
    data_eventit:  (formData.get('data_eventit')  as string) || null,
  } : {}

  const mesimFields = isMesim ? {
    mesim_lloji:    (formData.get('mesim_lloji')    as string) || null,
    mesim_niveli:   (formData.get('mesim_niveli')   as string) || null,
    gjuha:          (formData.get('gjuha')          as string) || null,
    gjuha_mesuar:   (formData.get('gjuha_mesuar')   as string) || null,
    lenda:          (formData.get('lenda')          as string) || null,
    mesim_sub_lloji:(formData.get('mesim_sub_lloji') as string) || null,
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

  const { error } = await supabase.from('njoftimet').insert({
    user_id: user.id,
    title,
    category,
    subcategory,
    marka: (isElektronik || isMode) ? undefined : marka,
    description,
    price: parseFloat(price),
    city,
    images,
    ...carFields,
    ...motoFields,
    ...aptFields,
    ...elFields,
    ...puneFields,
    ...sherbimeFields,
    ...femijeFields,
    ...kafsheFields,
    ...biletaFields,
    ...mesimFields,
    ...modeFields,
    ...hobiFields,
    ...muzikeFields,
    ...dhurateFields,
  })

  if (error) {
    return { error: 'Gabim gjatë publikimit. Provoni përsëri.' }
  }

  redirect('/?success=njoftim')
}
