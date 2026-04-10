import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import NavBar from '@/app/components/NavBar'
import Footer from '@/app/components/Footer'
import ImageGallery from './ImageGallery'
import { KATEGORI_MAP, CATEGORY_ICON } from '@/lib/kategori-data'
import MeldeModal from '@/app/components/MeldeModal'

const KRAFTSTOFF_LABEL: Record<string, string> = {
  benzine: 'Benzinë', diesel: 'Diesel', cng: 'Gas natyror (CNG)',
  lpg: 'Gaz i lëngshëm (LPG)', hybrid: 'Hibrid', elektrik: 'Elektrik', tjeter: 'Tjetër',
}
const GETRIEBE_LABEL: Record<string, string> = { automatik: 'Automatik', manual: 'Manual' }
const TYPEN_LABEL: Record<string, string> = {
  mikro: 'Mikro', limuzine: 'Limuzinë', kombi: 'Kombi', kabriolet: 'Kabriolet',
  suv: 'SUV / Terrenor', van: 'Van / Bus', coupe: 'Kupé', tjeter: 'Tjetër',
}
const TUEREN_LABEL: Record<string, string> = { '2-3': '2/3 dyer', '4-5': '4/5 dyer', '6-7': '6/7 dyer', tjeter: 'Tjetër' }
const UMWELT_LABEL: Record<string, string> = { '4': '4 – Jeshile', '3': '3 – Verdhë', '2': '2 – Kuqe', '1': '1 – Asnjë' }
const SCHADSTOFF_LABEL: Record<string, string> = {
  euro1: 'Euro 1', euro2: 'Euro 2', euro3: 'Euro 3', euro4: 'Euro 4', euro5: 'Euro 5', euro6: 'Euro 6',
}
const MATERIAL_LABEL: Record<string, string> = {
  leder: 'Lëkurë e plotë', 'gjysem-leder': 'Gjysmë lëkurë', stof: 'Stof',
  velur: 'Velur', alcantara: 'Alcantara', tjeter: 'Tjetër',
}
const FARBE_LABEL: Record<string, string> = {
  bezhe: 'Bezhë', blu: 'Blu', kafe: 'Kafe', verdhe: 'Verdhë', ari: 'Ari',
  gri: 'Gri', jeshile: 'Jeshile', portokalli: 'Portokalli', kuqe: 'Kuqe',
  zi: 'Zi', argjende: 'Argjendë', vjollce: 'Vjollcë', bardhe: 'Bardhë', tjeter: 'Tjetër',
}
const AUSSTATTUNG_LABEL: Record<string, string> = {
  grep: 'Grep tërheqursi', 'sensor-parkimit': 'Sensor parkimi',
  'felge-alu': 'Felgë alumini', 'xenon-led': 'Xenon / LED dritat',
}
const INNEN_LABEL: Record<string, string> = {
  klima: 'Klimë', navigim: 'Sistem navigimi', radio: 'Radio / Tuner',
  bluetooth: 'Bluetooth', handsfree: 'Duart lira', 'cati-rreskore': 'Çati rrëshqitëse / Panoramike',
  'ngrohje-sedile': 'Ngrohje sediljesh', tempomat: 'Tempomat', 'jo-duhanpires': 'Jo duhanpirës',
}
const SICHER_LABEL: Record<string, string> = {
  abs: 'ABS', airbag: 'Airbag', librezesherbimit: 'Librezë shërbimi e plotë',
}
const MOTO_ART_LABEL: Record<string, string> = {
  motorrad: 'Motorçikleta', roller: 'Motorroller & Skuterë', quad: 'Quad', mofa: 'Mofa & Moped',
}
const ANGEBOTSTYP_LABEL: Record<string, string> = { oferta: 'Ofertë', kerkesa: 'Kërkesë' }
const OFRUESI_LABEL: Record<string, string> = { privat: 'Privat', tregtar: 'Tregtar' }
const APT_TYPE_LABEL: Record<string, string> = {
  kat: 'Apartament në kat', cati: 'Apartament në çati',
  perdhe: 'Apartament në kat përdhes', nendhe: 'Apartament nëndhese',
  penthouse: 'Penthouse', maisonette: 'Maisonette', loft: 'Loft', tjeter: 'Të tjera',
}
const SHKEMBIM_LABEL: Record<string, string> = { vetem: 'Vetëm shkëmbim', pa: 'Pa shkëmbim' }
const PAJISJET_LABEL: Record<string, string> = {
  mobiluar: 'I mobiluar / Gjysmë i mobiluar', ballkon: 'Ballkon', tarrace: 'Tarracë',
  'kuzhin-integr': 'Kuzhinë e integruar', vask: 'Vaskë banje',
  'tualet-mysafir': 'Tualet për mysafirë', 'akses-shkalle': 'Akses pa shkallë',
  'ngrohje-dysh': 'Ngrohje dyshemeje',
}
const KARAKTERISTIKA_LABEL: Record<string, string> = {
  'ndert-vjeter': 'Ndërtim i vjetër', 'ndert-ri': 'Ndërtim i ri', ashensor: 'Ashensor',
  bodrum: 'Bodrum', 'cati-ndert': 'Çati', garazh: 'Garazh/Parking', kopsht: 'Kopsht',
  'kafsh-lejohen': 'Kafshë shtëpiake lejohen', bashkjetese: 'I përshtatshëm për bashkëjetesë',
}
const GJENDJA_LABEL: Record<string, string> = {
  ri: 'I ri', shume_mire: 'Shumë mirë', mire: 'Mirë', rregull: 'Në rregull', demtuar: 'I dëmtuar',
}
const DERGESA_LABEL: Record<string, string> = {
  mundshme: 'Dërgesa e mundshme', vetem: 'Vetëm marrje',
}
const PAJISJA_LABEL: Record<string, string> = {
  pajisje: 'Pajisje', aksesore: 'Aksesore', pajisje_aksesore: 'Pajisje & Aksesore',
}
const NGJYRA_LABEL: Record<string, string> = {
  zeze: 'Zezë', bardhe: 'Bardhë', gri: 'Gri', argjend: 'Argjend', gold: 'Gold',
  rozegold: 'Rozëgold', kalter: 'Kaltër', gjelbеr: 'E gjelbër', kuqe: 'E kuqe',
  portokalli: 'Portokalli', roze: 'Rozë', vjollce: 'Vjollcë', bezhe: 'Bezhë',
  kafe: 'Kafe', verdhe: 'E verdhë', tjera: 'Ngjyra të tjera',
}
const RAM_LABEL: Record<string, string> = {
  '4gb': '4 GB', '8gb': '8 GB', '16gb': '16 GB', '32gb': '32 GB+',
}
const OS_LABEL: Record<string, string> = { windows: 'Windows', macos: 'MacOS', linux: 'Linux' }
const MADHESIA_LABEL: Record<string, string> = { '32': '32"', '43': '43"', '55': '55"', '65plus': '65"+' }
const EL_LLOJI_LABEL: Record<string, string> = {
  kufje: 'Kufje', altop: 'Altoparlant', hifi: 'Sistem Hi-Fi', tjeter: 'Të tjera',
  konzol: 'Konzol', loje: 'Lojë', aksesore: 'Aksesore',
  aparat: 'Aparat', objektiv: 'Objektiv',
}
const LLOJI_PUNES_LABEL: Record<string, string> = {
  fulltime: 'Full-time', parttime: 'Part-time', freelance: 'Freelance', praktike: 'Praktikë',
}
const FUSHA_LABEL: Record<string, string> = {
  'ngrohje-ftohje': 'Instalime ngrohje & ftohje', elektrik: 'Elektrik',
  hidraulike: 'Hidraulikë', ndertim: 'Ndërtim', lyerje: 'Lyerje',
  marangoz: 'Marangoz', mekanik: 'Mekanik', suvatim: 'Suvatim',
  pllakosje: 'Pllakosje', catite: 'Çatitë', saldator: 'Saldator',
  'alumin-pvc': 'Alumin & PVC', elektroshtep: 'Elektroshtëpiake',
  pastrim: 'Pastrim', kopshtari: 'Kopshtari', zhvendosje: 'Zhvendosje', tjeter: 'Të tjera',
}
const LLOJI_VOZ_LABEL: Record<string, string> = {
  kamion: 'Kamion', furgon: 'Furgon', makine: 'Makinë', mociklete: 'Motoçikletë',
}
const PATENTA_LABEL: Record<string, string> = { b: 'B', c: 'C', d: 'D', e: 'E' }
const ROLI_LABEL: Record<string, string> = {
  kuzhinier: 'Kuzhinier', kamarier: 'Kamarier', recepsionist: 'Recepsionist',
  menaxher: 'Menaxher', tjeter: 'Të tjera',
}
const GJUHA_LABEL: Record<string, string> = {
  shqip: 'Shqip', anglisht: 'Anglisht', gjermanisht: 'Gjermanisht',
  italisht: 'Italisht', tjeter: 'Të tjera',
}
const LLOJI_SHITJES_LABEL: Record<string, string> = {
  online: 'Online', dyqan: 'Në dyqan', te_dyja: 'Të dyja',
}
const BILETA_LLOJI_LABEL: Record<string, string> = {
  natyre: 'Në natyrë', salle: 'Në sallë',
  autobus: 'Autobus', tren: 'Tren', aeroplan: 'Aeroplan', anije: 'Anije',
  futboll: 'Futboll', basketboll: 'Basketboll', tenis: 'Tenis',
  restorant: 'Restorant', spa: 'Spa', udhetim: 'Udhëtim', argetim: 'Argëtim',
  '0-3': '0–3 vjeç', '3-6': '3–6 vjeç', '6-12': '6–12 vjeç',
  tjera: 'Tjera',
}
const MESIM_LLOJI_LABEL: Record<string, string> = {
  online: 'Online', ne_person: 'Në person', hibrid: 'Hibrid',
}
const MESIM_NIVELI_LABEL: Record<string, string> = {
  fillestar: 'Fillestar', mesatar: 'Mesatar', avancuar: 'Avancuar',
}
const MESIM_GJUHA_LABEL: Record<string, string> = {
  shqip: 'Shqip', anglisht: 'Anglisht', gjermanisht: 'Gjermanisht',
  italisht: 'Italisht', tjera: 'Tjera',
}
const GJUHA_MESUAR_LABEL: Record<string, string> = {
  anglisht: 'Anglisht', gjermanisht: 'Gjermanisht', italisht: 'Italisht',
  frengjisht: 'Frëngjisht', spanjisht: 'Spanjisht', tjera: 'Tjera',
}
const LENDA_LABEL: Record<string, string> = {
  matematike: 'Matematikë', fizike: 'Fizikë', kimi: 'Kimi',
  biologji: 'Biologji', histori: 'Histori', letersi: 'Letërsi', tjera: 'Tjera',
}
const MESIM_SUB_LLOJI_LABEL: Record<string, string> = {
  programim: 'Programim', design: 'Design', rrjeta: 'Rrjeta', zyrtar: 'Zyrtar',
  futboll: 'Futboll', basketboll: 'Basketboll', volejboll: 'Volejboll', tenis: 'Tenis',
  natacion: 'Natacion', boks: 'Boks', karate: 'Karate & Arte Marciale',
  gjimnastike: 'Gjimnastikë', vrapim: 'Vrapim & Atletikë', ciklizem: 'Çiklizëm',
  ski: 'Ski & Snowboard', yoga: 'Yoga & Pilates', fitnes: 'Fitnes', pesengritje: 'Pesëngritje',
  femije: 'Fëmijë', te_rinj: 'Të rinj', te_rritur: 'Të rritur',
  personal: 'Personal', grup: 'Grup', korporativ: 'Korporativ',
  tjera: 'Tjera',
}
const KAFSHE_GJINIA_LABEL: Record<string, string> = {
  mashkull: 'Mashkull', femer: 'Femër', nuk_dihet: 'Nuk dihet',
}
const KAFSHE_MOSHA_LABEL: Record<string, string> = {
  kelysh: 'Këlysh / Fole', '1-6muaj': '1–6 muaj', '6-12muaj': '6–12 muaj',
  '1-3vjec': '1–3 vjeç', '3plus': '3+ vjeç',
}
const KAFSHE_LLOJI_LABEL: Record<string, string> = {
  sport: 'Sport', pune: 'Punë', rekreacion: 'Rekreacion',
  lope: 'Lopë', dele: 'Dele', dhi: 'Dhi', derr: 'Derr', pule: 'Pulë',
  veteriner: 'Veteriner', grooming: 'Grooming', strehim: 'Strehim', stervitje: 'Stërvitje',
  ushqim: 'Ushqim', veshje: 'Veshje', kafaz: 'Kafaz', lodra: 'Lodra', tjera: 'Tjera',
}
const ME_ORIGJINE_LABEL: Record<string, string> = { po: 'Po', jo: 'Jo' }
const FEMIJE_GJENDJA_LABEL: Record<string, string> = {
  e_re: 'E re', si_e_re: 'Si e re', mire: 'Mirë', me_defekte: 'Me defekte',
}
const FEMIJE_MOSHA_LABEL: Record<string, string> = {
  '0-1': '0–1 vjeç', '1-3': '1–3 vjeç', '3-6': '3–6 vjeç',
  '6-10': '6–10 vjeç', '10-14': '10–14 vjeç', '14plus': '14+ vjeç',
}
const FEMIJE_GJINIA_LABEL: Record<string, string> = {
  djale: 'Djalë', vajze: 'Vajzë', uniseks: 'Uniseks',
}
const FEMIJE_LLOJI_LABEL: Record<string, string> = {
  edukative: 'Edukative', elektronike: 'Elektronike', krijuese: 'Krijuese', tjera: 'Të tjera',
}
const DHURATE_GJENDJA_LABEL: Record<string, string> = {
  e_re: 'E re', si_e_re: 'Si e re', mire: 'Mirë', me_defekte: 'Me defekte',
}
const DHURATE_MOSHA_LABEL: Record<string, string> = {
  femije: 'Fëmijë', te_rinj: 'Të rinj', te_rritur: 'Të rritur', te_moshuar: 'Të moshuar',
}
const DHURATE_GJINIA_LABEL: Record<string, string> = {
  mashkull: 'Mashkull', femer: 'Femër', uniseks: 'Uniseks',
}
const DHURATE_LLOJI_LABEL: Record<string, string> = {
  veshje: 'Veshje', elektronike: 'Elektronikë', libra: 'Libra',
  aksesore: 'Aksesore', lodra: 'Lodra', tjera: 'Tjera',
}
const DHURATE_KOHEZGJATJA_LABEL: Record<string, string> = {
  '1_7_dite': '1–7 ditë', '1_4_jave': '1–4 javë', '1_3_muaj': '1–3 muaj', tjera: 'Tjera',
}
const MUZIKE_GJENDJA_LABEL: Record<string, string> = {
  e_re: 'E re', si_e_re: 'Si e re', mire: 'Mirë', me_defekte: 'Me defekte',
}
const MUZIKE_LLOJI_LABEL: Record<string, string> = {
  kitare: 'Kitarë', piano: 'Piano', violine: 'Violinë', bateri: 'Bateri', flaut: 'Flaut',
  letersi: 'Letërsi', shkence: 'Shkencë', histori: 'Histori', femije: 'Fëmijë',
  shkolla: 'Shkolla', zyre: 'Zyrë', art: 'Art',
  tjera: 'Tjera',
}
const MUZIKE_ZHANRI_LABEL: Record<string, string> = {
  pop: 'Pop', rock: 'Rock', hiphop: 'Hip-Hop', klasike: 'Klasike', folk: 'Folk',
  aksion: 'Aksion', komedi: 'Komedi', drame: 'Dramë', dokumentar: 'Dokumentar', animacion: 'Animacion',
  tjera: 'Tjera',
}
const MUZIKE_GJUHA_LABEL: Record<string, string> = {
  shqip: 'Shqip', anglisht: 'Anglisht', gjermanisht: 'Gjermanisht', tjera: 'Tjera',
}
const HOBI_GJENDJA_LABEL: Record<string, string> = {
  e_re: 'E re', si_e_re: 'Si e re', mire: 'Mirë', me_defekte: 'Me defekte',
}
const HOBI_LLOJI_LABEL: Record<string, string> = {
  kengatar: 'Këngëtar', muzikant: 'Muzikant', band: 'Band', dj: 'DJ',
  i_humbur: 'I humbur', i_gjetur: 'I gjetur',
  futboll: 'Futboll', basketboll: 'Basketboll', tenis: 'Tenis', natacion: 'Natacion', kampim: 'Kampim', hiking: 'Hiking',
  thurje: 'Thurje', qendisje: 'Qëndisje', pikture: 'Pikturë', skulpture: 'Skulpturë',
  ushqim_shtepiak: 'Ushqim shtëpiak', pije: 'Pije', embelsira: 'Ëmbëlsira',
  veshje: 'Veshje', mobilje: 'Mobilje', libra: 'Libra', elektronike: 'Elektronikë',
  pullat: 'Pullat', monedha: 'Monedha', kartolina: 'Kartolina', figurina: 'Figurina',
  ne_natyre: 'Në natyrë', ne_salle: 'Në sallë', online: 'Online',
  tjera: 'Tjera',
}
const HOBI_PERIUDHA_LABEL: Record<string, string> = {
  para_1900: 'Para 1900', '1900_1950': '1900–1950', '1950_2000': '1950–2000', pas_2000: 'Pas 2000',
}
const LLOJI_SHERBIMI_LABEL: Record<string, string> = {
  zhvendosje: 'Zhvendosje', transport: 'Transport mallrash', transferte: 'Transfertë',
  muzikant: 'Muzikant', fotograf: 'Fotograf', videograf: 'Videograf', dj: 'DJ',
  kengëtar: 'Këngëtar', aktor: 'Aktor', orkester: 'Orkester dasmash',
  evente: 'Organizim eventesh', dasma: 'Dasma', udhetim: 'Udhëtim', hotele: 'Hotele',
  riparim: 'Riparim', servis: 'Servis', larje: 'Larje',
  veteriner: 'Veteriner', rruajtje: 'Rruajtje', strehim: 'Strehim', shetitje: 'Shëtitje',
  kujdestare: 'Kujdestare', cerdhe: 'Çerdhe', mesues: 'Mësues privat',
  shtepie: 'Kujdes në shtëpi', qender: 'Qendër kujdesi',
  pastrimi: 'Pastrimi', riparime: 'Riparime', kopshtari: 'Kopshtari',
  instalim: 'Instalim', tjeter: 'Të tjera',
}
const MODE_GJENDJA_LABEL: Record<string, string> = {
  ri: 'I ri', si_ri: 'Si i ri', mire: 'I mirë', perdorur: 'I përdorur',
}
const MODE_LLOJI_LABEL: Record<string, string> = {
  kozmetike: 'Kozmetikë', parfum: 'Parfum', lekure: 'Kujdes lëkure', flok: 'Flok',
  dore: 'Çantë dore', shpine: 'Çantë shpine', portofol: 'Portofol', brez: 'Brez', syze: 'Syze',
  ore: 'Orë', unaze: 'Unazë', gjerdan: 'Gjerdan', byzylyk: 'Byzylyk', vathe: 'Vathë',
  tjeter: 'Të tjera',
}
const MODE_NGJYRA_LABEL: Record<string, string> = {
  zeze: 'Zezë', bardhe: 'Bardhë', gri: 'Gri', kalter: 'Kaltër', kuqe: 'E kuqe',
  'gjelbер': 'E gjelbër', bezhe: 'Bezhë', kafe: 'Kafe', tjera: 'Ngjyra të tjera',
}
const DERGESA_MODE_LABEL: Record<string, string> = {
  mundshme: 'Dërgesa e mundshme', vetem: 'Vetëm marrje',
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '11px 0',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
    }}>
      <span style={{ fontSize: '13px', color: '#86868B', fontWeight: '500' }}>{label}</span>
      <span style={{ fontSize: '14px', color: '#1D1D1F', fontWeight: '600', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function FeatureChip({ label }: { label: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      padding: '10px 16px',
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: '10px',
      fontSize: '13px',
      color: '#111111',
      fontWeight: '500',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <span style={{ color: '#E24B4A', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>✓</span>
      {label}
    </div>
  )
}

export default async function NjoftimDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: ad } = await supabase
    .from('njoftimet')
    .select('*')
    .eq('id', id)
    .single()

  if (!ad) notFound()

  const admin = createAdminClient()
  const { data: seller } = await admin
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', ad.user_id)
    .single()

  const sellerName     = seller?.full_name ?? ''
  const sellerAvatar   = seller?.avatar_url ?? null
  const sellerParts    = sellerName.trim().split(/\s+/).filter(Boolean)
  const sellerInitials = sellerParts.length >= 2
    ? (sellerParts[0][0] + sellerParts[1][0]).toUpperCase()
    : sellerParts[0]?.[0]?.toUpperCase() ?? '?'
  const sellerDisplay  = sellerName || null
  const images: string[] = ad.images ?? []
  const isMakina     = ad.category === 'makina'
  const isMoto       = ad.subcategory === 'Motorra'
  const isImobiliare = ad.category === 'imobiliare'
  const isApartament = isImobiliare &&
    (ad.subcategory === 'Apartamente në shitje' || ad.subcategory === 'Apartamente me qira')
  const isElektronik = ad.category === 'elektronik'
  const isPune       = ad.category === 'pune'
  const isSherbime   = ad.category === 'sherbime'
  const isFemije     = ad.category === 'femije'
  const isKafshe     = ad.category === 'kafsha'
  const isBileta     = ad.category === 'bileta'
  const isMesim      = ad.category === 'mesim'
  const isMode       = ad.category === 'mode'
  const isHobi       = ad.category === 'hobi'
  const isMuzike     = ad.category === 'muzike'
  const isDhurate    = ad.category === 'dhurate'

  const allFeatures: string[] = [
    ...((ad.ausstattung ?? []) as string[]).map((v: string) => AUSSTATTUNG_LABEL[v] ?? v),
    ...((ad.innen_ausstattung ?? []) as string[]).map((v: string) => INNEN_LABEL[v] ?? v),
    ...((ad.sicherheit ?? []) as string[]).map((v: string) => SICHER_LABEL[v] ?? v),
  ]

  const aptPajisjet: string[] = ((ad.pajisjet ?? []) as string[]).map((v: string) => PAJISJET_LABEL[v] ?? v)
  const aptKarakteristika: string[] = ((ad.karakteristika ?? []) as string[]).map((v: string) => KARAKTERISTIKA_LABEL[v] ?? v)

  const cardStyle = {
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden' as const,
    marginBottom: '16px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.07)',
    border: '1px solid rgba(0,0,0,0.05)',
  }

  const sectionHeadStyle = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: '4px',
    letterSpacing: '-0.2px',
    paddingLeft: '12px',
    borderLeft: '3px solid #DA291C',
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F5F5F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>
      <NavBar />

      <div className="detail-container" style={{ maxWidth: '760px', margin: '0 auto', padding: '28px 24px 48px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '13px', color: '#86868B' }}>
          <a href="/" style={{ color: '#86868B', textDecoration: 'none' }}>Kryefaqja</a>
          <span>›</span>
          <a href={`/kategori/${ad.category}`} style={{ color: '#86868B', textDecoration: 'none' }}>
            {KATEGORI_MAP[ad.category]?.shortName ?? ad.category}
          </a>
          <span>›</span>
          <span style={{ color: '#1D1D1F', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}>
            {ad.title}
          </span>
        </div>

        {/* Gallery */}
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          {images.length > 0 ? (
            <ImageGallery images={images} title={ad.title} />
          ) : (
            <div style={{ height: '280px', background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
              {CATEGORY_ICON(ad.category) ?? '📦'}
            </div>
          )}
        </div>

        {/* Title + Price */}
        <div style={{ ...cardStyle, overflow: 'visible' }}>
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1D1D1F', margin: 0, letterSpacing: '-0.5px', lineHeight: '1.25' }}>
                {ad.title}
              </h1>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#DA291C', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
                  {ad.price.toLocaleString('de-DE')} €
                </div>
              </div>
            </div>

            {/* Meta tags + report */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#1D1D1F', background: '#F5F5F7', padding: '5px 12px', borderRadius: '20px', fontWeight: '500' }}>
                📍 {ad.city}
              </span>
              <span style={{ fontSize: '13px', color: '#1D1D1F', background: '#F5F5F7', padding: '5px 12px', borderRadius: '20px', fontWeight: '500' }}>
                {CATEGORY_ICON(ad.category)} {KATEGORI_MAP[ad.category]?.shortName ?? ad.category}
              </span>
              {ad.subcategory && (
                <span style={{ fontSize: '13px', color: '#1D1D1F', background: '#F5F5F7', padding: '5px 12px', borderRadius: '20px', fontWeight: '500' }}>
                  {ad.subcategory}
                </span>
              )}
              {ad.marka && (
                <span style={{ fontSize: '13px', color: '#1D1D1F', background: '#F5F5F7', padding: '5px 12px', borderRadius: '20px', fontWeight: '500' }}>
                  {ad.marka}
                </span>
              )}
              </div>
              <MeldeModal anzeige_id={ad.id} />
            </div>
          </div>
        </div>

        {/* Vehicle specs — cars */}
        {isMakina && !isMoto && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e makinës</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.km != null && <SpecRow label="Kilometrazhi" value={`${ad.km.toLocaleString('de-DE')} km`} />}
                {ad.baujahr && <SpecRow label="Viti i prodhimit" value={String(ad.baujahr)} />}
                {ad.leistung_ps && <SpecRow label="Fuqia" value={`${ad.leistung_ps} PS`} />}
                {ad.kraftstoff && <SpecRow label="Karburanti" value={KRAFTSTOFF_LABEL[ad.kraftstoff] ?? ad.kraftstoff} />}
                {ad.getriebe && <SpecRow label="Transmisioni" value={GETRIEBE_LABEL[ad.getriebe] ?? ad.getriebe} />}
                {ad.fahrzeugtyp && <SpecRow label="Tipi" value={TYPEN_LABEL[ad.fahrzeugtyp] ?? ad.fahrzeugtyp} />}
                {ad.tueren && <SpecRow label="Dyert" value={TUEREN_LABEL[ad.tueren] ?? ad.tueren} />}
                {ad.farbe && <SpecRow label="Ngjyra" value={FARBE_LABEL[ad.farbe] ?? ad.farbe} />}
                {ad.innen_material && <SpecRow label="Materiali i brendshëm" value={MATERIAL_LABEL[ad.innen_material] ?? ad.innen_material} />}
                {ad.schadstoffklasse && <SpecRow label="Klasa e emisioneve" value={SCHADSTOFF_LABEL[ad.schadstoffklasse] ?? ad.schadstoffklasse} />}
                {ad.zustand && <SpecRow label="Gjendja" value={ad.zustand} />}
              </div>
            </div>
          </div>
        )}

        {/* Vehicle specs — moto */}
        {isMakina && isMoto && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e motorrës</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.km != null && <SpecRow label="Kilometrazhi" value={`${ad.km.toLocaleString('de-DE')} km`} />}
                {ad.baujahr && <SpecRow label="Viti i prodhimit" value={String(ad.baujahr)} />}
                {ad.leistung_ps && <SpecRow label="Fuqia" value={`${ad.leistung_ps} PS`} />}
                {ad.cilindrata && <SpecRow label="Cilindrata" value={`${ad.cilindrata} cc`} />}
                {ad.getriebe && <SpecRow label="Këmbëzënia" value={GETRIEBE_LABEL[ad.getriebe] ?? ad.getriebe} />}
                {ad.moto_art && <SpecRow label="Lloji i mjetit" value={MOTO_ART_LABEL[ad.moto_art] ?? ad.moto_art} />}
                {ad.hu_gueltig && <SpecRow label="Kontrolli teknik" value={String(ad.hu_gueltig)} />}
                {ad.angebotstyp && <SpecRow label="Lloji i ofertës" value={ANGEBOTSTYP_LABEL[ad.angebotstyp] ?? ad.angebotstyp} />}
                {ad.ofruesi && <SpecRow label="Ofruesi" value={OFRUESI_LABEL[ad.ofruesi] ?? ad.ofruesi} />}
              </div>
            </div>
          </div>
        )}

        {/* Apartment specs */}
        {isApartament && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e apartamentit</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.apt_type && <SpecRow label="Tipi" value={APT_TYPE_LABEL[ad.apt_type] ?? ad.apt_type} />}
                {ad.siperfaqja && <SpecRow label="Sipërfaqja" value={`${ad.siperfaqja} m²`} />}
                {ad.dhoma && <SpecRow label="Dhoma" value={String(ad.dhoma)} />}
                {ad.kati != null && <SpecRow label="Kati" value={String(ad.kati)} />}
                {ad.disponueshem && <SpecRow label="Disponueshëm nga" value={new Date(ad.disponueshem).toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' })} />}
                {ad.angebotstyp && <SpecRow label="Lloji i ofertës" value={ANGEBOTSTYP_LABEL[ad.angebotstyp] ?? ad.angebotstyp} />}
                {ad.ofruesi && <SpecRow label="Ofruesi" value={OFRUESI_LABEL[ad.ofruesi] ?? ad.ofruesi} />}
                {ad.shkembim && <SpecRow label="Shkëmbim" value={SHKEMBIM_LABEL[ad.shkembim] ?? ad.shkembim} />}
              </div>
            </div>
          </div>
        )}

        {/* Apartment features */}
        {isApartament && (aptPajisjet.length > 0 || aptKarakteristika.length > 0) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Pajisjet & Karakteristika</h2>
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[...aptPajisjet, ...aptKarakteristika].map(f => <FeatureChip key={f} label={f} />)}
              </div>
            </div>
          </div>
        )}

        {/* Elektronik specs */}
        {isElektronik && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e pajisjes</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.marka      && <SpecRow label="Marka"           value={ad.marka} />}
                {ad.pajisja    && <SpecRow label="Pajisja"         value={PAJISJA_LABEL[ad.pajisja] ?? ad.pajisja} />}
                {ad.ngjyra     && <SpecRow label="Ngjyra"          value={NGJYRA_LABEL[ad.ngjyra] ?? ad.ngjyra} />}
                {ad.ram        && <SpecRow label="RAM"             value={RAM_LABEL[ad.ram] ?? ad.ram} />}
                {ad.os         && <SpecRow label="Sistemi operativ" value={OS_LABEL[ad.os] ?? ad.os} />}
                {ad.madhesia   && <SpecRow label="Madhësia"        value={MADHESIA_LABEL[ad.madhesia] ?? ad.madhesia} />}
                {ad.el_lloji   && <SpecRow label="Lloji"           value={EL_LLOJI_LABEL[ad.el_lloji] ?? ad.el_lloji} />}
                {ad.zustand    && <SpecRow label="Gjendja"         value={GJENDJA_LABEL[ad.zustand] ?? ad.zustand} />}
                {ad.angebotstyp && <SpecRow label="Lloji i ofertës" value={ANGEBOTSTYP_LABEL[ad.angebotstyp] ?? ad.angebotstyp} />}
                {ad.ofruesi    && <SpecRow label="Ofruesi"         value={OFRUESI_LABEL[ad.ofruesi] ?? ad.ofruesi} />}
                {ad.dergesa    && <SpecRow label="Dërgesa"         value={DERGESA_LABEL[ad.dergesa] ?? ad.dergesa} />}
              </div>
            </div>
          </div>
        )}

        {/* Punë specs */}
        {isPune && (ad.lloji_punes || ad.ofruesi || ad.fusha || ad.lloji_voz || ad.patenta || ad.roli || ad.gjuha || ad.lloji_shitjes) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e punës</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.fusha         && <SpecRow label="Fusha"            value={FUSHA_LABEL[ad.fusha] ?? ad.fusha} />}
                {ad.lloji_voz     && <SpecRow label="Lloji i vozitjes" value={LLOJI_VOZ_LABEL[ad.lloji_voz] ?? ad.lloji_voz} />}
                {ad.patenta       && <SpecRow label="Patenta"          value={PATENTA_LABEL[ad.patenta] ?? ad.patenta} />}
                {ad.roli          && <SpecRow label="Roli"             value={ROLI_LABEL[ad.roli] ?? ad.roli} />}
                {ad.gjuha         && <SpecRow label="Gjuha"            value={GJUHA_LABEL[ad.gjuha] ?? ad.gjuha} />}
                {ad.lloji_shitjes && <SpecRow label="Lloji"            value={LLOJI_SHITJES_LABEL[ad.lloji_shitjes] ?? ad.lloji_shitjes} />}
                {ad.lloji_punes   && <SpecRow label="Lloji i punës"    value={LLOJI_PUNES_LABEL[ad.lloji_punes] ?? ad.lloji_punes} />}
                {ad.ofruesi       && <SpecRow label="Ofruesi"          value={OFRUESI_LABEL[ad.ofruesi] ?? ad.ofruesi} />}
              </div>
            </div>
          </div>
        )}

        {/* Shërbime specs */}
        {isSherbime && (ad.lloji_sherbimi || ad.angebotstyp || ad.ofruesi) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e shërbimit</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.lloji_sherbimi && <SpecRow label="Lloji i shërbimit" value={LLOJI_SHERBIMI_LABEL[ad.lloji_sherbimi] ?? ad.lloji_sherbimi} />}
                {ad.angebotstyp    && <SpecRow label="Lloji i ofertës"   value={ANGEBOTSTYP_LABEL[ad.angebotstyp] ?? ad.angebotstyp} />}
                {ad.ofruesi        && <SpecRow label="Ofruesi"            value={OFRUESI_LABEL[ad.ofruesi] ?? ad.ofruesi} />}
              </div>
            </div>
          </div>
        )}

        {/* Bileta specs */}
        {isBileta && (ad.data_eventit || ad.bileta_lloji || ad.destinacioni) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e biletës</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.data_eventit  && <SpecRow label="Data e eventit"  value={new Date(ad.data_eventit).toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' })} />}
                {ad.bileta_lloji  && <SpecRow label="Lloji"           value={BILETA_LLOJI_LABEL[ad.bileta_lloji] ?? ad.bileta_lloji} />}
                {ad.destinacioni  && <SpecRow label="Destinacioni"    value={ad.destinacioni} />}
              </div>
            </div>
          </div>
        )}

        {/* Hobi specs */}
        {isHobi && (ad.zustand || ad.hobi_lloji || ad.hobi_periudha || ad.destinacioni || ad.data_eventit) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e hobisë</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.zustand       && <SpecRow label="Gjendja"      value={HOBI_GJENDJA_LABEL[ad.zustand]      ?? ad.zustand} />}
                {ad.hobi_lloji    && <SpecRow label="Lloji"        value={HOBI_LLOJI_LABEL[ad.hobi_lloji]     ?? ad.hobi_lloji} />}
                {ad.hobi_periudha && <SpecRow label="Periudha"     value={HOBI_PERIUDHA_LABEL[ad.hobi_periudha] ?? ad.hobi_periudha} />}
                {ad.destinacioni  && <SpecRow label="Destinacioni" value={ad.destinacioni} />}
                {ad.data_eventit  && <SpecRow label="Data"         value={new Date(ad.data_eventit).toLocaleDateString('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' })} />}
              </div>
            </div>
          </div>
        )}

        {/* Dhuratë specs */}
        {isDhurate && (ad.zustand || ad.mosha || ad.gjinia || ad.dhurate_lloji || ad.dhurate_kohezgjatja) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e dhuratës</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.zustand             && <SpecRow label="Gjendja"      value={DHURATE_GJENDJA_LABEL[ad.zustand]                   ?? ad.zustand} />}
                {ad.mosha               && <SpecRow label="Mosha"        value={DHURATE_MOSHA_LABEL[ad.mosha]                       ?? ad.mosha} />}
                {ad.gjinia              && <SpecRow label="Gjinia"       value={DHURATE_GJINIA_LABEL[ad.gjinia]                     ?? ad.gjinia} />}
                {ad.dhurate_lloji       && <SpecRow label="Lloji"        value={DHURATE_LLOJI_LABEL[ad.dhurate_lloji]               ?? ad.dhurate_lloji} />}
                {ad.dhurate_kohezgjatja && <SpecRow label="Kohëzgjatja" value={DHURATE_KOHEZGJATJA_LABEL[ad.dhurate_kohezgjatja]   ?? ad.dhurate_kohezgjatja} />}
              </div>
            </div>
          </div>
        )}

        {/* Muzikë specs */}
        {isMuzike && (ad.zustand || ad.muzike_lloji || ad.muzike_zhanri || ad.gjuha) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e produktit</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.zustand       && <SpecRow label="Gjendja" value={MUZIKE_GJENDJA_LABEL[ad.zustand]       ?? ad.zustand} />}
                {ad.muzike_lloji  && <SpecRow label="Lloji"   value={MUZIKE_LLOJI_LABEL[ad.muzike_lloji]   ?? ad.muzike_lloji} />}
                {ad.muzike_zhanri && <SpecRow label="Zhanri"  value={MUZIKE_ZHANRI_LABEL[ad.muzike_zhanri] ?? ad.muzike_zhanri} />}
                {ad.gjuha         && <SpecRow label="Gjuha"   value={MUZIKE_GJUHA_LABEL[ad.gjuha]          ?? ad.gjuha} />}
              </div>
            </div>
          </div>
        )}

        {/* Mësim specs */}
        {isMesim && (ad.mesim_lloji || ad.mesim_niveli || ad.gjuha || ad.gjuha_mesuar || ad.lenda || ad.mesim_sub_lloji) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e kursit</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.mesim_lloji    && <SpecRow label="Lloji"            value={MESIM_LLOJI_LABEL[ad.mesim_lloji]       ?? ad.mesim_lloji} />}
                {ad.mesim_niveli   && <SpecRow label="Niveli"           value={MESIM_NIVELI_LABEL[ad.mesim_niveli]     ?? ad.mesim_niveli} />}
                {ad.gjuha          && <SpecRow label="Gjuha e mësimit"  value={MESIM_GJUHA_LABEL[ad.gjuha]            ?? ad.gjuha} />}
                {ad.gjuha_mesuar   && <SpecRow label="Gjuha e mësuar"   value={GJUHA_MESUAR_LABEL[ad.gjuha_mesuar]    ?? ad.gjuha_mesuar} />}
                {ad.lenda          && <SpecRow label="Lënda"            value={LENDA_LABEL[ad.lenda]                  ?? ad.lenda} />}
                {ad.mesim_sub_lloji && <SpecRow label="Lloji"           value={MESIM_SUB_LLOJI_LABEL[ad.mesim_sub_lloji] ?? ad.mesim_sub_lloji} />}
              </div>
            </div>
          </div>
        )}

        {/* Kafshë specs */}
        {isKafshe && (ad.gjinia || ad.mosha || ad.raca || ad.me_origjine || ad.kafshe_lloji) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e kafshës</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.gjinia       && <SpecRow label="Gjinia"        value={KAFSHE_GJINIA_LABEL[ad.gjinia]      ?? ad.gjinia} />}
                {ad.mosha        && <SpecRow label="Mosha"         value={KAFSHE_MOSHA_LABEL[ad.mosha]        ?? ad.mosha} />}
                {ad.raca         && <SpecRow label="Raca"          value={ad.raca} />}
                {ad.me_origjine  && <SpecRow label="Me origjinë"   value={ME_ORIGJINE_LABEL[ad.me_origjine]   ?? ad.me_origjine} />}
                {ad.kafshe_lloji && <SpecRow label="Lloji"         value={KAFSHE_LLOJI_LABEL[ad.kafshe_lloji] ?? ad.kafshe_lloji} />}
              </div>
            </div>
          </div>
        )}

        {/* Fëmijë specs */}
        {isFemije && (ad.zustand || ad.mosha || ad.gjinia || ad.madhesia || ad.femije_lloji) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e produktit</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.zustand      && <SpecRow label="Gjendja"   value={FEMIJE_GJENDJA_LABEL[ad.zustand]      ?? ad.zustand} />}
                {ad.mosha        && <SpecRow label="Mosha"     value={FEMIJE_MOSHA_LABEL[ad.mosha]          ?? ad.mosha} />}
                {ad.gjinia       && <SpecRow label="Gjinia"    value={FEMIJE_GJINIA_LABEL[ad.gjinia]        ?? ad.gjinia} />}
                {ad.madhesia     && <SpecRow label="Madhësia"  value={ad.madhesia} />}
                {ad.femije_lloji && <SpecRow label="Lloji"     value={FEMIJE_LLOJI_LABEL[ad.femije_lloji]  ?? ad.femije_lloji} />}
              </div>
            </div>
          </div>
        )}

        {/* Modë specs */}
        {isMode && (ad.marka || ad.madhesia || ad.numri_kepuces || ad.ngjyra || ad.mode_lloji || ad.zustand || ad.angebotstyp || ad.ofruesi || ad.dergesa) && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Detajet e produktit</h2>
              <div style={{ marginTop: '16px' }}>
                {ad.marka          && <SpecRow label="Marka"            value={ad.marka} />}
                {ad.mode_lloji     && <SpecRow label="Lloji"            value={MODE_LLOJI_LABEL[ad.mode_lloji] ?? ad.mode_lloji} />}
                {ad.madhesia       && <SpecRow label="Madhësia"         value={ad.madhesia} />}
                {ad.numri_kepuces  && <SpecRow label="Numri"            value={ad.numri_kepuces} />}
                {ad.ngjyra         && <SpecRow label="Ngjyra"           value={MODE_NGJYRA_LABEL[ad.ngjyra] ?? ad.ngjyra} />}
                {ad.zustand        && <SpecRow label="Gjendja"          value={MODE_GJENDJA_LABEL[ad.zustand] ?? ad.zustand} />}
                {ad.angebotstyp    && <SpecRow label="Lloji i ofertës"  value={ANGEBOTSTYP_LABEL[ad.angebotstyp] ?? ad.angebotstyp} />}
                {ad.ofruesi        && <SpecRow label="Ofruesi"          value={OFRUESI_LABEL[ad.ofruesi] ?? ad.ofruesi} />}
                {ad.dergesa        && <SpecRow label="Dërgesa"          value={DERGESA_MODE_LABEL[ad.dergesa] ?? ad.dergesa} />}
              </div>
            </div>
          </div>
        )}

        {/* Features / Ausstattung */}
        {allFeatures.length > 0 && (
          <div style={{ ...cardStyle, overflow: 'visible' }}>
            <div style={{ padding: '24px 28px' }}>
              <h2 style={sectionHeadStyle}>Pajisjet & Siguria</h2>
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {allFeatures.map(f => <FeatureChip key={f} label={f} />)}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div style={{ ...cardStyle, overflow: 'visible' }}>
          <div style={{ padding: '24px 28px' }}>
            <h2 style={sectionHeadStyle}>Përshkrimi</h2>
            <p style={{ fontSize: '15px', color: '#3D3D3F', lineHeight: '1.75', whiteSpace: 'pre-wrap', margin: '16px 0 0' }}>
              {ad.description}
            </p>
          </div>
        </div>

        {/* Seller card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a href={`/profil/${ad.user_id}`} style={{ flexShrink: 0, textDecoration: 'none' }}>
              {sellerAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sellerAvatar}
                  alt={sellerName}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #DA291C', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: '#DA291C', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px',
                }}>
                  {sellerInitials}
                </div>
              )}
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {sellerDisplay && (
                <a href={`/profil/${ad.user_id}`} style={{ fontSize: '16px', fontWeight: '600', color: '#1D1D1F', textDecoration: 'none' }}>
                  {sellerDisplay}
                </a>
              )}
              <MeldeModal nutzer_id={ad.user_id} />
            </div>
          </div>

          {user && user.id !== ad.user_id && (
            <a href={`/mesazhet/${ad.user_id}?njoftim=${ad.id}`} style={{
              background: '#DA291C', color: '#fff',
              padding: '11px 24px', borderRadius: '12px',
              fontSize: '14px', fontWeight: '600', textDecoration: 'none', flexShrink: 0,
            }}>
              Dërgo mesazh
            </a>
          )}
          {!user && (
            <a href="/login" style={{
              background: '#1D1D1F', color: '#fff',
              padding: '11px 24px', borderRadius: '12px',
              fontSize: '14px', fontWeight: '600', textDecoration: 'none', flexShrink: 0,
            }}>
              Hyr për të kontaktuar
            </a>
          )}

          {user && user.id === ad.user_id && (
            <a href={`/njoftim/${ad.id}/ndrysho`} style={{
              background: '#F5F5F7', color: '#1D1D1F',
              padding: '11px 24px', borderRadius: '12px',
              fontSize: '14px', fontWeight: '600', textDecoration: 'none', flexShrink: 0,
              border: '1px solid rgba(0,0,0,0.1)',
            }}>
              Ndrysho njoftimin
            </a>
          )}
        </div>

      </div>

      <Footer />
    </main>
  )
}
