'use client'

import { useActionState, useState, useRef } from 'react'
import { ndryshoNjoftimin } from '@/app/actions/profil'
import { createClient } from '@/lib/supabase/client'
import { KATEGORITË, KATEGORI_MAP, MARKAT_MAKINA, MARKAT_MOTOCIKLETA, QYTETET_SHQIPERI, QYTETET_KOSOVE } from '@/lib/kategori-data'

const MAX_IMAGES = 20

type ImageEntry = { id: string; url: string }

type Listing = {
  id: string
  title: string
  category: string
  subcategory: string
  marka: string
  description: string
  price: number
  city: string
  images?: string[] | null
  km?: number | null
  baujahr?: number | null
  kraftstoff?: string | null
  leistung_ps?: number | null
  getriebe?: string | null
  fahrzeugtyp?: string | null
  tueren?: string | null
  schadstoffklasse?: string | null
  innen_material?: string | null
  farbe?: string | null
  ausstattung?: string[] | null
  innen_ausstattung?: string[] | null
  sicherheit?: string[] | null
  // moto fields
  cilindrata?: number | null
  hu_gueltig?: number | null
  moto_art?: string | null
  angebotstyp?: string | null
  ofruesi?: string | null
  // apartment fields
  apt_type?: string | null
  shkembim?: string | null
  pajisjet?: string[] | null
  karakteristika?: string[] | null
  siperfaqja?: number | null
  dhoma?: number | null
  kati?: number | null
  disponueshem?: string | null
  // elektronik fields
  zustand?: string | null
  dergesa?: string | null
  pajisja?: string | null
  ngjyra?: string | null
  ram?: string | null
  os?: string | null
  madhesia?: string | null
  el_lloji?: string | null
  // mode fields
  numri_kepuces?: string | null
  mode_lloji?: string | null
}

const inp: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid #ddd',
  borderRadius: '8px',
  padding: '12px 14px',
  fontSize: '14px',
  color: '#111',
  backgroundColor: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
}

const KRAFTSTOFF_OPT = [
  { v: 'benzine', l: 'Benzinë' }, { v: 'diesel', l: 'Diesel' },
  { v: 'cng', l: 'Gas natyror (CNG)' }, { v: 'lpg', l: 'Gaz i lëngshëm (LPG)' },
  { v: 'hybrid', l: 'Hibrid' }, { v: 'elektrik', l: 'Elektrik' }, { v: 'tjeter', l: 'Tjetër' },
]
const GETRIEBE_OPT = [{ v: 'automatik', l: 'Automatik' }, { v: 'manual', l: 'Manual' }]
const TYPEN_OPT = [
  { v: 'mikro', l: 'Mikro' }, { v: 'limuzine', l: 'Limuzinë' }, { v: 'kombi', l: 'Kombi' },
  { v: 'kabriolet', l: 'Kabriolet' }, { v: 'suv', l: 'SUV / Terrenor' }, { v: 'van', l: 'Van / Bus' },
  { v: 'coupe', l: 'Kupé' }, { v: 'tjeter', l: 'Tjetër' },
]
const TUEREN_OPT = [{ v: '2-3', l: '2 / 3 dyer' }, { v: '4-5', l: '4 / 5 dyer' }, { v: '6-7', l: '6 / 7 dyer' }, { v: 'tjeter', l: 'Tjetër' }]
const SCHADSTOFF_OPT = [{ v: 'euro1', l: 'Euro 1' }, { v: 'euro2', l: 'Euro 2' }, { v: 'euro3', l: 'Euro 3' }, { v: 'euro4', l: 'Euro 4' }, { v: 'euro5', l: 'Euro 5' }, { v: 'euro6', l: 'Euro 6' }]
const MATERIAL_OPT = [{ v: 'leder', l: 'Lëkurë e plotë' }, { v: 'gjysem-leder', l: 'Gjysmë lëkurë' }, { v: 'stof', l: 'Stof' }, { v: 'velur', l: 'Velur' }, { v: 'alcantara', l: 'Alcantara' }, { v: 'tjeter', l: 'Tjetër' }]
const FARBE_OPT = [
  { v: 'bezhe', l: 'Bezhë' }, { v: 'blu', l: 'Blu' }, { v: 'kafe', l: 'Kafe' }, { v: 'verdhe', l: 'Verdhë' },
  { v: 'ari', l: 'Ari' }, { v: 'gri', l: 'Gri' }, { v: 'jeshile', l: 'Jeshile' }, { v: 'portokalli', l: 'Portokalli' },
  { v: 'kuqe', l: 'Kuqe' }, { v: 'zi', l: 'Zi' }, { v: 'argjende', l: 'Argjendë' }, { v: 'vjollce', l: 'Vjollcë' },
  { v: 'bardhe', l: 'Bardhë' }, { v: 'tjeter', l: 'Tjetër' },
]
const AUSSTATTUNG_OPT = [{ v: 'grep', l: 'Grep tërheqursi' }, { v: 'sensor-parkimit', l: 'Sensor parkimi' }, { v: 'felge-alu', l: 'Felgë alumini' }, { v: 'xenon-led', l: 'Xenon / LED dritat' }]
const INNEN_OPT = [
  { v: 'klima', l: 'Klimë' }, { v: 'navigim', l: 'Sistem navigimi' }, { v: 'radio', l: 'Radio / Tuner' },
  { v: 'bluetooth', l: 'Bluetooth' }, { v: 'handsfree', l: 'Duart lira' }, { v: 'cati-rreskore', l: 'Çati rrëshqitëse / Panoramike' },
  { v: 'ngrohje-sedile', l: 'Ngrohje sediljesh' }, { v: 'tempomat', l: 'Tempomat' }, { v: 'jo-duhanpires', l: 'Jo duhanpirës' },
]
const SICHER_OPT = [{ v: 'abs', l: 'ABS' }, { v: 'airbag', l: 'Airbag' }, { v: 'librezesherbimit', l: 'Librezë shërbimi e plotë' }]

