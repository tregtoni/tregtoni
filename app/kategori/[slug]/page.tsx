import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import { KATEGORI_MAP, MARKAT_MAKINA, MARKAT_MOTOCIKLETA, QYTETET, RENDITJA } from '@/lib/kategori-data'
import CarFilterSidebar, { CarFilters } from './CarFilterSidebar'
import MotoFilterSidebar, { MotoFilters } from './MotoFilterSidebar'
import ApartamentFilterSidebar, { ApartFilters } from './ApartamentFilterSidebar'
import ShtepiFilterSidebar, { ShtepiFilters } from './ShtepiFilterSidebar'
import ElektronikFilterSidebar, { ElektronikFilters } from './ElektronikFilterSidebar'
import PuneFilterSidebar, { PuneFilters } from './PuneFilterSidebar'
import SherbimeFilterSidebar, { SherbimeFilters } from './SherbimeFilterSidebar'
import ModeFilterSidebar, { ModeFilters } from './ModeFilterSidebar'
import FemijeFilterSidebar, { FemijeFilters } from './FemijeFilterSidebar'
import KafsheFilterSidebar, { KafsheFilters } from './KafsheFilterSidebar'
import MesimFilterSidebar, { MesimFilters } from './MesimFilterSidebar'
import BiletaFilterSidebar, { BiletaFilters } from './BiletaFilterSidebar'
import HobiFilterSidebar, { HobiFilters } from './HobiFilterSidebar'
import MuzikeFilterSidebar, { MuzikeFilters } from './MuzikeFilterSidebar'
import DhurateFilterSidebar, { DhurateFilters } from './DhurateFilterSidebar'
import MeldeModal from '@/app/components/MeldeModal'
import FavoriteButton from '@/app/components/FavoriteButton'