const MOTO_ART_OPT = [
  { v: 'motorrad', l: 'Motorçikleta' }, { v: 'roller', l: 'Motorroller & Skuterë' },
  { v: 'quad', l: 'Quad' }, { v: 'mofa', l: 'Mofa & Moped' },
]
const GETRIEBE_MOTO_OPT = [{ v: 'automatik', l: 'Automatik' }, { v: 'manual', l: 'Manual' }]
const ANGEBOTSTYP_OPT = [{ v: 'oferta', l: 'Ofertë' }, { v: 'kerkesa', l: 'Kërkesë' }]
const OFRUESI_OPT = [{ v: 'privat', l: 'Privat' }, { v: 'tregtar', l: 'Tregtar' }]

const EL_MARKAT: Record<string, string[]> = {
  'Celular & Telefon': ['Apple', 'Samsung', 'Huawei', 'Nokia', 'Sony', 'Xiaomi', 'Motorola', 'LG', 'HTC', 'Siemens', 'Google', 'Të tjera'],
  'Laptop':            ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Të tjera'],
  'PC':                ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Të tjera'],
  'TV & Video':        ['Samsung', 'LG', 'Sony', 'Philips', 'Të tjera'],
  'Tabletë':           ['Apple', 'Samsung', 'Huawei', 'Të tjera'],
  'Audio & Hi-Fi':     ['Sony', 'Bose', 'JBL', 'Samsung', 'Të tjera'],
  'Videolojëra':       ['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Të tjera'],
  'Foto':              ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Të tjera'],
}
const EL_GJENDJA_OPT = [
  { v: 'ri', l: 'I ri' }, { v: 'shume_mire', l: 'Shumë mirë' }, { v: 'mire', l: 'Mirë' },
  { v: 'rregull', l: 'Në rregull' }, { v: 'demtuar', l: 'I dëmtuar' },
]
const DERGESA_OPT = [
  { v: 'mundshme', l: 'Dërgesa e mundshme' }, { v: 'vetem', l: 'Vetëm marrje' },
]
const PAJISJA_OPT = [
  { v: 'pajisje', l: 'Pajisje' }, { v: 'aksesore', l: 'Aksesore' },
  { v: 'pajisje_aksesore', l: 'Pajisje & Aksesore' },
]
const NGJYRAT_OPT = [
  { v: 'zeze', l: 'Zezë' }, { v: 'bardhe', l: 'Bardhë' }, { v: 'gri', l: 'Gri' },
  { v: 'argjend', l: 'Argjend' }, { v: 'gold', l: 'Gold' }, { v: 'rozegold', l: 'Rozëgold' },
  { v: 'kalter', l: 'Kaltër' }, { v: 'gjelbер', l: 'E gjelbër' }, { v: 'kuqe', l: 'E kuqe' },
  { v: 'portokalli', l: 'Portokalli' }, { v: 'roze', l: 'Rozë' }, { v: 'vjollce', l: 'Vjollcë' },
  { v: 'bezhe', l: 'Bezhë' }, { v: 'kafe', l: 'Kafe' }, { v: 'verdhe', l: 'E verdhë' },
  { v: 'tjera', l: 'Ngjyra të tjera' },
]
const RAM_OPT = [
  { v: '4gb', l: '4 GB' }, { v: '8gb', l: '8 GB' }, { v: '16gb', l: '16 GB' }, { v: '32gb', l: '32 GB+' },
]
const OS_OPT = [{ v: 'windows', l: 'Windows' }, { v: 'macos', l: 'MacOS' }, { v: 'linux', l: 'Linux' }]
const MADHESIA_OPT = [{ v: '32', l: '32"' }, { v: '43', l: '43"' }, { v: '55', l: '55"' }, { v: '65plus', l: '65"+' }]
const AUDIO_LLOJI_OPT = [
  { v: 'kufje', l: 'Kufje' }, { v: 'altop', l: 'Altoparlant' }, { v: 'hifi', l: 'Sistem Hi-Fi' }, { v: 'tjeter', l: 'Të tjera' },
]
const LOJE_LLOJI_OPT = [{ v: 'konzol', l: 'Konzol' }, { v: 'loje', l: 'Lojë' }, { v: 'aksesore', l: 'Aksesore' }]
const FOTO_LLOJI_OPT = [{ v: 'aparat', l: 'Aparat' }, { v: 'objektiv', l: 'Objektiv' }, { v: 'aksesore', l: 'Aksesore' }]

const APT_TYPE_OPT = [
  { v: 'kat', l: 'Apartament në kat' }, { v: 'cati', l: 'Apartament në çati' },
  { v: 'perdhe', l: 'Apartament në kat përdhes' }, { v: 'nendhe', l: 'Apartament nëndhese' },
  { v: 'penthouse', l: 'Penthouse' }, { v: 'maisonette', l: 'Maisonette' },
  { v: 'loft', l: 'Loft' }, { v: 'tjeter', l: 'Të tjera' },
]
const SHKEMBIM_OPT = [{ v: 'vetem', l: 'Vetëm shkëmbim' }, { v: 'pa', l: 'Pa shkëmbim' }]
const PAJISJET_OPT = [
  { v: 'mobiluar', l: 'I mobiluar / Gjysmë i mobiluar' }, { v: 'ballkon', l: 'Ballkon' },
  { v: 'tarrace', l: 'Tarracë' }, { v: 'kuzhin-integr', l: 'Kuzhinë e integruar' },
  { v: 'vask', l: 'Vaskë banje' }, { v: 'tualet-mysafir', l: 'Tualet për mysafirë' },
  { v: 'akses-shkalle', l: 'Akses pa shkallë' }, { v: 'ngrohje-dysh', l: 'Ngrohje dyshemeje' },
]
const KARAKTERISTIKA_OPT = [
  { v: 'ndert-vjeter', l: 'Ndërtim i vjetër' }, { v: 'ndert-ri', l: 'Ndërtim i ri' },
  { v: 'ashensor', l: 'Ashensor' }, { v: 'bodrum', l: 'Bodrum' },
  { v: 'cati-ndert', l: 'Çati' }, { v: 'garazh', l: 'Garazh/Parking' },
  { v: 'kopsht', l: 'Kopsht' }, { v: 'kafsh-lejohen', l: 'Kafshë shtëpiake lejohen' },
  { v: 'bashkjetese', l: 'I përshtatshëm për bashkëjetesë' },
]