type SearchParams = {
  nenkategoria?: string
  marka?: string
  cmimi_min?: string
  cmimi_max?: string
  qyteti?: string
  rendit?: string
  // car filters
  km_min?: string; km_max?: string
  zustand?: string
  bj_min?: string; bj_max?: string
  kraftstoff?: string
  ps_min?: string; ps_max?: string
  getriebe?: string
  typ?: string
  tueren?: string
  umwelt?: string
  schadstoff?: string
  material?: string
  farbe?: string
  ausstattung?: string | string[]
  innen?: string | string[]
  sicher?: string | string[]
  // moto filters
  cc_min?: string; cc_max?: string
  hu_min?: string; hu_max?: string
  moto_art?: string
  angebotstyp?: string
  ofruesi?: string
  // apartment filters
  apt_type?: string
  shkembim?: string
  pajisjet?: string | string[]
  karakteristika?: string | string[]
  sip_min?: string; sip_max?: string
  dhoma_min?: string; dhoma_max?: string
  kati_min?: string; kati_max?: string
  disp_min?: string; disp_max?: string
  // elektronik filters
  dergesa?: string
  pajisja?: string
  ngjyra?: string
  ram?: string
  os?: string
  madhesia?: string
  el_lloji?: string
  platforma?: string
  // punë filters
  lloji_punes?: string
  fusha?: string
  lloji_voz?: string
  patenta?: string
  roli?: string
  gjuha?: string
  lloji_shitjes?: string
  // shërbime filters
  lloji_sherbimi?: string
  // modë filters
  numri_kepuces?: string
  mode_lloji?: string
  // fëmijë filters
  mosha?: string
  gjinia?: string
  femije_lloji?: string
  // kafshë filters
  raca?: string
  me_origjine?: string
  kafshe_lloji?: string
  // mësim filters
  mesim_lloji?: string
  mesim_niveli?: string
  gjuha_mesuar?: string
  lenda?: string
  mesim_sub_lloji?: string
  // bileta filters
  bileta_date_nga?: string
  bileta_date_deri?: string
  bileta_lloji?: string
  destinacioni?: string
  // hobi filters
  hobi_lloji?: string
  hobi_periudha?: string
  hobi_date_nga?: string
  hobi_date_deri?: string
  // muzike filters
  muzike_lloji?: string
  muzike_zhanri?: string
  // dhurate filters
  dhurate_lloji?: string
  dhurate_kohezgjatja?: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 60) return `${min} min më parë`
  const hrs = Math.floor(min / 60)
  if (hrs < 24) return `${hrs} orë më parë`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days} ditë më parë`
  return new Date(dateStr).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short' })
}

export default async function KategoriPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await params
  const sp = await searchParams
  const {
    nenkategoria, marka, cmimi_min, cmimi_max, qyteti, rendit,
    km_min, km_max, zustand, bj_min, bj_max, kraftstoff,
    ps_min, ps_max, getriebe, typ, tueren, umwelt, schadstoff,
    material, farbe,
    cc_min, cc_max, hu_min, hu_max, moto_art, angebotstyp, ofruesi,
    apt_type, shkembim, sip_min, sip_max, dhoma_min, dhoma_max,
    kati_min, kati_max, disp_min, disp_max,
    dergesa, pajisja, ngjyra, ram, os, madhesia, el_lloji, platforma,
    lloji_punes, fusha, lloji_voz, patenta, roli, gjuha, lloji_shitjes,
    lloji_sherbimi,
    numri_kepuces, mode_lloji,
    mosha, gjinia, femije_lloji,
    raca, me_origjine, kafshe_lloji,
    mesim_lloji, mesim_niveli, gjuha_mesuar, lenda, mesim_sub_lloji,
    bileta_date_nga, bileta_date_deri, bileta_lloji, destinacioni,
    hobi_lloji, hobi_periudha, hobi_date_nga, hobi_date_deri,
    muzike_lloji, muzike_zhanri,
    dhurate_lloji, dhurate_kohezgjatja,
  } = sp

  const toArr = (v: string | string[] | undefined): string[] =>
    !v ? [] : Array.isArray(v) ? v : [v]

  const ausstattung  = toArr(sp.ausstattung)
  const innen        = toArr(sp.innen)
  const sicher       = toArr(sp.sicher)
  const pajisjet     = toArr(sp.pajisjet)
  const karakteristika = toArr(sp.karakteristika)

  const carFilters: CarFilters = {
    km_min, km_max, zustand, bj_min, bj_max, kraftstoff,
    ps_min, ps_max, getriebe, typ, tueren, umwelt, schadstoff,
    material, farbe,
    ausstattung, innen, sicher,
  }

  const motoFilters: MotoFilters = {
    km_min, km_max, bj_min, bj_max,
    cc_min, cc_max, ps_min, ps_max, hu_min, hu_max,
    moto_art, getriebe, angebotstyp, ofruesi,
  }

  const shtepiFilters: ShtepiFilters = {
    zustand, angebotstyp, ofruesi,
  }

  const modeFilters: ModeFilters = {
    zustand, angebotstyp, ofruesi, dergesa, marka,
    madhesia, ngjyra, numri_kepuces, mode_lloji,
  }

  const femijeFilters: FemijeFilters = {
    zustand, mosha, gjinia, madhesia, femije_lloji,
  }

  const kafsheFilters: KafsheFilters = {
    gjinia, mosha, raca, me_origjine, kafshe_lloji,
  }

  const mesimFilters: MesimFilters = {
    mesim_lloji, mesim_niveli, gjuha, gjuha_mesuar, lenda, mesim_sub_lloji,
  }

  const biletaFilters: BiletaFilters = {
    bileta_date_nga, bileta_date_deri, bileta_lloji, destinacioni,
  }

  const hobiFilters: HobiFilters = {
    zustand, hobi_lloji, hobi_periudha, destinacioni,
    hobi_date_nga, hobi_date_deri,
  }

  const muzikeFilters: MuzikeFilters = {
    zustand, muzike_lloji, muzike_zhanri, gjuha,
  }

  const dhurateFilters: DhurateFilters = {
    zustand, mosha, gjinia, dhurate_lloji, dhurate_kohezgjatja,
  }

  const sherbimeFilters: SherbimeFilters = {
    lloji_sherbimi, angebotstyp, ofruesi,
  }

  const puneFilters: PuneFilters = {
    lloji_punes, ofruesi, fusha, lloji_voz, patenta, roli, gjuha, lloji_shitjes,
  }

  const elFilters: ElektronikFilters = {
    zustand, angebotstyp, ofruesi, dergesa,
    marka, pajisja, ngjyra, ram, os, madhesia, el_lloji, platforma,
  }

  const apartFilters: ApartFilters = {
    apt_type, angebotstyp, ofruesi, shkembim,
    pajisjet, karakteristika,
    sip_min, sip_max, dhoma_min, dhoma_max,
    kati_min, kati_max, disp_min, disp_max,
  }

  const kategoria = KATEGORI_MAP[slug]
  if (!kategoria) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isMakina      = slug === 'makina'
  const isImobiliare  = slug === 'imobiliare'
  const isShtepi      = slug === 'shtepi'
  const isElektronik  = slug === 'elektronik'
  const isPune        = slug === 'pune'
  const isSherbime    = slug === 'sherbime'
  const isMode        = slug === 'mode'
  const isFemije      = slug === 'femije'
  const isKafshe      = slug === 'kafsha'
  const isMesim       = slug === 'mesim'
  const isBileta      = slug === 'bileta'
  const isHobi        = slug === 'hobi'
  const isMuzike      = slug === 'muzike'
  const isDhurate     = slug === 'dhurate'
  const showingMarka = nenkategoria === 'Makina'
  const showingMoto = nenkategoria === 'Motorra'

  const { data: teGjitha } = await supabase
    .from('njoftimet')
    .select('subcategory, marka')
    .eq('category', slug)

  const countPerNen: Record<string, number> = {}
  const countPerMarka: Record<string, number> = {}
  const countPerMotoMarka: Record<string, number> = {}
  for (const row of teGjitha ?? []) {
    const nen = row.subcategory || ''
    countPerNen[nen] = (countPerNen[nen] ?? 0) + 1
    if (isMakina && row.marka) {
      if (nen === 'Motorra') {
        countPerMotoMarka[row.marka] = (countPerMotoMarka[row.marka] ?? 0) + 1
      } else if (nen === 'Makina') {
        countPerMarka[row.marka] = (countPerMarka[row.marka] ?? 0) + 1
      }
    }
  }
  const totalCount = teGjitha?.length ?? 0
  const markaCount = Object.values(countPerMarka).reduce((a, b) => a + b, 0)
  const motoMarkaCount = Object.values(countPerMotoMarka).reduce((a, b) => a + b, 0)

  let query = supabase.from('njoftimet').select('*').eq('category', slug).neq('aktive', false)

  if (showingMarka) {
    query = query.eq('subcategory', 'Makina')
    if (marka) query = query.eq('marka', marka)
  } else if (showingMoto) {
    query = query.eq('subcategory', 'Motorra')
    if (marka) query = query.eq('marka', marka)
  } else if (nenkategoria) {
    query = query.eq('subcategory', nenkategoria)
  }

  if (!isMakina && marka) query = query.eq('marka', marka)

  if (cmimi_min) query = query.gte('price', parseFloat(cmimi_min))
  if (cmimi_max) query = query.lte('price', parseFloat(cmimi_max))
  if (qyteti) query = query.eq('city', qyteti)

  // car-specific filters (only meaningful for makina, but harmless for others)
  if (km_min)    query = query.gte('km', parseInt(km_min))
  if (km_max)    query = query.lte('km', parseInt(km_max))
  if (zustand)   query = query.eq('zustand', zustand)
  if (bj_min)    query = query.gte('baujahr', parseInt(bj_min))
  if (bj_max)    query = query.lte('baujahr', parseInt(bj_max))
  if (kraftstoff) query = query.eq('kraftstoff', kraftstoff)
  if (ps_min)    query = query.gte('leistung_ps', parseInt(ps_min))
  if (ps_max)    query = query.lte('leistung_ps', parseInt(ps_max))
  if (getriebe)  query = query.eq('getriebe', getriebe)
  if (typ)       query = query.eq('fahrzeugtyp', typ)
  if (tueren)    query = query.eq('tueren', tueren)
  if (umwelt)    query = query.eq('umweltplakette', umwelt)
  if (schadstoff) query = query.eq('schadstoffklasse', schadstoff)
  if (material)  query = query.eq('innen_material', material)
  if (farbe)     query = query.eq('farbe', farbe)
  if (ausstattung.length) query = query.contains('ausstattung', ausstattung)
  if (innen.length)       query = query.contains('innen_ausstattung', innen)
  if (sicher.length)      query = query.contains('sicherheit', sicher)

  // moto-specific filters
  if (cc_min)      query = query.gte('cilindrata', parseInt(cc_min))
  if (cc_max)      query = query.lte('cilindrata', parseInt(cc_max))
  if (hu_min)      query = query.gte('hu_gueltig', parseInt(hu_min))
  if (hu_max)      query = query.lte('hu_gueltig', parseInt(hu_max))
  if (moto_art)    query = query.eq('moto_art', moto_art)
  if (angebotstyp) query = query.eq('angebotstyp', angebotstyp)
  if (ofruesi)     query = query.eq('ofruesi', ofruesi)

  // apartment-specific filters
  if (apt_type)    query = query.eq('apt_type', apt_type)
  if (shkembim)    query = query.eq('shkembim', shkembim)
  if (sip_min)     query = query.gte('siperfaqja', parseInt(sip_min))
  if (sip_max)     query = query.lte('siperfaqja', parseInt(sip_max))
  if (dhoma_min)   query = query.gte('dhoma', parseInt(dhoma_min))
  if (dhoma_max)   query = query.lte('dhoma', parseInt(dhoma_max))
  if (kati_min)    query = query.gte('kati', parseInt(kati_min))
  if (kati_max)    query = query.lte('kati', parseInt(kati_max))
  if (disp_min)    query = query.gte('disponueshem', disp_min)
  if (disp_max)    query = query.lte('disponueshem', disp_max)
  if (pajisjet.length)      query = query.contains('pajisjet', pajisjet)
  if (karakteristika.length) query = query.contains('karakteristika', karakteristika)

  // modë-specific filters
  if (isMode) {
    if (marka)         query = query.eq('marka',         marka)
    if (zustand)       query = query.eq('zustand',       zustand)
    if (angebotstyp)   query = query.eq('angebotstyp',   angebotstyp)
    if (ofruesi)       query = query.eq('ofruesi',       ofruesi)
    if (dergesa)       query = query.eq('dergesa',       dergesa)
    if (madhesia)      query = query.eq('madhesia',      madhesia)
    if (ngjyra)        query = query.eq('ngjyra',        ngjyra)
    if (numri_kepuces) query = query.eq('numri_kepuces', numri_kepuces)
    if (mode_lloji)    query = query.eq('mode_lloji',    mode_lloji)
  }

  // fëmijë-specific filters
  if (isFemije) {
    if (zustand)      query = query.eq('zustand',      zustand)
    if (mosha)        query = query.eq('mosha',        mosha)
    if (gjinia)       query = query.eq('gjinia',       gjinia)
    if (madhesia)     query = query.eq('madhesia',     madhesia)
    if (femije_lloji) query = query.eq('femije_lloji', femije_lloji)
  }

  // kafshë-specific filters
  if (isKafshe) {
    if (gjinia)       query = query.eq('gjinia',       gjinia)
    if (mosha)        query = query.eq('mosha',        mosha)
    if (raca)         query = query.ilike('raca',      `%${raca}%`)
    if (me_origjine)  query = query.eq('me_origjine',  me_origjine)
    if (kafshe_lloji) query = query.eq('kafshe_lloji', kafshe_lloji)
  }

  // mësim-specific filters
  if (isMesim) {
    if (mesim_lloji)    query = query.eq('mesim_lloji',    mesim_lloji)
    if (mesim_niveli)   query = query.eq('mesim_niveli',   mesim_niveli)
    if (gjuha)          query = query.eq('gjuha',          gjuha)
    if (gjuha_mesuar)   query = query.eq('gjuha_mesuar',   gjuha_mesuar)
    if (lenda)          query = query.eq('lenda',          lenda)
    if (mesim_sub_lloji) query = query.eq('mesim_sub_lloji', mesim_sub_lloji)
  }

  // bileta-specific filters
  if (isBileta) {
    if (bileta_date_nga)  query = query.gte('data_eventit', bileta_date_nga)
    if (bileta_date_deri) query = query.lte('data_eventit', bileta_date_deri)
    if (bileta_lloji)     query = query.eq('bileta_lloji',  bileta_lloji)
    if (destinacioni)     query = query.ilike('destinacioni', `%${destinacioni}%`)
  }

  // hobi-specific filters
  if (isHobi) {
    if (zustand)        query = query.eq('zustand',        zustand)
    if (hobi_lloji)     query = query.eq('hobi_lloji',     hobi_lloji)
    if (hobi_periudha)  query = query.eq('hobi_periudha',  hobi_periudha)
    if (destinacioni)   query = query.ilike('destinacioni', `%${destinacioni}%`)
    if (hobi_date_nga)  query = query.gte('data_eventit',  hobi_date_nga)
    if (hobi_date_deri) query = query.lte('data_eventit',  hobi_date_deri)
  }

  // muzike-specific filters
  if (isMuzike) {
    if (zustand)       query = query.eq('zustand',       zustand)
    if (muzike_lloji)  query = query.eq('muzike_lloji',  muzike_lloji)
    if (muzike_zhanri) query = query.eq('muzike_zhanri', muzike_zhanri)
    if (gjuha)         query = query.eq('gjuha',         gjuha)
  }

  // dhurate-specific filters
  if (isDhurate) {
    if (zustand)             query = query.eq('zustand',             zustand)
    if (mosha)               query = query.eq('mosha',               mosha)
    if (gjinia)              query = query.eq('gjinia',              gjinia)
    if (dhurate_lloji)       query = query.eq('dhurate_lloji',       dhurate_lloji)
    if (dhurate_kohezgjatja) query = query.eq('dhurate_kohezgjatja', dhurate_kohezgjatja)
  }

  // shërbime-specific filters
  if (lloji_sherbimi) query = query.eq('lloji_sherbimi', lloji_sherbimi)
  if (angebotstyp && isSherbime) query = query.eq('angebotstyp', angebotstyp)
  if (ofruesi && isSherbime)     query = query.eq('ofruesi',     ofruesi)

  // punë-specific filters
  if (lloji_punes)   query = query.eq('lloji_punes',   lloji_punes)
  if (ofruesi && isPune) query = query.eq('ofruesi',   ofruesi)
  if (fusha)         query = query.eq('fusha',         fusha)
  if (lloji_voz)     query = query.eq('lloji_voz',     lloji_voz)
  if (patenta)       query = query.eq('patenta',       patenta)
  if (roli)          query = query.eq('roli',          roli)
  if (gjuha)         query = query.eq('gjuha',         gjuha)
  if (lloji_shitjes) query = query.eq('lloji_shitjes', lloji_shitjes)

  // elektronik-specific filters
  if (dergesa)   query = query.eq('dergesa',   dergesa)
  if (pajisja)   query = query.eq('pajisja',   pajisja)
  if (ngjyra)    query = query.eq('ngjyra',    ngjyra)
  if (ram)       query = query.eq('ram',       ram)
  if (os)        query = query.eq('os',        os)
  if (madhesia)  query = query.eq('madhesia',  madhesia)
  if (el_lloji)  query = query.eq('el_lloji',  el_lloji)
  if (platforma) query = query.eq('platforma', platforma)

  switch (rendit) {
    case 'te_vjetrat':      query = query.order('created_at', { ascending: true }); break
    case 'me_i_lire':       query = query.order('price',      { ascending: true }); break
    case 'me_i_shtrenjtë':  query = query.order('price',      { ascending: false }); break
    default:                query = query.order('created_at', { ascending: false })
  }

  const { data: njoftimet } = await query

  // Batch-fetch favorites for current user
  const njoftimIds = (njoftimet ?? []).map(ad => ad.id)
  const { data: favRows } = user && njoftimIds.length
    ? await supabase.from('favorites').select('njoftim_id').eq('user_id', user.id).in('njoftim_id', njoftimIds)
    : { data: [] }
  const favSet = new Set((favRows ?? []).map(r => r.njoftim_id))

  // Batch-fetch seller konto_typ for Tregtar badges
  const admin = createAdminClient()
  const sellerIds = [...new Set((njoftimet ?? []).map(ad => ad.user_id).filter(Boolean))]
  const { data: sellerProfiles } = sellerIds.length
    ? await admin.from('profiles').select('id, konto_typ, avatar_url, firma_name').in('id', sellerIds)
    : { data: [] }
  const sellerMap: Record<string, { konto_typ: string; avatar_url?: string; firma_name?: string }> =
    Object.fromEntries((sellerProfiles ?? []).map(p => [p.id, { konto_typ: p.konto_typ ?? 'privat', avatar_url: p.avatar_url ?? undefined, firma_name: p.firma_name ?? undefined }]))

  const numri = njoftimet?.length ?? 0
  const hasCarFilters = !!(
    km_min || km_max || zustand || bj_min || bj_max || kraftstoff ||
    ps_min || ps_max || getriebe || typ || tueren || umwelt || schadstoff ||
    material || farbe || ausstattung.length || innen.length || sicher.length
  )
  const hasMotoFilters = !!(
    km_min || km_max || bj_min || bj_max || cc_min || cc_max ||
    ps_min || ps_max || hu_min || hu_max || moto_art || getriebe ||
    angebotstyp || ofruesi
  )
  const hasApartFilters = !!(
    apt_type || shkembim || angebotstyp || ofruesi ||
    sip_min || sip_max || dhoma_min || dhoma_max ||
    kati_min || kati_max || disp_min || disp_max ||
    pajisjet.length || karakteristika.length
  )
  const hasShtepiFilters = !!(zustand || angebotstyp || ofruesi)
  const hasElektronikFilters = !!(zustand || angebotstyp || ofruesi || dergesa || marka || pajisja || ngjyra || ram || os || madhesia || el_lloji || platforma)
  const hasPuneFilters     = !!(lloji_punes || ofruesi || fusha || lloji_voz || patenta || roli || gjuha || lloji_shitjes)
  const hasSherbimeFilters = !!(lloji_sherbimi || angebotstyp || ofruesi)
  const hasModeFilters   = !!(zustand || angebotstyp || ofruesi || dergesa || marka || madhesia || ngjyra || numri_kepuces || mode_lloji)
  const hasFemijeFilters = !!(zustand || mosha || gjinia || madhesia || femije_lloji)
  const hasKafsheFilters = !!(gjinia || mosha || raca || me_origjine || kafshe_lloji)
  const hasMesimFilters  = !!(mesim_lloji || mesim_niveli || gjuha || gjuha_mesuar || lenda || mesim_sub_lloji)
  const hasBiletaFilters = !!(bileta_date_nga || bileta_date_deri || bileta_lloji || destinacioni)
  const hasHobiFilters   = !!(zustand || hobi_lloji || hobi_periudha || destinacioni || hobi_date_nga || hobi_date_deri)
  const hasMuzikeFilters  = !!(zustand || muzike_lloji || muzike_zhanri || gjuha)
  const hasDhurateFilters = !!(zustand || mosha || gjinia || dhurate_lloji || dhurate_kohezgjatja)
  const hasFilters = !!(nenkategoria || marka || cmimi_min || cmimi_max || qyteti || rendit || hasCarFilters || hasMotoFilters || hasApartFilters || hasShtepiFilters || hasElektronikFilters || hasPuneFilters || hasSherbimeFilters || hasModeFilters || hasFemijeFilters || hasKafsheFilters || hasMesimFilters || hasBiletaFilters || hasHobiFilters || hasMuzikeFilters || hasDhurateFilters)
  const renditLabel = RENDITJA.find(r => r.value === rendit)?.label ?? 'Më të rejat'
  const clearUrl = `/kategori/${slug}`

  const sidebarLink = (p: Record<string, string | undefined>) => {
    const qsp = new URLSearchParams()
    if (p.nenkategoria) qsp.set('nenkategoria', p.nenkategoria)
    if (p.marka)        qsp.set('marka',        p.marka)
    if (p.cmimi_min)    qsp.set('cmimi_min',    p.cmimi_min)
    if (p.cmimi_max)    qsp.set('cmimi_max',    p.cmimi_max)
    if (p.qyteti)       qsp.set('qyteti',       p.qyteti)
    if (p.rendit)       qsp.set('rendit',        p.rendit)
    // preserve car filters
    if (km_min)     qsp.set('km_min',     km_min)
    if (km_max)     qsp.set('km_max',     km_max)
    if (zustand)    qsp.set('zustand',    zustand)
    if (bj_min)     qsp.set('bj_min',     bj_min)
    if (bj_max)     qsp.set('bj_max',     bj_max)
    if (kraftstoff) qsp.set('kraftstoff', kraftstoff)
    if (ps_min)     qsp.set('ps_min',     ps_min)
    if (ps_max)     qsp.set('ps_max',     ps_max)
    if (getriebe)   qsp.set('getriebe',   getriebe)
    if (typ)        qsp.set('typ',        typ)
    if (tueren)     qsp.set('tueren',     tueren)
    if (umwelt)     qsp.set('umwelt',     umwelt)
    if (schadstoff) qsp.set('schadstoff', schadstoff)
    if (material)   qsp.set('material',   material)
    if (farbe)      qsp.set('farbe',      farbe)
    ausstattung.forEach(v => qsp.append('ausstattung', v))
    innen.forEach(v => qsp.append('innen', v))
    sicher.forEach(v => qsp.append('sicher', v))
    // preserve moto filters
    if (cc_min)      qsp.set('cc_min',      cc_min)
    if (cc_max)      qsp.set('cc_max',      cc_max)
    if (hu_min)      qsp.set('hu_min',      hu_min)
    if (hu_max)      qsp.set('hu_max',      hu_max)
    if (moto_art)    qsp.set('moto_art',    moto_art)
    if (angebotstyp) qsp.set('angebotstyp', angebotstyp)
    if (ofruesi)     qsp.set('ofruesi',     ofruesi)
    // preserve apartment filters
    if (apt_type)  qsp.set('apt_type',  apt_type)
    if (shkembim)  qsp.set('shkembim',  shkembim)
    if (sip_min)   qsp.set('sip_min',   sip_min)
    if (sip_max)   qsp.set('sip_max',   sip_max)
    if (dhoma_min) qsp.set('dhoma_min', dhoma_min)
    if (dhoma_max) qsp.set('dhoma_max', dhoma_max)
    if (kati_min)  qsp.set('kati_min',  kati_min)
    if (kati_max)  qsp.set('kati_max',  kati_max)
    if (disp_min)  qsp.set('disp_min',  disp_min)
    if (disp_max)  qsp.set('disp_max',  disp_max)
    pajisjet.forEach(v => qsp.append('pajisjet', v))
    karakteristika.forEach(v => qsp.append('karakteristika', v))
    const qs = qsp.toString()
    return `/kategori/${slug}${qs ? `?${qs}` : ''}`
  }

  const breadcrumb = marka ? marka : nenkategoria

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '13px',
    color: '#1D1D1F',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      {/* Header */}
      <section style={{
        background: '#fff',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        padding: '20px 32px',
      }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '8px', color: '#86868B' }}>
            <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
            <span>›</span>
            <a href={clearUrl} style={{ color: breadcrumb ? '#86868B' : '#1D1D1F', textDecoration: 'none', fontWeight: breadcrumb ? '400' : '500' }}>{kategoria.name}</a>
            {nenkategoria && (
              <>
                <span>›</span>
                <a href={sidebarLink({ nenkategoria, cmimi_min, cmimi_max, qyteti, rendit })} style={{ color: marka ? '#86868B' : '#1D1D1F', textDecoration: 'none', fontWeight: marka ? '400' : '500' }}>
                  {nenkategoria}
                </a>
              </>
            )}
            {marka && (
              <>
                <span>›</span>
                <span style={{ color: '#1D1D1F', fontWeight: '500' }}>{marka}</span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#F5F5F7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
            }}>
              {kategoria.icon}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.4px' }}>
                {marka ?? nenkategoria ?? kategoria.name}
              </h1>
              <p style={{ fontSize: '13px', color: '#86868B', margin: 0, marginTop: '2px' }}>
                {totalCount.toLocaleString('de-DE')} njoftime gjithsej
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div className="cat-layout" style={{ maxWidth: '1140px', margin: '0 auto', padding: '24px 32px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        {/* ── SIDEBAR ── */}
        <aside className="cat-sidebar" style={{ width: '232px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Subcategories */}
          <div style={{
            background: '#fff',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1D1D1F' }}>Nënkategoritë</span>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: '6px 0' }}>
              <li>
                <a href={clearUrl} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 16px', textDecoration: 'none', fontSize: '13px',
                  color: !nenkategoria ? '#DA291C' : '#1D1D1F',
                  fontWeight: !nenkategoria ? '600' : '400',
                  background: !nenkategoria ? '#FFF5F5' : 'transparent',
                }}>
                  <span>Të gjitha</span>
                  <span style={{
                    fontSize: '11px',
                    color: '#86868B',
                    background: '#F5F5F7',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    fontWeight: '500',
                  }}>
                    {totalCount}
                  </span>
                </a>
              </li>
              {kategoria.nenkategori.map(nen => {
                const cnt = countPerNen[nen] ?? 0
                const active = nenkategoria === nen
                return (
                  <li key={nen}>
                    <a
                      href={sidebarLink({ nenkategoria: nen, cmimi_min, cmimi_max, qyteti, rendit })}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '9px 16px', textDecoration: 'none', fontSize: '13px',
                        color: active ? '#DA291C' : '#1D1D1F',
                        fontWeight: active ? '600' : '400',
                        background: active ? '#FFF5F5' : 'transparent',
                        borderLeft: active ? '2px solid #DA291C' : '2px solid transparent',
                      }}
                    >
                      <span>{nen}</span>
                      <span style={{ fontSize: '11px', color: '#86868B', background: '#F5F5F7', padding: '2px 7px', borderRadius: '10px', fontWeight: '500' }}>
                        {cnt}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Car brand panel */}
          {showingMarka && (
            <div style={{
              background: '#fff',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1D1D1F' }}>Marka</span>
                {marka && (
                  <a href={sidebarLink({ nenkategoria: 'Makina', cmimi_min, cmimi_max, qyteti, rendit })}
                    style={{ fontSize: '12px', color: '#86868B', textDecoration: 'none' }}>
                    Pastro
                  </a>
                )}
              </div>
              <a
                href={sidebarLink({ nenkategoria: 'Makina', cmimi_min, cmimi_max, qyteti, rendit })}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 16px', textDecoration: 'none', fontSize: '13px',
                  color: !marka ? '#DA291C' : '#1D1D1F',
                  fontWeight: !marka ? '600' : '400',
                  background: !marka ? '#FFF5F5' : 'transparent',
                  borderBottom: '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <span>Të gjitha</span>
                <span style={{ fontSize: '11px', color: '#86868B', background: '#F5F5F7', padding: '2px 7px', borderRadius: '10px', fontWeight: '500' }}>{markaCount}</span>
              </a>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {MARKAT_MAKINA.map(m => {
                  const cnt = countPerMarka[m] ?? 0
                  const active = marka === m
                  return (
                    <a
                      key={m}
                      href={sidebarLink({ nenkategoria: 'Makina', marka: m, cmimi_min, cmimi_max, qyteti, rendit })}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 16px', textDecoration: 'none', fontSize: '13px',
                        color: active ? '#DA291C' : '#1D1D1F',
                        fontWeight: active ? '600' : '400',
                        background: active ? '#FFF5F5' : 'transparent',
                        borderLeft: active ? '2px solid #DA291C' : '2px solid transparent',
                      }}
                    >
                      <span>{m}</span>
                      {cnt > 0 && (
                        <span style={{ fontSize: '11px', color: '#86868B', background: '#F5F5F7', padding: '2px 7px', borderRadius: '10px', fontWeight: '500' }}>{cnt}</span>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Motorcycle brand panel */}
          {showingMoto && (
            <div style={{
              background: '#fff',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1D1D1F' }}>Marka</span>
                {marka && (
                  <a href={sidebarLink({ nenkategoria: 'Motorra', cmimi_min, cmimi_max, qyteti, rendit })}
                    style={{ fontSize: '12px', color: '#86868B', textDecoration: 'none' }}>
                    Pastro
                  </a>
                )}
              </div>
              <a
                href={sidebarLink({ nenkategoria: 'Motorra', cmimi_min, cmimi_max, qyteti, rendit })}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '9px 16px', textDecoration: 'none', fontSize: '13px',
                  color: !marka ? '#DA291C' : '#1D1D1F',
                  fontWeight: !marka ? '600' : '400',
                  background: !marka ? '#FFF5F5' : 'transparent',
                  borderBottom: '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <span>Të gjitha</span>
                <span style={{ fontSize: '11px', color: '#86868B', background: '#F5F5F7', padding: '2px 7px', borderRadius: '10px', fontWeight: '500' }}>{motoMarkaCount}</span>
              </a>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {MARKAT_MOTOCIKLETA.map(m => {
                  const cnt = countPerMotoMarka[m] ?? 0
                  const active = marka === m
                  return (
                    <a
                      key={m}
                      href={sidebarLink({ nenkategoria: 'Motorra', marka: m, cmimi_min, cmimi_max, qyteti, rendit })}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 16px', textDecoration: 'none', fontSize: '13px',
                        color: active ? '#DA291C' : '#1D1D1F',
                        fontWeight: active ? '600' : '400',
                        background: active ? '#FFF5F5' : 'transparent',
                        borderLeft: active ? '2px solid #DA291C' : '2px solid transparent',
                      }}
                    >
                      <span>{m}</span>
                      {cnt > 0 && (
                        <span style={{ fontSize: '11px', color: '#86868B', background: '#F5F5F7', padding: '2px 7px', borderRadius: '10px', fontWeight: '500' }}>{cnt}</span>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Filters */}
          {isMakina && showingMoto ? (
            <MotoFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              marka={marka}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              motoFilters={motoFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isMakina ? (
            <CarFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              marka={marka}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              carFilters={carFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isImobiliare ? (
            <ApartamentFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              apartFilters={apartFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isShtepi ? (
            <ShtepiFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              shtepiFilters={shtepiFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isElektronik ? (
            <ElektronikFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              elFilters={elFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isMode ? (
            <ModeFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              modeFilters={modeFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isSherbime ? (
            <SherbimeFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              sherbimeFilters={sherbimeFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isPune ? (
            <PuneFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              puneFilters={puneFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isBileta ? (
            <BiletaFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              biletaFilters={biletaFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isMesim ? (
            <MesimFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              mesimFilters={mesimFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isKafshe ? (
            <KafsheFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              kafsheFilters={kafsheFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isFemije ? (
            <FemijeFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              femijeFilters={femijeFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isHobi ? (
            <HobiFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              hobiFilters={hobiFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isMuzike ? (
            <MuzikeFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              muzikeFilters={muzikeFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : isDhurate ? (
            <DhurateFilterSidebar
              slug={slug}
              nenkategoria={nenkategoria}
              cmimi_min={cmimi_min}
              cmimi_max={cmimi_max}
              qyteti={qyteti}
              rendit={rendit}
              dhurateFilters={dhurateFilters}
              clearUrl={clearUrl}
              hasFilters={hasFilters}
            />
          ) : (
          <div style={{
            background: '#fff',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1D1D1F' }}>Filtrat</span>
            </div>
            <form action={`/kategori/${slug}`} method="GET" style={{ padding: '16px' }}>
              {nenkategoria && <input type="hidden" name="nenkategoria" value={nenkategoria} />}
              {marka && <input type="hidden" name="marka" value={marka} />}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Çmimi (€)
                </label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input name="cmimi_min" type="number" defaultValue={cmimi_min ?? ''} placeholder="Min" min="0" style={inputStyle} />
                  <span style={{ color: '#86868B', fontSize: '12px', flexShrink: 0 }}>—</span>
                  <input name="cmimi_max" type="number" defaultValue={cmimi_max ?? ''} placeholder="Max" min="0" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Qyteti
                </label>
                <select name="qyteti" defaultValue={qyteti ?? ''} style={inputStyle}>
                  <option value="">Të gjitha qytetet</option>
                  {QYTETET.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#86868B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Renditja
                </label>
                <select name="rendit" defaultValue={rendit ?? 're_re'} style={inputStyle}>
                  {RENDITJA.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              <button type="submit" style={{
                width: '100%',
                background: '#DA291C',
                color: '#fff',
                border: 'none',
                padding: '11px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: hasFilters ? '8px' : '0',
                fontFamily: 'inherit',
              }}>
                Apliko filtrat
              </button>
              {hasFilters && (
                <a href={clearUrl} style={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#86868B',
                  fontSize: '12px',
                  textDecoration: 'none',
                  padding: '4px',
                }}>
                  Pastro filtrat
                </a>
              )}
            </form>
          </div>
          )}

          <a href="/njoftim/shto" style={{
            display: 'block',
            background: '#1D1D1F',
            color: '#fff',
            textAlign: 'center',
            padding: '13px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
          }}>
            + Shto njoftim falas
          </a>
        </aside>

        {/* ── LISTINGS ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Results bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '12px 16px',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <span style={{ fontSize: '14px', color: '#6E6E73' }}>
              <strong style={{ color: '#1D1D1F', fontWeight: '600' }}>{numri.toLocaleString('de-DE')}</strong>{' '}
              njoftim{numri !== 1 ? 'e' : ''}
              {marka ? ` · ${marka}` : nenkategoria ? ` · ${nenkategoria}` : ''}
              {qyteti ? ` · ${qyteti}` : ''}
            </span>
            <span style={{ fontSize: '12px', color: '#86868B', fontWeight: '500' }}>{renditLabel}</span>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {marka && (
                <a href={sidebarLink({ nenkategoria: showingMoto ? 'Motorra' : 'Makina', cmimi_min, cmimi_max, qyteti, rendit })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFF5F5', color: '#DA291C', border: '1px solid rgba(218,41,28,0.2)', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
                  {marka} ×
                </a>
              )}
              {nenkategoria && !marka && (
                <a href={sidebarLink({ cmimi_min, cmimi_max, qyteti, rendit })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFF5F5', color: '#DA291C', border: '1px solid rgba(218,41,28,0.2)', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
                  {nenkategoria} ×
                </a>
              )}
              {qyteti && (
                <a href={sidebarLink({ nenkategoria, marka, cmimi_min, cmimi_max, rendit })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFF5F5', color: '#DA291C', border: '1px solid rgba(218,41,28,0.2)', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
                  {qyteti} ×
                </a>
              )}
              {(cmimi_min || cmimi_max) && (
                <a href={sidebarLink({ nenkategoria, marka, qyteti, rendit })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFF5F5', color: '#DA291C', border: '1px solid rgba(218,41,28,0.2)', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', textDecoration: 'none', fontWeight: '500' }}>
                  {cmimi_min ?? '0'} — {cmimi_max ?? '∞'} € ×
                </a>
              )}
            </div>
          )}

          {/* Listing rows */}
          {njoftimet && njoftimet.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {njoftimet.map(ad => {
                const images: string[] = ad.images ?? []
                const isTregtar = sellerMap[ad.user_id]?.konto_typ === 'biznes'
                const sellerLogo = isTregtar ? (sellerMap[ad.user_id]?.avatar_url ?? null) : null
                return (
                  <div key={ad.id}
                    className="kat-card-outer"
                    style={{
                      display: 'flex',
                      background: '#fff',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      position: 'relative',
                      transition: 'box-shadow 0.18s',
                    }}>
                  <a href={`/njoftim/${ad.id}`}
                    className="kat-card-link"
                    style={{ display: 'flex', flex: 1, textDecoration: 'none', minWidth: 0 }}>

                    {/* Image */}
                    <div
                      className="kat-card-img"
                      style={{
                        width: '220px', minHeight: '160px', flexShrink: 0,
                        background: '#F5F5F7', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '42px',
                        overflow: 'hidden', position: 'relative',
                      }}>
                      {images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={images[0]} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                      ) : kategoria.icon}
                      {isTregtar && (
                        <span style={{
                          position: 'absolute', top: '10px', left: '10px', zIndex: 1,
                          background: '#DA291C', color: '#fff',
                          fontSize: '10px', fontWeight: '700',
                          padding: '3px 8px', borderRadius: '6px',
                          letterSpacing: '0.3px', textTransform: 'uppercase',
                        }}>Tregtar</span>
                      )}
                      {images.length > 1 && (
                        <span style={{
                          position: 'absolute', bottom: '8px', right: '8px',
                          background: 'rgba(0,0,0,0.52)', color: '#fff',
                          fontSize: '11px', padding: '3px 8px',
                          borderRadius: '7px', fontWeight: '500',
                        }}>+{images.length - 1}</span>
                      )}
                      {sellerLogo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="kat-seller-overlay"
                          src={sellerLogo}
                          alt=""
                          style={{
                            position: 'absolute', bottom: '10px', left: '10px', zIndex: 2,
                            width: '34px', height: '34px', borderRadius: '50%',
                            border: '2px solid #fff', objectFit: 'cover',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.22)',
                          }}
                        />
                      )}
                      <FavoriteButton
                        njoftim_id={ad.id}
                        userId={user?.id ?? null}
                        initialFavorited={favSet.has(ad.id)}
                      />
                    </div>

                    {/* Info */}
                    <div className="kat-card-info" style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                      <div>
                        {/* Title */}
                        <div style={{
                          fontSize: '17px', fontWeight: '700', color: '#1D1D1F',
                          marginBottom: '8px', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.2px',
                        }}>
                          {ad.title}
                        </div>
                        {/* Price */}
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#DA291C', letterSpacing: '-0.4px', marginBottom: '10px' }}>
                          {ad.price.toLocaleString('de-DE')} €
                        </div>
                        {/* km / PS / Baujahr */}
                        {(ad.km || ad.leistung_ps || ad.baujahr) && (
                          <div style={{ fontSize: '13px', color: '#6E6E73', display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {[
                              ad.km ? `${ad.km.toLocaleString('de-DE')} km` : null,
                              ad.leistung_ps ? `${ad.leistung_ps} PS` : null,
                              ad.baujahr ? `${ad.baujahr}` : null,
                            ].filter(Boolean).map((val, i, arr) => (
                              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {val}
                                {i < arr.length - 1 && <span style={{ color: '#AEAEB2', fontSize: '28px', display: 'inline-flex', alignItems: 'center', height: '12px' }}>·</span>}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Bottom: city + timeAgo + melde */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                        <span style={{ fontSize: '12px', color: '#86868B', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          {ad.city}
                        </span>
                        <span style={{ color: '#D1D1D6', fontSize: '11px' }}>·</span>
                        <div style={{ fontSize: '12px', color: '#86868B', fontWeight: '400' }}>{timeAgo(ad.created_at)}</div>
                        <MeldeModal anzeige_id={ad.id} />
                      </div>
                    </div>

                    {/* Right column: seller logo (business only, desktop) */}
                    {sellerLogo && (
                      <div className="kat-card-seller" style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: '7px',
                        padding: '20px 24px', flexShrink: 0,
                        borderLeft: '1px solid rgba(0,0,0,0.04)',
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sellerLogo} alt="" style={{
                          width: '64px', height: '64px', borderRadius: '50%',
                          border: 'none', objectFit: 'cover',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                        }} />
                        {sellerMap[ad.user_id]?.firma_name && (
                          <span style={{
                            fontSize: '11px', color: '#86868B', fontWeight: '500',
                            textAlign: 'center', lineHeight: '1.35',
                            maxWidth: '88px', wordBreak: 'break-word',
                          }}>
                            {sellerMap[ad.user_id].firma_name}
                          </span>
                        )}
                      </div>
                    )}
                  </a>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{
              background: '#fff',
              borderRadius: '18px',
              padding: '64px 24px',
              textAlign: 'center',
              boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ fontSize: '44px', marginBottom: '16px' }}>{kategoria.icon}</div>
              <h2 style={{ fontSize: '19px', fontWeight: '700', color: '#1D1D1F', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                Nuk ka njoftime
              </h2>
              <p style={{ fontSize: '14px', color: '#6E6E73', marginBottom: '24px', maxWidth: '320px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                {hasFilters ? 'Nuk ka njoftime për filtrat e zgjedhura. Provo të ndryshosh kriteret.' : 'Nuk ka njoftime në këtë kategori aktualisht.'}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {hasFilters && (
                  <a href={clearUrl} style={{ padding: '10px 20px', background: '#F5F5F7', color: '#1D1D1F', borderRadius: '10px', fontSize: '14px', textDecoration: 'none', border: '1px solid rgba(0,0,0,0.1)', fontWeight: '500' }}>
                    Pastro filtrat
                  </a>
                )}
                <a href="/njoftim/shto" style={{ padding: '10px 20px', background: '#DA291C', color: '#fff', borderRadius: '10px', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>
                  Shto njoftim
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