const MODE_MARKAT_VESHJE = ['Nike', 'Adidas', 'Zara', 'H&M', 'Pull&Bear', 'Bershka', 'Mango', 'Stradivarius', 'Reserved', 'C&A', 'Primark', 'Gucci', 'Louis Vuitton', 'Versace', 'Armani', 'Prada', 'Balenciaga', 'Off-White', 'Tommy Hilfiger', 'Ralph Lauren', 'Calvin Klein', 'Hugo Boss', 'Lacoste', 'Stone Island', 'The North Face', 'Champion', 'Fila', 'Puma', 'New Balance', "Levi's", 'Të tjera']
const MODE_MARKAT_KEPUCE = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Vans', 'Reebok', 'Skechers', 'Timberland', 'Dr. Martens', 'Birkenstock', 'Crocs', 'Gucci', 'Louis Vuitton', 'Prada', 'Balenciaga', 'Jimmy Choo', 'Valentino', 'Zara', 'H&M', 'Steve Madden', 'Geox', 'Ecco', 'Clarks', 'UGG', 'Salomon', 'Të tjera']
const MODE_MARKAT_CANTA  = ['Gucci', 'Louis Vuitton', 'Zara', 'H&M', 'Të tjera']
const MODE_MARKAT_ORE    = ['Rolex', 'Casio', 'Swatch', 'Fossil', 'Të tjera']
const MODE_MADHESIA_OPT  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const MODE_NUMRI_OPT     = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']
const MODE_GJENDJA_OPT   = [{ v: 'ri', l: 'I ri' }, { v: 'si_ri', l: 'Si i ri' }, { v: 'mire', l: 'I mirë' }, { v: 'perdorur', l: 'I përdorur' }]
const MODE_DERGESA_OPT   = [{ v: 'mundshme', l: 'Dërgesa e mundshme' }, { v: 'vetem', l: 'Vetëm marrje' }]
const MODE_NGJYRA_VESHJE = [{ v: 'zeze', l: 'Zezë' }, { v: 'bardhe', l: 'Bardhë' }, { v: 'gri', l: 'Gri' }, { v: 'kalter', l: 'Kaltër' }, { v: 'kuqe', l: 'E kuqe' }, { v: 'gjelbер', l: 'E gjelbër' }, { v: 'bezhe', l: 'Bezhë' }, { v: 'kafe', l: 'Kafe' }, { v: 'tjera', l: 'Ngjyra të tjera' }]
const MODE_NGJYRA_KEPUCE = [{ v: 'zeze', l: 'Zezë' }, { v: 'bardhe', l: 'Bardhë' }, { v: 'gri', l: 'Gri' }, { v: 'kalter', l: 'Kaltër' }, { v: 'kuqe', l: 'E kuqe' }, { v: 'kafe', l: 'Kafe' }, { v: 'tjera', l: 'Ngjyra të tjera' }]
const MODE_BUKURI_LLOJI  = [{ v: 'kozmetike', l: 'Kozmetikë' }, { v: 'parfum', l: 'Parfum' }, { v: 'lekure', l: 'Kujdes lëkure' }, { v: 'flok', l: 'Flok' }, { v: 'tjeter', l: 'Të tjera' }]
const MODE_CANTA_LLOJI   = [{ v: 'dore', l: 'Çantë dore' }, { v: 'shpine', l: 'Çantë shpine' }, { v: 'portofol', l: 'Portofol' }, { v: 'brez', l: 'Brez' }, { v: 'syze', l: 'Syze' }, { v: 'tjeter', l: 'Të tjera' }]
const MODE_ORE_LLOJI     = [{ v: 'ore', l: 'Orë' }, { v: 'unaze', l: 'Unazë' }, { v: 'gjerdan', l: 'Gjerdan' }, { v: 'byzylyk', l: 'Byzylyk' }, { v: 'vathe', l: 'Vathë' }, { v: 'tjeter', l: 'Të tjera' }]

export default function NdyshoForm({ listing }: { listing: Listing }) {
  const action = ndryshoNjoftimin.bind(null, listing.id)
  const [state, formAction, pending] = useActionState(action, { error: '' })
  const [selectedCategory, setSelectedCategory] = useState(listing.category)
  const [selectedSubcategory, setSelectedSubcategory] = useState(listing.subcategory)

  // ── Image state ──────────────────────────────────────────────────────────────
  const [images, setImages] = useState<ImageEntry[]>(
    (listing.images ?? []).map((url, i) => ({ id: `existing-${i}`, url }))
  )
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const dragIdx = useRef<number | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files) return
    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) return
    const selected = Array.from(files).slice(0, remaining)
    setUploadError('')
    setUploading(true)
    const supabase = createClient()

    for (const file of selected) {
      if (file.size > 10 * 1024 * 1024) { setUploadError('Foto është shumë e madhe. Maksimumi është 10 MB.'); continue }
      const allowed = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowed.includes(file.type)) { setUploadError('Lejohen vetëm JPG, PNG, WebP.'); continue }

      const mimeToExt: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
      const ext = mimeToExt[file.type] ?? 'jpg'
      const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const path = `${uid}.${ext}`

      const { error: upErr } = await supabase.storage.from('njoftimet-images').upload(path, file, { contentType: file.type })
      if (upErr) { setUploadError(`Gabim ngarkimi: ${upErr.message}`); continue }

      const { data: { publicUrl } } = supabase.storage.from('njoftimet-images').getPublicUrl(path)
      setImages(prev => [...prev, { id: uid, url: publicUrl }])
    }

    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function removeImage(id: string) {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  // Drag & drop handlers
  function onDragStart(idx: number) { dragIdx.current = idx }
  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    const from = dragIdx.current
    if (from === null || from === idx) return
    setImages(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(idx, 0, moved)
      dragIdx.current = idx
      return next
    })
  }
  function onDragEnd() { dragIdx.current = null }
  const nenkategori = KATEGORI_MAP[selectedCategory]?.nenkategori ?? []
  const isMoto = selectedSubcategory === 'Motorra' || selectedSubcategory === 'Pjesë motorrash'
  const isApartament = selectedCategory === 'imobiliare' &&
    (selectedSubcategory === 'Apartamente në shitje' || selectedSubcategory === 'Apartamente me qira')
  const isElektronik  = selectedCategory === 'elektronik'
  const elMarkat      = isElektronik ? EL_MARKAT[selectedSubcategory] : undefined
  const elHasPajisja  = isElektronik && ['Celular & Telefon', 'Laptop', 'PC', 'Tabletë'].includes(selectedSubcategory)
  const elHasNgjyra   = isElektronik && selectedSubcategory === 'Celular & Telefon'
  const elHasRam      = isElektronik && ['Laptop', 'PC'].includes(selectedSubcategory)
  const elHasOs       = isElektronik && selectedSubcategory === 'Laptop'
  const elHasMadh     = isElektronik && selectedSubcategory === 'TV & Video'
  const elLlojiOpt    = isElektronik
    ? selectedSubcategory === 'Audio & Hi-Fi' ? AUDIO_LLOJI_OPT
    : selectedSubcategory === 'Videolojëra'   ? LOJE_LLOJI_OPT
    : selectedSubcategory === 'Foto'          ? FOTO_LLOJI_OPT
    : null
    : null

  const isMode       = selectedCategory === 'mode'
  const isVeshje     = isMode && (selectedSubcategory === 'Veshje burrash' || selectedSubcategory === 'Veshje femrash')
  const isKepuce     = isMode && (selectedSubcategory === 'Këpucë burrash' || selectedSubcategory === 'Këpucë femrash')
  const isBukuriMode = isMode && selectedSubcategory === 'Bukuri & Shëndet'
  const isCanta      = isMode && selectedSubcategory === 'Çanta & Aksesore'
  const isOre        = isMode && selectedSubcategory === 'Orë & Bizhuteri'
  const modeMarka    = isVeshje ? MODE_MARKAT_VESHJE : isKepuce ? MODE_MARKAT_KEPUCE : isCanta ? MODE_MARKAT_CANTA : isOre ? MODE_MARKAT_ORE : null
  const modeNgjyrat  = isVeshje ? MODE_NGJYRA_VESHJE : isKepuce ? MODE_NGJYRA_KEPUCE : null
  const modeLlojiOpt = isBukuriMode ? MODE_BUKURI_LLOJI : isCanta ? MODE_CANTA_LLOJI : isOre ? MODE_ORE_LLOJI : null

  return (
    <section style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>

      {state.error && (
        <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: '#c0392b' }}>
          {state.error}
        </div>
      )}

      <form action={formAction}>

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #DA291C', paddingLeft: '10px', marginBottom: '20px' }}>Informacioni bazë</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Titulli i njoftimit *</label>
            <input
              name="title"
              type="text"
              defaultValue={listing.title}
              required
              style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Kategoria *</label>
            <select
              name="category"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              required
              style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
            >
              {KATEGORITË.map(k => (
                <option key={k.slug} value={k.slug}>{k.icon} {k.shortName}</option>
              ))}
            </select>
          </div>

          {nenkategori.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Nënkategoria</label>
              <select
                name="subcategory"
                value={selectedSubcategory}
                onChange={e => setSelectedSubcategory(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #ddd', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#111', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
              >
                <option value="">Zgjidh nënkategorinë (opsionale)</option>
                {nenkategori.filter(n => n !== 'Marka').map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}

        </div>

        {/* Car-specific fields */}
        {selectedCategory === 'makina' && selectedSubcategory !== 'Motorra' && (
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #DA291C', paddingLeft: '10px', marginBottom: '20px' }}>Detajet e makinës</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Marka e makinës</label>
              <select name="marka" defaultValue={listing.marka} style={inp}>
                <option value="">Zgjidh markën (opsionale)</option>
                {MARKAT_MAKINA.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Fuqia (PS)</label>
                <input name="leistung_ps" type="number" defaultValue={listing.leistung_ps ?? ''} placeholder="p.sh. 150" min="0" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Viti i prodhimit</label>
                <input name="baujahr" type="number" defaultValue={listing.baujahr ?? ''} placeholder="p.sh. 2018" min="1900" max="2026" style={inp} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Kilometrazhi</label>
              <input name="km" type="number" defaultValue={listing.km ?? ''} placeholder="p.sh. 120000" min="0" style={inp} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Karburanti</label>
              <select name="kraftstoff" defaultValue={listing.kraftstoff ?? ''} style={inp}>
                <option value="">Zgjidh</option>
                {KRAFTSTOFF_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Transmisioni</label>
                <select name="getriebe" defaultValue={listing.getriebe ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {GETRIEBE_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Tipi i automjetit</label>
                <select name="fahrzeugtyp" defaultValue={listing.fahrzeugtyp ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {TYPEN_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Numri i dyerve</label>
                <select name="tueren" defaultValue={listing.tueren ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {TUEREN_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Ngjyra</label>
                <select name="farbe" defaultValue={listing.farbe ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {FARBE_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Klasa e emisioneve</label>
              <select name="schadstoffklasse" defaultValue={listing.schadstoffklasse ?? ''} style={inp}>
                <option value="">Zgjidh</option>
                {SCHADSTOFF_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Materiali i brendshëm</label>
              <select name="innen_material" defaultValue={listing.innen_material ?? ''} style={inp}>
                <option value="">Zgjidh</option>
                {MATERIAL_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '10px' }}>Pajisjet e jashtme</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {AUSSTATTUNG_OPT.map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#111' }}>
                    <input type="checkbox" name="ausstattung" value={o.v} defaultChecked={listing.ausstattung?.includes(o.v)} style={{ width: '16px', height: '16px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '10px' }}>Pajisjet e brendshme</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {INNEN_OPT.map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#111' }}>
                    <input type="checkbox" name="innen_ausstattung" value={o.v} defaultChecked={listing.innen_ausstattung?.includes(o.v)} style={{ width: '16px', height: '16px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '10px' }}>Siguria</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {SICHER_OPT.map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#111' }}>
                    <input type="checkbox" name="sicherheit" value={o.v} defaultChecked={listing.sicherheit?.includes(o.v)} style={{ width: '16px', height: '16px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Motorra-specific fields */}
        {selectedCategory === 'makina' && selectedSubcategory === 'Motorra' && (
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #DA291C', paddingLeft: '10px', marginBottom: '20px' }}>Detajet e motorrës</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Marka e motorrës</label>
              <select name="marka" defaultValue={listing.marka} style={inp}>
                <option value="">Zgjidh markën (opsionale)</option>
                {MARKAT_MOTOCIKLETA.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Fuqia (PS)</label>
                <input name="leistung_ps" type="number" defaultValue={listing.leistung_ps ?? ''} placeholder="p.sh. 80" min="0" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Viti i prodhimit</label>
                <input name="baujahr" type="number" defaultValue={listing.baujahr ?? ''} placeholder="p.sh. 2018" min="1900" max="2026" style={inp} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Kilometrazhi</label>
              <input name="km" type="number" defaultValue={listing.km ?? ''} placeholder="p.sh. 30000" min="0" style={inp} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Lloji i mjetit</label>
              <select name="moto_art" defaultValue={listing.moto_art ?? ''} style={inp}>
                <option value="">Zgjidh llojin</option>
                {MOTO_ART_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Cilindrata (cc)</label>
                <input name="cilindrata" type="number" defaultValue={listing.cilindrata ?? ''} placeholder="p.sh. 600" min="0" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Këmbëzënia</label>
                <select name="getriebe" defaultValue={listing.getriebe ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {GETRIEBE_MOTO_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Kontrolli teknik (viti)</label>
                <input name="hu_gueltig" type="number" defaultValue={listing.hu_gueltig ?? ''} placeholder="p.sh. 2026" min="2000" max="2040" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Lloji i ofertës</label>
                <select name="angebotstyp" defaultValue={listing.angebotstyp ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {ANGEBOTSTYP_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Ofruesi</label>
              <select name="ofruesi" defaultValue={listing.ofruesi ?? ''} style={inp}>
                <option value="">Zgjidh</option>
                {OFRUESI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Apartment-specific fields */}
        {isApartament && (
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #DA291C', paddingLeft: '10px', marginBottom: '20px' }}>Detajet e apartamentit</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Tipi i apartamentit</label>
              <select name="apt_type" defaultValue={listing.apt_type ?? ''} style={inp}>
                <option value="">Zgjidh tipin (opsionale)</option>
                {APT_TYPE_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Sipërfaqja (m²)</label>
                <input name="siperfaqja" type="number" defaultValue={listing.siperfaqja ?? ''} placeholder="p.sh. 75" min="0" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Dhoma</label>
                <input name="dhoma" type="number" defaultValue={listing.dhoma ?? ''} placeholder="p.sh. 3" min="0" style={inp} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Kati</label>
                <input name="kati" type="number" defaultValue={listing.kati ?? ''} placeholder="p.sh. 4" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Disponueshëm nga</label>
                <input name="disponueshem" type="date" defaultValue={listing.disponueshem ?? ''} style={inp} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Lloji i ofertës</label>
                <select name="angebotstyp" defaultValue={listing.angebotstyp ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {ANGEBOTSTYP_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Ofruesi</label>
                <select name="ofruesi" defaultValue={listing.ofruesi ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {OFRUESI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Shkëmbim</label>
              <select name="shkembim" defaultValue={listing.shkembim ?? ''} style={inp}>
                <option value="">Zgjidh</option>
                {SHKEMBIM_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '10px' }}>Pajisjet</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {PAJISJET_OPT.map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#111' }}>
                    <input type="checkbox" name="pajisjet" value={o.v} defaultChecked={listing.pajisjet?.includes(o.v)} style={{ width: '16px', height: '16px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '10px' }}>Karakteristika të përgjithshme</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {KARAKTERISTIKA_OPT.map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#111' }}>
                    <input type="checkbox" name="karakteristika" value={o.v} defaultChecked={listing.karakteristika?.includes(o.v)} style={{ width: '16px', height: '16px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Elektronik-specific fields */}
        {isElektronik && (
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #DA291C', paddingLeft: '10px', marginBottom: '20px' }}>Detajet e pajisjes</h2>

            {elMarkat && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Marka</label>
                <select name="marka" defaultValue={listing.marka ?? ''} style={inp}>
                  <option value="">Zgjidh markën (opsionale)</option>
                  {elMarkat.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {elHasPajisja && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Pajisja</label>
                <select name="pajisja" defaultValue={listing.pajisja ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {PAJISJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {elHasNgjyra && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Ngjyra</label>
                <select name="ngjyra" defaultValue={listing.ngjyra ?? ''} style={inp}>
                  <option value="">Zgjidh ngjyrën</option>
                  {NGJYRAT_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {elHasRam && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>RAM</label>
                <select name="ram" defaultValue={listing.ram ?? ''} style={inp}>
                  <option value="">Zgjidh RAM-in</option>
                  {RAM_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {elHasOs && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Sistemi operativ</label>
                <select name="os" defaultValue={listing.os ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {OS_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {elHasMadh && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Madhësia</label>
                <select name="madhesia" defaultValue={listing.madhesia ?? ''} style={inp}>
                  <option value="">Zgjidh madhësinë</option>
                  {MADHESIA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {elLlojiOpt && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Lloji</label>
                <select name="el_lloji" defaultValue={listing.el_lloji ?? ''} style={inp}>
                  <option value="">Zgjidh llojin</option>
                  {elLlojiOpt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Gjendja</label>
              <select name="zustand" defaultValue={listing.zustand ?? ''} style={inp}>
                <option value="">Zgjidh gjendjen</option>
                {EL_GJENDJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Lloji i ofertës</label>
                <select name="angebotstyp" defaultValue={listing.angebotstyp ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {ANGEBOTSTYP_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Ofruesi</label>
                <select name="ofruesi" defaultValue={listing.ofruesi ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {OFRUESI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Dërgesa</label>
              <select name="dergesa" defaultValue={listing.dergesa ?? ''} style={inp}>
                <option value="">Zgjidh</option>
                {DERGESA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Modë-specific fields */}
        {isMode && (
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #DA291C', paddingLeft: '10px', marginBottom: '20px' }}>Detajet e produktit</h2>

            {modeMarka && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Marka</label>
                <select name="marka" defaultValue={listing.marka ?? ''} style={inp}>
                  <option value="">Zgjidh markën</option>
                  {modeMarka.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {modeLlojiOpt && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Lloji</label>
                <select name="mode_lloji" defaultValue={listing.mode_lloji ?? ''} style={inp}>
                  <option value="">Zgjidh llojin</option>
                  {modeLlojiOpt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isVeshje && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Madhësia</label>
                <select name="madhesia" defaultValue={listing.madhesia ?? ''} style={inp}>
                  <option value="">Zgjidh madhësinë</option>
                  {MODE_MADHESIA_OPT.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {isKepuce && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Numri</label>
                <select name="numri_kepuces" defaultValue={listing.numri_kepuces ?? ''} style={inp}>
                  <option value="">Zgjidh numrin</option>
                  {MODE_NUMRI_OPT.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}

            {modeNgjyrat && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Ngjyra</label>
                <select name="ngjyra" defaultValue={listing.ngjyra ?? ''} style={inp}>
                  <option value="">Zgjidh ngjyrën</option>
                  {modeNgjyrat.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Gjendja</label>
              <select name="zustand" defaultValue={listing.zustand ?? ''} style={inp}>
                <option value="">Zgjidh gjendjen</option>
                {MODE_GJENDJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Lloji i ofertës</label>
                <select name="angebotstyp" defaultValue={listing.angebotstyp ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {ANGEBOTSTYP_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Ofruesi</label>
                <select name="ofruesi" defaultValue={listing.ofruesi ?? ''} style={inp}>
                  <option value="">Zgjidh</option>
                  {OFRUESI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Dërgesa</label>
              <select name="dergesa" defaultValue={listing.dergesa ?? ''} style={inp}>
                <option value="">Zgjidh</option>
                {MODE_DERGESA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #DA291C', paddingLeft: '10px', marginBottom: '20px' }}>Çmimi dhe vendndodhja</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Çmimi (€) *</label>
              <input
                name="price"
                type="number"
                defaultValue={listing.price}
                required
                min="0"
                style={inp}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111', marginBottom: '6px' }}>Qyteti *</label>
              <select
                name="city"
                defaultValue={listing.city}
                required
                style={inp}
              >
                <optgroup label="Shqipëri">
                  {QYTETET_SHQIPERI.map(q => <option key={q} value={q}>{q}</option>)}
                </optgroup>
                <optgroup label="Kosovë">
                  {QYTETET_KOSOVE.map(q => <option key={q} value={q}>{q}</option>)}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #DA291C', paddingLeft: '10px', marginBottom: '20px' }}>Përshkrimi</h2>
          <textarea
            name="description"
            defaultValue={listing.description}
            rows={5}
            required
            style={{ ...inp, resize: 'vertical' }}
          />
        </div>

        {/* ── Foto ─────────────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111', borderLeft: '3px solid #DA291C', paddingLeft: '10px', marginBottom: '4px' }}>Foto</h2>
          <p style={{ fontSize: '12px', color: '#86868B', marginBottom: '16px' }}>
            Deri në {MAX_IMAGES} foto · Zvarrit për të ndryshuar rendin · E para është kryesorja
          </p>

          {uploadError && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '13px', color: '#c0392b' }}>
              {uploadError}
            </div>
          )}

          {/* Hidden inputs — one per image URL, in order */}
          {images.map(img => (
            <input key={img.id} type="hidden" name="image_url" value={img.url} />
          ))}

          {/* Grid */}
          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '14px' }}>
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={e => onDragOver(e, idx)}
                  onDragEnd={onDragEnd}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: idx === 0 ? '2.5px solid #DA291C' : '1.5px solid rgba(0,0,0,0.08)',
                    cursor: 'grab',
                    userSelect: 'none',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />

                  {idx === 0 && (
                    <span style={{
                      position: 'absolute', bottom: '4px', left: '4px',
                      background: '#DA291C', color: '#fff',
                      fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: '700',
                      pointerEvents: 'none',
                    }}>
                      KRYESORJA
                    </span>
                  )}

                  {/* Drag handle hint */}
                  <span style={{
                    position: 'absolute', top: '4px', left: '4px',
                    color: 'rgba(255,255,255,0.8)', fontSize: '11px', lineHeight: 1,
                    pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}>⠿</span>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    style={{
                      position: 'absolute', top: '4px', right: '4px',
                      background: 'rgba(0,0,0,0.55)', color: '#fff',
                      border: 'none', borderRadius: '50%',
                      width: '20px', height: '20px',
                      fontSize: '14px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      lineHeight: 1, padding: 0, fontFamily: 'inherit',
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          )}

          {/* Upload zone */}
          {images.length < MAX_IMAGES && (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed rgba(0,0,0,0.12)', borderRadius: '10px',
                padding: '24px', textAlign: 'center', cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = '#DA291C' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)' }}
            >
              {uploading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: '#86868B' }}>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #ccc', borderTopColor: '#DA291C', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Duke ngarkuar...
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1D1D1F', margin: '0 0 4px' }}>+ Shto foto</p>
                  <p style={{ fontSize: '12px', color: '#86868B', margin: 0 }}>
                    PNG, JPG, WebP deri në 10MB · {MAX_IMAGES - images.length} foto mbetur
                  </p>
                </>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="/profil"
            style={{ flex: 1, background: '#fff', color: '#111', border: '1.5px solid #ddd', padding: '14px', fontSize: '15px', fontWeight: '500', borderRadius: '8px', textDecoration: 'none', textAlign: 'center' }}
          >
            Anulo
          </a>
          <button
            type="submit"
            disabled={pending || uploading}
            style={{ flex: 2, background: (pending || uploading) ? '#999' : '#DA291C', color: '#fff', border: 'none', padding: '14px', fontSize: '15px', fontWeight: '500', borderRadius: '8px', cursor: (pending || uploading) ? 'not-allowed' : 'pointer' }}
          >
            {pending ? 'Duke ruajtur...' : uploading ? 'Duke ngarkuar foton...' : 'Ruaj ndryshimet'}
          </button>
        </div>

      </form>
    </section>
  )
}
