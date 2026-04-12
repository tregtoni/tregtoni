'use client'

import { useActionState, useState, useRef } from 'react'
import { shtoNjoftim } from '@/app/actions/njoftimet'
import { createClient } from '@/lib/supabase/client'
import { KATEGORITË, KATEGORI_MAP, MARKAT_MAKINA, MARKAT_MOTOCIKLETA, QYTETET_SHQIPERI, QYTETET_KOSOVE } from '@/lib/kategori-data'

const KRAFTSTOFF_OPT = [
  { v: 'benzine',  l: 'Benzinë' },
  { v: 'diesel',   l: 'Diesel' },
  { v: 'cng',      l: 'Gas natyror (CNG)' },
  { v: 'lpg',      l: 'Gaz i lëngshëm (LPG)' },
  { v: 'hybrid',   l: 'Hibrid' },
  { v: 'elektrik', l: 'Elektrik' },
  { v: 'tjeter',   l: 'Tjetër' },
]

const GETRIEBE_OPT = [
  { v: 'automatik', l: 'Automatik' },
  { v: 'manual',    l: 'Manual' },
]

const TYPEN_OPT = [
  { v: 'mikro',     l: 'Mikro' },
  { v: 'limuzine',  l: 'Limuzinë' },
  { v: 'kombi',     l: 'Kombi' },
  { v: 'kabriolet', l: 'Kabriolet' },
  { v: 'suv',       l: 'SUV / Terrenor' },
  { v: 'van',       l: 'Van / Bus' },
  { v: 'coupe',     l: 'Kupé' },
  { v: 'tjeter',    l: 'Tjetër' },
]

const TUEREN_OPT = [
  { v: '2-3',    l: '2 / 3 dyer' },
  { v: '4-5',    l: '4 / 5 dyer' },
  { v: '6-7',    l: '6 / 7 dyer' },
  { v: 'tjeter', l: 'Tjetër' },
]


const SCHADSTOFF_OPT = [
  { v: 'euro1', l: 'Euro 1' }, { v: 'euro2', l: 'Euro 2' },
  { v: 'euro3', l: 'Euro 3' }, { v: 'euro4', l: 'Euro 4' },
  { v: 'euro5', l: 'Euro 5' }, { v: 'euro6', l: 'Euro 6' },
]

const MATERIAL_OPT = [
  { v: 'leder',         l: 'Lëkurë e plotë' },
  { v: 'gjysem-leder',  l: 'Gjysmë lëkurë' },
  { v: 'stof',          l: 'Stof' },
  { v: 'velur',         l: 'Velur' },
  { v: 'alcantara',     l: 'Alcantara' },
  { v: 'tjeter',        l: 'Tjetër' },
]

const FARBE_OPT = [
  { v: 'bezhe',      l: 'Bezhë' },
  { v: 'blu',        l: 'Blu' },
  { v: 'kafe',       l: 'Kafe' },
  { v: 'verdhe',     l: 'Verdhë' },
  { v: 'ari',        l: 'Ari' },
  { v: 'gri',        l: 'Gri' },
  { v: 'jeshile',    l: 'Jeshile' },
  { v: 'portokalli', l: 'Portokalli' },
  { v: 'kuqe',       l: 'Kuqe' },
  { v: 'zi',         l: 'Zi' },
  { v: 'argjende',   l: 'Argjendë' },
  { v: 'vjollce',    l: 'Vjollcë' },
  { v: 'bardhe',     l: 'Bardhë' },
  { v: 'tjeter',     l: 'Tjetër' },
]

const AUSSTATTUNG_OPT = [
  { v: 'grep',                     l: 'Grep tërheqursi' },
  { v: 'sensor-parkimit',          l: 'Sensor parkimi' },
  { v: 'felge-alu',                l: 'Felgë alumini' },
  { v: 'xenon-led',                l: 'Xenon / LED dritat' },
  { v: 'kamera-360',               l: 'Kamera 360°' },
  { v: 'cati-panoramike',          l: 'Çati panoramike' },
  { v: 'ngrohje-sedile',           l: 'Ngrohje sediljesh' },
  { v: 'ngrohje-timoni',           l: 'Ngrohje timoni' },
  { v: 'asistues-parkimi-perpara', l: 'Asistues parkimi përpara' },
  { v: 'asistues-parkimi-prapa',   l: 'Asistues parkimi prapa' },
  { v: 'kamera-parkimi',           l: 'Kamera parkimi' },
  { v: 'asistues-kendi-verber',    l: 'Asistues këndi i verbër' },
  { v: 'asistues-shiriti',         l: 'Asistues mbajtje shiriti' },
  { v: 'head-up-display',          l: 'Head-Up Display' },
  { v: 'ndricim-ambiental',        l: 'Ndriçim ambiental' },
  { v: 'ndenjese-elektrike',       l: 'Ndenjëse elektrike' },
  { v: 'ndenjese-masazhi',         l: 'Ndenjëse masazhi' },
  { v: 'carplay-android',          l: 'Apple CarPlay / Android Auto' },
  { v: 'karikues-wireless',        l: 'Karikues wireless' },
  { v: 'ngrohje-parkimi',          l: 'Ngrohje parkimi' },
  { v: 'grep-rimorkio',            l: 'Grep rimorkio' },
  { v: 'rel-catie',                l: 'Rel çatie' },
  { v: 'portbagazhik-elektrik',    l: 'Portbagazhik elektrik' },
  { v: 'keyless-entry',            l: 'Keyless Entry' },
]

const INNEN_OPT = [
  { v: 'klima',          l: 'Klimë' },
  { v: 'navigim',        l: 'Sistem navigimi' },
  { v: 'radio',          l: 'Radio / Tuner' },
  { v: 'bluetooth',      l: 'Bluetooth' },
  { v: 'handsfree',      l: 'Duart lira' },
  { v: 'cati-rreskore',  l: 'Çati rrëshqitëse / Panoramike' },
  { v: 'ngrohje-sedile', l: 'Ngrohje sediljesh' },
  { v: 'tempomat',       l: 'Tempomat' },
  { v: 'jo-duhanpires',  l: 'Jo duhanpirës' },
]

const SICHER_OPT = [
  { v: 'abs',                   l: 'ABS' },
  { v: 'airbag',                l: 'Airbag' },
  { v: 'librezesherbimit',      l: 'Librezë shërbimi e plotë' },
  { v: 'frenim-emergjence',     l: 'Frenim automatik emergjence' },
  { v: 'sinjalizues-perplasje', l: 'Sinjalizues përplasje' },
  { v: 'njohje-lodhje',         l: 'Njohje lodhje' },
  { v: 'njohje-sinjalistike',   l: 'Njohje sinjalistikës rrugore' },
  { v: 'kufizues-shpejtesie',   l: 'Kufizues adaptiv shpejtësie' },
  { v: 'asistues-dritat',       l: 'Asistues dritat e largëta' },
  { v: 'kontroll-presioni',     l: 'Kontroll presioni gomave' },
  { v: 'asistues-pjerresi',     l: 'Asistues nisje në pjerrësi' },
]

const MOTO_ART_OPT = [
  { v: 'motorrad',  l: 'Motorçikleta' },
  { v: 'roller',    l: 'Motorroller & Skuterë' },
  { v: 'quad',      l: 'Quad' },
  { v: 'mofa',      l: 'Mofa & Moped' },
]

const GETRIEBE_MOTO_OPT = [
  { v: 'automatik', l: 'Automatik' },
  { v: 'manual',    l: 'Manual' },
]

const ANGEBOTSTYP_OPT = [
  { v: 'oferta',  l: 'Ofertë' },
  { v: 'kerkesa', l: 'Kërkesë' },
]

const OFRUESI_OPT = [
  { v: 'privat',  l: 'Privat' },
  { v: 'tregtar', l: 'Tregtar' },
]

const APT_TYPE_OPT = [
  { v: 'kat',        l: 'Apartament në kat' },
  { v: 'cati',       l: 'Apartament në çati' },
  { v: 'perdhe',     l: 'Apartament në kat përdhes' },
  { v: 'nendhe',     l: 'Apartament nëndhese' },
  { v: 'penthouse',  l: 'Penthouse' },
  { v: 'maisonette', l: 'Maisonette' },
  { v: 'loft',       l: 'Loft' },
  { v: 'tjeter',     l: 'Të tjera' },
]

const SHKEMBIM_OPT = [
  { v: 'vetem', l: 'Vetëm shkëmbim' },
  { v: 'pa',    l: 'Pa shkëmbim' },
]

const PAJISJET_OPT = [
  { v: 'mobiluar',       l: 'I mobiluar / Gjysmë i mobiluar' },
  { v: 'ballkon',        l: 'Ballkon' },
  { v: 'tarrace',        l: 'Tarracë' },
  { v: 'kuzhin-integr',  l: 'Kuzhinë e integruar' },
  { v: 'vask',           l: 'Vaskë banje' },
  { v: 'tualet-mysafir', l: 'Tualet për mysafirë' },
  { v: 'akses-shkalle',  l: 'Akses pa shkallë' },
  { v: 'ngrohje-dysh',   l: 'Ngrohje dyshemeje' },
]

const KARAKTERISTIKA_OPT = [
  { v: 'ndert-vjeter',  l: 'Ndërtim i vjetër' },
  { v: 'ndert-ri',      l: 'Ndërtim i ri' },
  { v: 'ashensor',      l: 'Ashensor' },
  { v: 'bodrum',        l: 'Bodrum' },
  { v: 'cati-ndert',    l: 'Çati' },
  { v: 'garazh',        l: 'Garazh/Parking' },
  { v: 'kopsht',        l: 'Kopsht' },
  { v: 'kafsh-lejohen', l: 'Kafshë shtëpiake lejohen' },
  { v: 'bashkjetese',   l: 'I përshtatshëm për bashkëjetesë' },
]

// ─── Elektronik constants ─────────────────────────────────────────────────────

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
  { v: 'ri',         l: 'I ri' },
  { v: 'shume_mire', l: 'Shumë mirë' },
  { v: 'mire',       l: 'Mirë' },
  { v: 'rregull',    l: 'Në rregull' },
  { v: 'demtuar',    l: 'I dëmtuar' },
]

const DERGESA_OPT = [
  { v: 'mundshme', l: 'Dërgesa e mundshme' },
  { v: 'vetem',    l: 'Vetëm marrje' },
]

const PAJISJA_OPT = [
  { v: 'pajisje',          l: 'Pajisje' },
  { v: 'aksesore',         l: 'Aksesore' },
  { v: 'pajisje_aksesore', l: 'Pajisje & Aksesore' },
]

const NGJYRAT_OPT = [
  { v: 'zeze',       l: 'Zezë' },
  { v: 'bardhe',     l: 'Bardhë' },
  { v: 'gri',        l: 'Gri' },
  { v: 'argjend',    l: 'Argjend' },
  { v: 'gold',       l: 'Gold' },
  { v: 'rozegold',   l: 'Rozëgold' },
  { v: 'kalter',     l: 'Kaltër' },
  { v: 'gjelbер',    l: 'E gjelbër' },
  { v: 'kuqe',       l: 'E kuqe' },
  { v: 'portokalli', l: 'Portokalli' },
  { v: 'roze',       l: 'Rozë' },
  { v: 'vjollce',    l: 'Vjollcë' },
  { v: 'bezhe',      l: 'Bezhë' },
  { v: 'kafe',       l: 'Kafe' },
  { v: 'verdhe',     l: 'E verdhë' },
  { v: 'tjera',      l: 'Ngjyra të tjera' },
]

const RAM_OPT = [
  { v: '4gb',  l: '4 GB' },
  { v: '8gb',  l: '8 GB' },
  { v: '16gb', l: '16 GB' },
  { v: '32gb', l: '32 GB+' },
]

const OS_OPT = [
  { v: 'windows', l: 'Windows' },
  { v: 'macos',   l: 'MacOS' },
  { v: 'linux',   l: 'Linux' },
]

const MADHESIA_OPT = [
  { v: '32',     l: '32"' },
  { v: '43',     l: '43"' },
  { v: '55',     l: '55"' },
  { v: '65plus', l: '65"+' },
]

const AUDIO_LLOJI_OPT = [
  { v: 'kufje',  l: 'Kufje' },
  { v: 'altop',  l: 'Altoparlant' },
  { v: 'hifi',   l: 'Sistem Hi-Fi' },
  { v: 'tjeter', l: 'Të tjera' },
]

const LOJE_LLOJI_OPT = [
  { v: 'konzol',   l: 'Konzol' },
  { v: 'loje',     l: 'Lojë' },
  { v: 'aksesore', l: 'Aksesore' },
]

const FOTO_LLOJI_OPT = [
  { v: 'aparat',   l: 'Aparat' },
  { v: 'objektiv', l: 'Objektiv' },
  { v: 'aksesore', l: 'Aksesore' },
]

// ─── Punë constants ───────────────────────────────────────────────────────────

const LLOJI_PUNES_OPT = [
  { v: 'fulltime',  l: 'Full-time' },
  { v: 'parttime',  l: 'Part-time' },
  { v: 'freelance', l: 'Freelance' },
  { v: 'praktike',  l: 'Praktikë' },
]

const FUSHA_OPT = [
  { v: 'ngrohje-ftohje', l: 'Instalime ngrohje & ftohje' },
  { v: 'elektrik',       l: 'Elektrik' },
  { v: 'hidraulike',     l: 'Hidraulikë' },
  { v: 'ndertim',        l: 'Ndërtim' },
  { v: 'lyerje',         l: 'Lyerje' },
  { v: 'marangoz',       l: 'Marangoz' },
  { v: 'mekanik',        l: 'Mekanik' },
  { v: 'suvatim',        l: 'Suvatim' },
  { v: 'pllakosje',      l: 'Pllakosje' },
  { v: 'catite',         l: 'Çatitë' },
  { v: 'saldator',       l: 'Saldator' },
  { v: 'alumin-pvc',     l: 'Alumin & PVC' },
  { v: 'elektroshtep',   l: 'Elektroshtëpiake' },
  { v: 'pastrim',        l: 'Pastrim' },
  { v: 'kopshtari',      l: 'Kopshtari' },
  { v: 'zhvendosje',     l: 'Zhvendosje' },
  { v: 'tjeter',         l: 'Të tjera' },
]

const LLOJI_VOZ_OPT = [
  { v: 'kamion',    l: 'Kamion' },
  { v: 'furgon',    l: 'Furgon' },
  { v: 'makine',    l: 'Makinë' },
  { v: 'mociklete', l: 'Motoçikletë' },
]

const PATENTA_OPT = [
  { v: 'b', l: 'B' }, { v: 'c', l: 'C' }, { v: 'd', l: 'D' }, { v: 'e', l: 'E' },
]

const ROLI_OPT = [
  { v: 'kuzhinier',    l: 'Kuzhinier' },
  { v: 'kamarier',     l: 'Kamarier' },
  { v: 'recepsionist', l: 'Recepsionist' },
  { v: 'menaxher',     l: 'Menaxher' },
  { v: 'tjeter',       l: 'Të tjera' },
]

const GJUHA_OPT = [
  { v: 'shqip',       l: 'Shqip' },
  { v: 'anglisht',    l: 'Anglisht' },
  { v: 'gjermanisht', l: 'Gjermanisht' },
  { v: 'italisht',    l: 'Italisht' },
  { v: 'tjeter',      l: 'Të tjera' },
]

const LLOJI_SHITJES_OPT = [
  { v: 'online',   l: 'Online' },
  { v: 'dyqan',    l: 'Në dyqan' },
  { v: 'te_dyja',  l: 'Të dyja' },
]

// ─── Shërbime constants ───────────────────────────────────────────────────────

const SHERBIME_LLOJI_PER_NEN: Record<string, { v: string; l: string }[]> = {
  'Zhvendosje & Transport': [
    { v: 'zhvendosje', l: 'Zhvendosje' }, { v: 'transport', l: 'Transport mallrash' },
    { v: 'transferte', l: 'Transfertë' }, { v: 'tjeter', l: 'Të tjera' },
  ],
  'Artistë & Muzikantë': [
    { v: 'muzikant', l: 'Muzikant' }, { v: 'fotograf', l: 'Fotograf' },
    { v: 'videograf', l: 'Videograf' }, { v: 'dj', l: 'DJ' },
    { v: 'kengëtar', l: 'Këngëtar' }, { v: 'aktor', l: 'Aktor' },
    { v: 'orkester', l: 'Orkester dasmash' }, { v: 'tjeter', l: 'Të tjera' },
  ],
  'Udhëtime & Evente': [
    { v: 'evente', l: 'Organizim eventesh' }, { v: 'dasma', l: 'Dasma' },
    { v: 'udhetim', l: 'Udhëtim' }, { v: 'hotele', l: 'Hotele' }, { v: 'tjeter', l: 'Të tjera' },
  ],
  'Auto & Biçikleta': [
    { v: 'riparim', l: 'Riparim' }, { v: 'servis', l: 'Servis' },
    { v: 'larje', l: 'Larje' }, { v: 'tjeter', l: 'Të tjera' },
  ],
  'Kujdes kafshësh': [
    { v: 'veteriner', l: 'Veteriner' }, { v: 'rruajtje', l: 'Rruajtje' },
    { v: 'strehim', l: 'Strehim' }, { v: 'shetitje', l: 'Shëtitje' }, { v: 'tjeter', l: 'Të tjera' },
  ],
  'Kujdes fëmijësh': [
    { v: 'kujdestare', l: 'Kujdestare' }, { v: 'cerdhe', l: 'Çerdhe' },
    { v: 'mesues', l: 'Mësues privat' }, { v: 'tjeter', l: 'Të tjera' },
  ],
  'Kujdes pleqsh': [
    { v: 'shtepie', l: 'Kujdes në shtëpi' }, { v: 'qender', l: 'Qendër kujdesi' },
    { v: 'tjeter', l: 'Të tjera' },
  ],
  'Shtëpi & Kopsht': [
    { v: 'pastrimi', l: 'Pastrimi' }, { v: 'riparime', l: 'Riparime' },
    { v: 'kopshtari', l: 'Kopshtari' }, { v: 'tjeter', l: 'Të tjera' },
  ],
  'Elektronik': [
    { v: 'riparim', l: 'Riparim' }, { v: 'instalim', l: 'Instalim' }, { v: 'tjeter', l: 'Të tjera' },
  ],
}

// ─── Modë constants ───────────────────────────────────────────────────────────

const MODE_GJENDJA_OPT = [
  { v: 'ri',       l: 'I ri' },
  { v: 'si_ri',    l: 'Si i ri' },
  { v: 'mire',     l: 'I mirë' },
  { v: 'perdorur', l: 'I përdorur' },
]

const MODE_DERGESA_OPT = [
  { v: 'mundshme', l: 'Dërgesa e mundshme' },
  { v: 'vetem',    l: 'Vetëm marrje' },
]

const MARKAT_VESHJE = [
  'Nike', 'Adidas', 'Zara', 'H&M', 'Pull&Bear', 'Bershka', 'Mango',
  'Stradivarius', 'Reserved', 'C&A', 'Primark', 'Gucci', 'Louis Vuitton',
  'Versace', 'Armani', 'Prada', 'Balenciaga', 'Off-White', 'Tommy Hilfiger',
  'Ralph Lauren', 'Calvin Klein', 'Hugo Boss', 'Lacoste', 'Stone Island',
  'The North Face', 'Champion', 'Fila', 'Puma', 'New Balance', "Levi's", 'Të tjera',
]

const MARKAT_KEPUCE = [
  'Nike', 'Adidas', 'Puma', 'New Balance', 'Converse', 'Vans', 'Reebok',
  'Skechers', 'Timberland', 'Dr. Martens', 'Birkenstock', 'Crocs',
  'Gucci', 'Louis Vuitton', 'Prada', 'Balenciaga', 'Jimmy Choo', 'Valentino',
  'Zara', 'H&M', 'Steve Madden', 'Geox', 'Ecco', 'Clarks', 'UGG', 'Salomon', 'Të tjera',
]

const MARKAT_CANTA = ['Gucci', 'Louis Vuitton', 'Zara', 'H&M', 'Të tjera']
const MARKAT_ORE   = ['Rolex', 'Casio', 'Swatch', 'Fossil', 'Të tjera']

const MADHESIA_VESHJE = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const NUMRI_KEPUCE    = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']

const NGJYRA_VESHJE_OPT = [
  { v: 'zeze',    l: 'Zezë' }, { v: 'bardhe', l: 'Bardhë' }, { v: 'gri', l: 'Gri' },
  { v: 'kalter',  l: 'Kaltër' }, { v: 'kuqe', l: 'E kuqe' }, { v: 'gjelbеr', l: 'E gjelbër' },
  { v: 'bezhe',   l: 'Bezhë' }, { v: 'kafe', l: 'Kafe' }, { v: 'tjera', l: 'Ngjyra të tjera' },
]

const NGJYRA_KEPUCE_OPT = [
  { v: 'zeze',   l: 'Zezë' }, { v: 'bardhe', l: 'Bardhë' }, { v: 'gri', l: 'Gri' },
  { v: 'kalter', l: 'Kaltër' }, { v: 'kuqe', l: 'E kuqe' }, { v: 'kafe', l: 'Kafe' },
  { v: 'tjera',  l: 'Ngjyra të tjera' },
]

const BUKURI_LLOJI_OPT = [
  { v: 'kozmetike', l: 'Kozmetikë' }, { v: 'parfum', l: 'Parfum' },
  { v: 'lekure', l: 'Kujdes lëkure' }, { v: 'flok', l: 'Flok' }, { v: 'tjeter', l: 'Të tjera' },
]

const CANTA_LLOJI_OPT = [
  { v: 'dore', l: 'Çantë dore' }, { v: 'shpine', l: 'Çantë shpine' },
  { v: 'portofol', l: 'Portofol' }, { v: 'brez', l: 'Brez' },
  { v: 'syze', l: 'Syze' }, { v: 'tjeter', l: 'Të tjera' },
]

const ORE_LLOJI_OPT = [
  { v: 'ore', l: 'Orë' }, { v: 'unaze', l: 'Unazë' }, { v: 'gjerdan', l: 'Gjerdan' },
  { v: 'byzylyk', l: 'Byzylyk' }, { v: 'vathe', l: 'Vathë' }, { v: 'tjeter', l: 'Të tjera' },
]

// ─── Fëmijë constants ─────────────────────────────────────────────────────────

const FEMIJE_GJENDJA_OPT = [
  { v: 'e_re',       l: 'E re' },
  { v: 'si_e_re',    l: 'Si e re' },
  { v: 'mire',       l: 'Mirë' },
  { v: 'me_defekte', l: 'Me defekte' },
]

const FEMIJE_MOSHA_OPT = [
  { v: '0-1',    l: '0–1 vjeç' },
  { v: '1-3',    l: '1–3 vjeç' },
  { v: '3-6',    l: '3–6 vjeç' },
  { v: '6-10',   l: '6–10 vjeç' },
  { v: '10-14',  l: '10–14 vjeç' },
  { v: '14plus', l: '14+ vjeç' },
]

const FEMIJE_GJINIA_OPT = [
  { v: 'djale',   l: 'Djalë' },
  { v: 'vajze',   l: 'Vajzë' },
  { v: 'uniseks', l: 'Uniseks' },
]

const FEMIJE_MADHESIA_VESHJE = [
  '56', '62', '68', '74', '80', '86', '92', '98',
  '104', '110', '116', '122', '128', '134', '140', '146', '152', '158', '164',
]

const FEMIJE_MADHESIA_KEPUCE = [
  '16', '17', '18', '19', '20', '21', '22', '23', '24',
  '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38',
]

const FEMIJE_LLOJI_LODRA_OPT = [
  { v: 'edukative',   l: 'Edukative' },
  { v: 'elektronike', l: 'Elektronike' },
  { v: 'krijuese',    l: 'Krijuese' },
  { v: 'tjera',       l: 'Të tjera' },
]

// ─── Bileta constants ─────────────────────────────────────────────────────────

const BILETA_LLOJI_SALLE_OPT = [
  { v: 'natyre', l: 'Në natyrë' },
  { v: 'salle',  l: 'Në sallë' },
]

const BILETA_LLOJI_TRANSPORTI_OPT = [
  { v: 'autobus',  l: 'Autobus' },
  { v: 'tren',     l: 'Tren' },
  { v: 'aeroplan', l: 'Aeroplan' },
  { v: 'anije',    l: 'Anije' },
]

const BILETA_LLOJI_SPORTI_OPT = [
  { v: 'futboll',     l: 'Futboll' },
  { v: 'basketboll',  l: 'Basketboll' },
  { v: 'volejboll',   l: 'Volejboll' },
  { v: 'tenis',       l: 'Tenis' },
  { v: 'natacion',    l: 'Natacion' },
  { v: 'boks',        l: 'Boks' },
  { v: 'karate',      l: 'Karate & Arte Marciale' },
  { v: 'gjimnastike', l: 'Gjimnastikë' },
  { v: 'vrapim',      l: 'Vrapim & Atletikë' },
  { v: 'ciklizem',    l: 'Çiklizëm' },
  { v: 'ski',         l: 'Ski & Snowboard' },
  { v: 'yoga',        l: 'Yoga & Pilates' },
  { v: 'fitnes',      l: 'Fitnes' },
  { v: 'pesengritje', l: 'Pesëngritje' },
  { v: 'tjera',       l: 'Tjera' },
]

const BILETA_KATEGORIA_KUPONIT_OPT = [
  { v: 'restorant', l: 'Restorant' },
  { v: 'spa',       l: 'Spa' },
  { v: 'udhetim',   l: 'Udhëtim' },
  { v: 'argetim',   l: 'Argëtim' },
  { v: 'tjera',     l: 'Tjera' },
]

const BILETA_MOSHA_FEMIJE_OPT = [
  { v: '0-3',  l: '0–3 vjeç' },
  { v: '3-6',  l: '3–6 vjeç' },
  { v: '6-12', l: '6–12 vjeç' },
]

// ─── Hobi constants ───────────────────────────────────────────────────────────

const HOBI_GJENDJA_OPT = [
  { v: 'e_re',       l: 'E re' },
  { v: 'si_e_re',    l: 'Si e re' },
  { v: 'mire',       l: 'Mirë' },
  { v: 'me_defekte', l: 'Me defekte' },
]

const HOBI_LLOJI_ARTISTE_OPT = [
  { v: 'kengatar', l: 'Këngëtar' },
  { v: 'muzikant', l: 'Muzikant' },
  { v: 'band',     l: 'Band' },
  { v: 'dj',       l: 'DJ' },
  { v: 'tjera',    l: 'Tjera' },
]

const HOBI_LLOJI_HUMBUR_OPT = [
  { v: 'i_humbur', l: 'I humbur' },
  { v: 'i_gjetur', l: 'I gjetur' },
]

const HOBI_LLOJI_SPORTI_OPT = [
  { v: 'futboll',    l: 'Futboll' },
  { v: 'basketboll', l: 'Basketboll' },
  { v: 'tenis',      l: 'Tenis' },
  { v: 'natacion',   l: 'Natacion' },
  { v: 'kampim',     l: 'Kampim' },
  { v: 'hiking',     l: 'Hiking' },
  { v: 'tjera',      l: 'Tjera' },
]

const HOBI_LLOJI_PUNE_DORE_OPT = [
  { v: 'thurje',    l: 'Thurje' },
  { v: 'qendisje',  l: 'Qëndisje' },
  { v: 'pikture',   l: 'Pikturë' },
  { v: 'skulpture', l: 'Skulpturë' },
  { v: 'tjera',     l: 'Tjera' },
]

const HOBI_LLOJI_USHQIM_OPT = [
  { v: 'ushqim_shtepiak', l: 'Ushqim shtëpiak' },
  { v: 'pije',            l: 'Pije' },
  { v: 'embelsira',       l: 'Ëmbëlsira' },
  { v: 'tjera',           l: 'Tjera' },
]

const HOBI_PERIUDHA_OPT = [
  { v: 'para_1900', l: 'Para 1900' },
  { v: '1900_1950', l: '1900–1950' },
  { v: '1950_2000', l: '1950–2000' },
  { v: 'pas_2000',  l: 'Pas 2000' },
]

const HOBI_LLOJI_TREG_OPT = [
  { v: 'veshje',     l: 'Veshje' },
  { v: 'mobilje',    l: 'Mobilje' },
  { v: 'libra',      l: 'Libra' },
  { v: 'elektronike', l: 'Elektronikë' },
  { v: 'tjera',      l: 'Tjera' },
]

const HOBI_LLOJI_KOLEKSIONE_OPT = [
  { v: 'pullat',    l: 'Pullat' },
  { v: 'monedha',   l: 'Monedha' },
  { v: 'kartolina', l: 'Kartolina' },
  { v: 'figurina',  l: 'Figurina' },
  { v: 'tjera',     l: 'Tjera' },
]

const HOBI_LLOJI_AKTIVITETE_OPT = [
  { v: 'ne_natyre', l: 'Në natyrë' },
  { v: 'ne_salle',  l: 'Në sallë' },
  { v: 'online',    l: 'Online' },
]

// ─── Dhurate constants ────────────────────────────────────────────────────────

const DHURATE_GJENDJA_OPT = [
  { v: 'e_re',       l: 'E re' },
  { v: 'si_e_re',    l: 'Si e re' },
  { v: 'mire',       l: 'Mirë' },
  { v: 'me_defekte', l: 'Me defekte' },
]

const DHURATE_MOSHA_OPT = [
  { v: 'femije',     l: 'Fëmijë' },
  { v: 'te_rinj',    l: 'Të rinj' },
  { v: 'te_rritur',  l: 'Të rritur' },
  { v: 'te_moshuar', l: 'Të moshuar' },
]

const DHURATE_GJINIA_OPT = [
  { v: 'mashkull', l: 'Mashkull' },
  { v: 'femer',    l: 'Femër' },
  { v: 'uniseks',  l: 'Uniseks' },
]

const DHURATE_LLOJI_SHKEMBIM_OPT = [
  { v: 'veshje',      l: 'Veshje' },
  { v: 'elektronike', l: 'Elektronikë' },
  { v: 'libra',       l: 'Libra' },
  { v: 'aksesore',    l: 'Aksesore' },
  { v: 'tjera',       l: 'Tjera' },
]

const DHURATE_KOHEZGJATJA_OPT = [
  { v: '1_7_dite', l: '1–7 ditë' },
  { v: '1_4_jave', l: '1–4 javë' },
  { v: '1_3_muaj', l: '1–3 muaj' },
  { v: 'tjera',    l: 'Tjera' },
]

const DHURATE_KATEGORIA_OPT = [
  { v: 'veshje',      l: 'Veshje' },
  { v: 'elektronike', l: 'Elektronikë' },
  { v: 'lodra',       l: 'Lodra' },
  { v: 'libra',       l: 'Libra' },
  { v: 'aksesore',    l: 'Aksesore' },
  { v: 'tjera',       l: 'Tjera' },
]

// ─── Muzike constants ─────────────────────────────────────────────────────────

const MUZIKE_GJENDJA_OPT = [
  { v: 'e_re',       l: 'E re' },
  { v: 'si_e_re',    l: 'Si e re' },
  { v: 'mire',       l: 'Mirë' },
  { v: 'me_defekte', l: 'Me defekte' },
]

const MUZIKE_LLOJI_INSTRUMENTE_OPT = [
  { v: 'kitare',  l: 'Kitarë' },
  { v: 'piano',   l: 'Piano' },
  { v: 'violine', l: 'Violinë' },
  { v: 'bateri',  l: 'Bateri' },
  { v: 'flaut',   l: 'Flaut' },
  { v: 'tjera',   l: 'Tjera' },
]

const MUZIKE_GJUHA_OPT = [
  { v: 'shqip',       l: 'Shqip' },
  { v: 'anglisht',    l: 'Anglisht' },
  { v: 'gjermanisht', l: 'Gjermanisht' },
  { v: 'tjera',       l: 'Tjera' },
]

const MUZIKE_LLOJI_LIBRA_OPT = [
  { v: 'letersi', l: 'Letërsi' },
  { v: 'shkence', l: 'Shkencë' },
  { v: 'histori', l: 'Histori' },
  { v: 'femije',  l: 'Fëmijë' },
  { v: 'tjera',   l: 'Tjera' },
]

const MUZIKE_ZHANRI_CD_OPT = [
  { v: 'pop',     l: 'Pop' },
  { v: 'rock',    l: 'Rock' },
  { v: 'hiphop',  l: 'Hip-Hop' },
  { v: 'klasike', l: 'Klasike' },
  { v: 'folk',    l: 'Folk' },
  { v: 'tjera',   l: 'Tjera' },
]

const MUZIKE_ZHANRI_FILM_OPT = [
  { v: 'aksion',     l: 'Aksion' },
  { v: 'komedi',     l: 'Komedi' },
  { v: 'drame',      l: 'Dramë' },
  { v: 'dokumentar', l: 'Dokumentar' },
  { v: 'animacion',  l: 'Animacion' },
  { v: 'tjera',      l: 'Tjera' },
]

const MUZIKE_LLOJI_KANCELARI_OPT = [
  { v: 'shkolla', l: 'Shkolla' },
  { v: 'zyre',    l: 'Zyrë' },
  { v: 'art',     l: 'Art' },
  { v: 'tjera',   l: 'Tjera' },
]

// ─── Mësim constants ──────────────────────────────────────────────────────────

const MESIM_LLOJI_OPT = [
  { v: 'online',    l: 'Online' },
  { v: 'ne_person', l: 'Në person' },
  { v: 'hibrid',    l: 'Hibrid' },
]

const MESIM_NIVELI_OPT = [
  { v: 'fillestar', l: 'Fillestar' },
  { v: 'mesatar',   l: 'Mesatar' },
  { v: 'avancuar',  l: 'Avancuar' },
]

const MESIM_GJUHA_OPT = [
  { v: 'shqip',       l: 'Shqip' },
  { v: 'anglisht',    l: 'Anglisht' },
  { v: 'gjermanisht', l: 'Gjermanisht' },
  { v: 'italisht',    l: 'Italisht' },
  { v: 'tjera',       l: 'Tjera' },
]

const GJUHA_MESUAR_OPT = [
  { v: 'anglisht',    l: 'Anglisht' },
  { v: 'gjermanisht', l: 'Gjermanisht' },
  { v: 'italisht',    l: 'Italisht' },
  { v: 'frengjisht',  l: 'Frëngjisht' },
  { v: 'spanjisht',   l: 'Spanjisht' },
  { v: 'tjera',       l: 'Tjera' },
]

const LENDA_OPT = [
  { v: 'matematike', l: 'Matematikë' },
  { v: 'fizike',     l: 'Fizikë' },
  { v: 'kimi',       l: 'Kimi' },
  { v: 'biologji',   l: 'Biologji' },
  { v: 'histori',    l: 'Histori' },
  { v: 'letersi',    l: 'Letërsi' },
  { v: 'tjera',      l: 'Tjera' },
]

const MESIM_KOMPJUTERI_OPT = [
  { v: 'programim', l: 'Programim' },
  { v: 'design',    l: 'Design' },
  { v: 'rrjeta',    l: 'Rrjeta' },
  { v: 'zyrtar',    l: 'Zyrtar' },
  { v: 'tjera',     l: 'Tjera' },
]

const MESIM_SPORTI_OPT = [
  { v: 'futboll',     l: 'Futboll' },
  { v: 'basketboll',  l: 'Basketboll' },
  { v: 'volejboll',   l: 'Volejboll' },
  { v: 'tenis',       l: 'Tenis' },
  { v: 'natacion',    l: 'Natacion' },
  { v: 'boks',        l: 'Boks' },
  { v: 'karate',      l: 'Karate & Arte Marciale' },
  { v: 'gjimnastike', l: 'Gjimnastikë' },
  { v: 'vrapim',      l: 'Vrapim & Atletikë' },
  { v: 'ciklizem',    l: 'Çiklizëm' },
  { v: 'ski',         l: 'Ski & Snowboard' },
  { v: 'yoga',        l: 'Yoga & Pilates' },
  { v: 'fitnes',      l: 'Fitnes' },
  { v: 'pesengritje', l: 'Pesëngritje' },
  { v: 'tjera',       l: 'Tjera' },
]

const MESIM_VALLEZIMI_OPT = [
  { v: 'femije',    l: 'Fëmijë' },
  { v: 'te_rinj',   l: 'Të rinj' },
  { v: 'te_rritur', l: 'Të rritur' },
]

const MESIM_TRAJNIMI_OPT = [
  { v: 'personal',   l: 'Personal' },
  { v: 'grup',       l: 'Grup' },
  { v: 'korporativ', l: 'Korporativ' },
]

// ─── Kafshë constants ─────────────────────────────────────────────────────────

const KAFSHE_GJINIA_OPT = [
  { v: 'mashkull',  l: 'Mashkull' },
  { v: 'femer',     l: 'Femër' },
  { v: 'nuk_dihet', l: 'Nuk dihet' },
]

const KAFSHE_MOSHA_OPT = [
  { v: 'kelysh',   l: 'Këlysh / Fole' },
  { v: '1-6muaj',  l: '1–6 muaj' },
  { v: '6-12muaj', l: '6–12 muaj' },
  { v: '1-3vjec',  l: '1–3 vjeç' },
  { v: '3plus',    l: '3+ vjeç' },
]

const KAFSHE_ME_ORIGJINE_OPT = [
  { v: 'po', l: 'Po' },
  { v: 'jo', l: 'Jo' },
]

const KAFSHE_LLOJI_KUAJ_OPT = [
  { v: 'sport',      l: 'Sport' },
  { v: 'pune',       l: 'Punë' },
  { v: 'rekreacion', l: 'Rekreacion' },
]

const KAFSHE_LLOJI_BUJQESORE_OPT = [
  { v: 'lope',  l: 'Lopë' },
  { v: 'dele',  l: 'Dele' },
  { v: 'dhi',   l: 'Dhi' },
  { v: 'derr',  l: 'Derr' },
  { v: 'pule',  l: 'Pulë' },
  { v: 'tjera', l: 'Tjera' },
]

const KAFSHE_LLOJI_KUJDES_OPT = [
  { v: 'veteriner', l: 'Veteriner' },
  { v: 'grooming',  l: 'Grooming' },
  { v: 'strehim',   l: 'Strehim' },
  { v: 'stervitje', l: 'Stërvitje' },
]

const KAFSHE_LLOJI_AKSESORE_OPT = [
  { v: 'ushqim', l: 'Ushqim' },
  { v: 'veshje', l: 'Veshje' },
  { v: 'kafaz',  l: 'Kafaz' },
  { v: 'lodra',  l: 'Lodra' },
  { v: 'tjera',  l: 'Tjera' },
]

type ImageEntry = { id: string; preview: string; url: string | null }

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid rgba(0,0,0,0.1)',
  borderRadius: '10px',
  padding: '13px 16px',
  fontSize: '14px',
  color: '#1D1D1F',
  backgroundColor: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: '#86868B',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const sectionStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '20px',
  padding: '28px',
  marginBottom: '16px',
  boxShadow: '0 1px 10px rgba(0,0,0,0.06)',
  border: '1px solid rgba(0,0,0,0.05)',
}

export default function ShtoForm() {
  const [state, formAction, pending] = useActionState(shtoNjoftim, { error: '' })
  const [images, setImages] = useState<ImageEntry[]>([])
  const [uploadError, setUploadError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const nenkategori = selectedCategory ? (KATEGORI_MAP[selectedCategory]?.nenkategori ?? []) : []
  const isMoto = selectedSubcategory === 'Motorra' || selectedSubcategory === 'Pjesë motorrash'
  const isApartament = selectedCategory === 'imobiliare' &&
    (selectedSubcategory === 'Apartamente në shitje' || selectedSubcategory === 'Apartamente me qira')
  const isElektronik = selectedCategory === 'elektronik'
  const elMarkat = isElektronik ? EL_MARKAT[selectedSubcategory] : undefined
  const elHasPajisja = isElektronik && ['Celular & Telefon', 'Laptop', 'PC', 'Tabletë'].includes(selectedSubcategory)
  const elHasNgjyra  = isElektronik && selectedSubcategory === 'Celular & Telefon'
  const elHasRam     = isElektronik && ['Laptop', 'PC'].includes(selectedSubcategory)
  const elHasOs      = isElektronik && selectedSubcategory === 'Laptop'
  const elHasMadh    = isElektronik && selectedSubcategory === 'TV & Video'
  const elLlojiOpt   = isElektronik
    ? selectedSubcategory === 'Audio & Hi-Fi' ? AUDIO_LLOJI_OPT
    : selectedSubcategory === 'Videolojëra'   ? LOJE_LLOJI_OPT
    : selectedSubcategory === 'Foto'          ? FOTO_LLOJI_OPT
    : null
    : null

  const isPune        = selectedCategory === 'pune'
  const isZanate      = isPune && selectedSubcategory === 'Zanate / Profesionist'
  const isTransport   = isPune && selectedSubcategory === 'Transport & Logjistikë'
  const isGastro      = isPune && selectedSubcategory === 'Gastronomia & Turizëm'
  const isSherbim     = isPune && selectedSubcategory === 'Shërbim klienti'
  const isShitje      = isPune && selectedSubcategory === 'Shitje & Blerje'

  const isSherbime    = selectedCategory === 'sherbime'
  const sherbimeLloji = isSherbime ? SHERBIME_LLOJI_PER_NEN[selectedSubcategory] ?? null : null

  const isBileta          = selectedCategory === 'bileta'
  const isBiletaSalle     = isBileta && (selectedSubcategory === 'Teatër & Musical' || selectedSubcategory === 'Komedi' || selectedSubcategory === 'Koncerte')
  const isBiletaTransport = isBileta && selectedSubcategory === 'Transport'
  const isBiletaSporti    = isBileta && selectedSubcategory === 'Sport'
  const isBiletaKupon     = isBileta && selectedSubcategory === 'Kuponë'
  const isBiletaFemije    = isBileta && selectedSubcategory === 'Fëmijë'
  const biletaLlojiOpt    = isBiletaSalle ? BILETA_LLOJI_SALLE_OPT
    : isBiletaTransport ? BILETA_LLOJI_TRANSPORTI_OPT
    : isBiletaSporti    ? BILETA_LLOJI_SPORTI_OPT
    : isBiletaKupon     ? BILETA_KATEGORIA_KUPONIT_OPT
    : isBiletaFemije    ? BILETA_MOSHA_FEMIJE_OPT
    : null
  const biletaLlojiLabel  = isBiletaTransport ? 'Lloji i transportit'
    : isBiletaSporti ? 'Lloji i sportit'
    : isBiletaKupon  ? 'Kategoria'
    : isBiletaFemije ? 'Mosha'
    : 'Lloji'

  const isMesim           = selectedCategory === 'mesim'
  const isMesimGjuhe      = isMesim && selectedSubcategory === 'Kurse gjuhe'
  const isMesimPrivat     = isMesim && selectedSubcategory === 'Mësim privat'
  const isMesimKompjuteri = isMesim && selectedSubcategory === 'Kurse kompjuteri'
  const isMesimSporti     = isMesim && selectedSubcategory === 'Kurse sporti'
  const isMesimVallezimi  = isMesim && selectedSubcategory === 'Kurse vallëzimi'
  const isMesimTrajnim    = isMesim && selectedSubcategory === 'Trajnim'
  const mesimSubLlojiOpt  = isMesimKompjuteri ? MESIM_KOMPJUTERI_OPT
    : isMesimSporti     ? MESIM_SPORTI_OPT
    : isMesimVallezimi  ? MESIM_VALLEZIMI_OPT
    : isMesimTrajnim    ? MESIM_TRAJNIMI_OPT
    : null
  const mesimSubLlojiLabel = isMesimSporti ? 'Lloji i sportit'
    : isMesimVallezimi ? 'Mosha'
    : isMesimTrajnim   ? 'Lloji i trajnimit'
    : 'Lloji'

  const isKafshe        = selectedCategory === 'kafsha'
  const isKafsheQenMace = isKafshe && (selectedSubcategory === 'Qen' || selectedSubcategory === 'Mace')
  const isKafsheKuaj    = isKafshe && selectedSubcategory === 'Kuaj'
  const isKafsheFreeLloji = isKafshe && (selectedSubcategory === 'Peshq' || selectedSubcategory === 'Zogj' || selectedSubcategory === 'Kafshë të vogla')
  const isKafsheHumura  = isKafshe && selectedSubcategory === 'Kafshë të humbura'
  const kafsheLlojiOpt  = isKafsheKuaj ? KAFSHE_LLOJI_KUAJ_OPT
    : isKafshe && selectedSubcategory === 'Kafshë bujqësore' ? KAFSHE_LLOJI_BUJQESORE_OPT
    : isKafshe && selectedSubcategory === 'Kujdes kafshësh'  ? KAFSHE_LLOJI_KUJDES_OPT
    : isKafshe && selectedSubcategory === 'Aksesore për kafshë' ? KAFSHE_LLOJI_AKSESORE_OPT
    : null
  const kafsheLlojiLabel = isKafshe && selectedSubcategory === 'Kujdes kafshësh' ? 'Lloji i shërbimit'
    : isKafshe && selectedSubcategory === 'Aksesore për kafshë' ? 'Lloji i aksesorit'
    : 'Lloji'

  const isFemije          = selectedCategory === 'femije'
  const isFemijeVeshje    = isFemije && selectedSubcategory === 'Veshje fëmijësh'
  const isFemijeKepuce    = isFemije && selectedSubcategory === 'Këpucë fëmijësh'
  const isFemijeLodra     = isFemije && selectedSubcategory === 'Lodra'
  const femijeMadhesiaOpt = isFemijeVeshje ? FEMIJE_MADHESIA_VESHJE : isFemijeKepuce ? FEMIJE_MADHESIA_KEPUCE : null

  const isHobi             = selectedCategory === 'hobi'
  const isHobiArtiste      = isHobi && selectedSubcategory === 'Artistë & Muzikantë'
  const isHobiUdhetim      = isHobi && selectedSubcategory === 'Udhëtim & Evente'
  const isHobiHumbur       = isHobi && selectedSubcategory === 'Humbur & Gjetur'
  const isHobiSporti       = isHobi && selectedSubcategory === 'Sport & Kampim'
  const isHobiPuneDore     = isHobi && selectedSubcategory === 'Punë dore & Art'
  const isHobiUshqim       = isHobi && selectedSubcategory === 'Ushqim & Pije'
  const isHobiAntika       = isHobi && selectedSubcategory === 'Art & Antika'
  const isHobiTreg         = isHobi && selectedSubcategory === 'Treg i vjetër'
  const isHobiKoleksione   = isHobi && selectedSubcategory === 'Koleksione'
  const isHobiAktivitete   = isHobi && selectedSubcategory === 'Aktivitete'
  const hobiLlojiOpt       = isHobiArtiste    ? HOBI_LLOJI_ARTISTE_OPT
    : isHobiHumbur    ? HOBI_LLOJI_HUMBUR_OPT
    : isHobiPuneDore  ? HOBI_LLOJI_PUNE_DORE_OPT
    : isHobiUshqim    ? HOBI_LLOJI_USHQIM_OPT
    : isHobiTreg      ? HOBI_LLOJI_TREG_OPT
    : isHobiKoleksione ? HOBI_LLOJI_KOLEKSIONE_OPT
    : isHobiAktivitete ? HOBI_LLOJI_AKTIVITETE_OPT
    : null
  const showHobiGjendja = isHobi && !isHobiUdhetim && !isHobiHumbur && !isHobiArtiste && !isHobiAktivitete

  const isDhurate          = selectedCategory === 'dhurate'
  const isDhurateShkembim  = isDhurate && selectedSubcategory === 'Shkëmbim'
  const isDhurateHuazim    = isDhurate && selectedSubcategory === 'Huazim'
  const isDhurateDhurate   = isDhurate && selectedSubcategory === 'Dhuratë'

  const isMuzike           = selectedCategory === 'muzike'
  const isMuzikeInstrument = isMuzike && selectedSubcategory === 'Instrumente muzikore'
  const isMuzikeLibra      = isMuzike && selectedSubcategory === 'Libra & Revista'
  const isMuzikeCD         = isMuzike && selectedSubcategory === 'Muzikë & CD'
  const isMuzikeFilm       = isMuzike && selectedSubcategory === 'Film & DVD'
  const isMuzikeKancelari  = isMuzike && selectedSubcategory === 'Kancelari'
  const isMuzikeKomiks     = isMuzike && selectedSubcategory === 'Komiks'
  const muzikeZhanriOpt    = isMuzikeCD ? MUZIKE_ZHANRI_CD_OPT : isMuzikeFilm ? MUZIKE_ZHANRI_FILM_OPT : null
  const muzikeLlojiOpt     = isMuzikeLibra ? MUZIKE_LLOJI_LIBRA_OPT : isMuzikeKancelari ? MUZIKE_LLOJI_KANCELARI_OPT : null
  const hasGjuha           = isMuzikeLibra || isMuzikeFilm || isMuzikeKomiks

  const isMode        = selectedCategory === 'mode'
  const isVeshje      = isMode && (selectedSubcategory === 'Veshje burrash' || selectedSubcategory === 'Veshje femrash')
  const isKepuce      = isMode && (selectedSubcategory === 'Këpucë burrash' || selectedSubcategory === 'Këpucë femrash')
  const isBukuriMode  = isMode && selectedSubcategory === 'Bukuri & Shëndet'
  const isCanta       = isMode && selectedSubcategory === 'Çanta & Aksesore'
  const isOre         = isMode && selectedSubcategory === 'Orë & Bizhuteri'
  const modeMarka     = isVeshje ? MARKAT_VESHJE : isKepuce ? MARKAT_KEPUCE : isCanta ? MARKAT_CANTA : isOre ? MARKAT_ORE : null
  const modeNgjyrat   = isVeshje ? NGJYRA_VESHJE_OPT : isKepuce ? NGJYRA_KEPUCE_OPT : null
  const modeLlojiOpt  = isBukuriMode ? BUKURI_LLOJI_OPT : isCanta ? CANTA_LLOJI_OPT : isOre ? ORE_LLOJI_OPT : null
  const isUploading = images.some(img => img.url === null)

  async function handleFiles(files: FileList | null) {
    if (!files) return
    const remaining = 10 - images.length
    if (remaining <= 0) return
    const selected = Array.from(files).slice(0, remaining)
    setUploadError('')
    const supabase = createClient()

    for (const file of selected) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const preview = URL.createObjectURL(file)
      setImages(prev => [...prev, { id, preview, url: null }])

      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${id}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('njoftimet-images')
        .upload(path, file, { contentType: file.type })

      if (uploadErr) {
        setImages(prev => prev.filter(img => img.id !== id))
        URL.revokeObjectURL(preview)
        console.error('[upload] storage error:', uploadErr.message)
        setUploadError(
          uploadErr.message.includes('security policy')
            ? 'Nuk jeni i autentikuar. Hyni në llogari për të ngarkuar foto.'
            : `Gabim ngarkimi: ${uploadErr.message}`
        )
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('njoftimet-images')
        .getPublicUrl(path)

      setImages(prev =>
        prev.map(img => img.id === id ? { ...img, url: publicUrl } : img)
      )
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeImage(id: string) {
    setImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img) URL.revokeObjectURL(img.preview)
      return prev.filter(i => i.id !== id)
    })
  }

  return (
    <section className="shto-form-outer" style={{
      padding: '28px 32px 48px',
      maxWidth: '720px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    }}>

      {(state.error || uploadError) && (
        <div style={{
          background: '#FFF5F5',
          border: '1px solid rgba(218,41,28,0.2)',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#DA291C',
          fontWeight: '500',
        }}>
          {state.error || uploadError}
        </div>
      )}

      <form action={formAction}>

        {images.filter(img => img.url).map(img => (
          <input key={img.id} type="hidden" name="image_url" value={img.url!} />
        ))}

        {/* Basic info */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
            Informacioni bazë
          </h2>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Titulli i njoftimit *</label>
            <input name="title" type="text" placeholder="p.sh. BMW 320d 2018, ngjyrë e zezë" required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Kategoria *</label>
            <select
              name="category"
              required
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="">Zgjidh kategorinë</option>
              {KATEGORITË.map(k => (
                <option key={k.slug} value={k.slug}>{k.shortName}</option>
              ))}
            </select>
          </div>

          {nenkategori.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Nënkategoria</label>
              <select
                name="subcategory"
                value={selectedSubcategory}
                onChange={e => setSelectedSubcategory(e.target.value)}
                style={inputStyle}
              >
                <option value="">Zgjidh nënkategorinë (opsionale)</option>
                {nenkategori.filter(n => n !== 'Marka').map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}

        </div>

        {/* Makina-specific fields */}
        {selectedCategory === 'makina' && selectedSubcategory !== 'Motorra' && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e makinës
            </h2>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Marka e makinës</label>
              <select name="marka" style={inputStyle}>
                <option value="">Zgjidh markën (opsionale)</option>
                {MARKAT_MAKINA.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Fuqia (PS)</label>
                <input name="leistung_ps" type="number" placeholder="p.sh. 150" min="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Viti i prodhimit</label>
                <input name="baujahr" type="number" placeholder="p.sh. 2018" min="1900" max="2026" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Kilometrazhi</label>
              <input name="km" type="number" placeholder="p.sh. 120000" min="0" style={inputStyle} />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Karburanti</label>
              <select name="kraftstoff" style={inputStyle}>
                <option value="">Zgjidh karburantin</option>
                {KRAFTSTOFF_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Transmisioni</label>
                <select name="getriebe" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {GETRIEBE_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tipi i automjetit</label>
                <select name="fahrzeugtyp" style={inputStyle}>
                  <option value="">Zgjidh tipin</option>
                  {TYPEN_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Numri i dyerve</label>
                <select name="tueren" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {TUEREN_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Ngjyra</label>
                <select name="farbe" style={inputStyle}>
                  <option value="">Zgjidh ngjyrën</option>
                  {FARBE_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Klasa e emisioneve</label>
              <select name="schadstoffklasse" style={inputStyle}>
                <option value="">Zgjidh</option>
                {SCHADSTOFF_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Materiali i brendshëm</label>
              <select name="innen_material" style={inputStyle}>
                <option value="">Zgjidh materialin</option>
                {MATERIAL_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Pajisjet e jashtme</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {AUSSTATTUNG_OPT.map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#1D1D1F' }}>
                    <input type="checkbox" name="ausstattung" value={o.v} style={{ width: '16px', height: '16px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Pajisjet e brendshme</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {INNEN_OPT.map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#1D1D1F' }}>
                    <input type="checkbox" name="innen_ausstattung" value={o.v} style={{ width: '16px', height: '16px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Siguria</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {SICHER_OPT.map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#1D1D1F' }}>
                    <input type="checkbox" name="sicherheit" value={o.v} style={{ width: '16px', height: '16px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Motorra-specific fields */}
        {selectedCategory === 'makina' && selectedSubcategory === 'Motorra' && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e motorrës
            </h2>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Marka e motorrës</label>
              <select name="marka" style={inputStyle}>
                <option value="">Zgjidh markën (opsionale)</option>
                {MARKAT_MOTOCIKLETA.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Fuqia (PS)</label>
                <input name="leistung_ps" type="number" placeholder="p.sh. 80" min="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Viti i prodhimit</label>
                <input name="baujahr" type="number" placeholder="p.sh. 2018" min="1900" max="2026" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Kilometrazhi</label>
              <input name="km" type="number" placeholder="p.sh. 30000" min="0" style={inputStyle} />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Lloji i mjetit</label>
              <select name="moto_art" style={inputStyle}>
                <option value="">Zgjidh llojin</option>
                {MOTO_ART_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Cilindrata (cc)</label>
                <input name="cilindrata" type="number" placeholder="p.sh. 600" min="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Këmbëzënia</label>
                <select name="getriebe" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {GETRIEBE_MOTO_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Kontrolli teknik (viti)</label>
                <input name="hu_gueltig" type="number" placeholder="p.sh. 2026" min="2000" max="2040" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Lloji i ofertës</label>
                <select name="angebotstyp" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {ANGEBOTSTYP_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Ofruesi</label>
              <select name="ofruesi" style={inputStyle}>
                <option value="">Zgjidh</option>
                {OFRUESI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Apartment-specific fields */}
        {isApartament && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e apartamentit
            </h2>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Tipi i apartamentit</label>
              <select name="apt_type" style={inputStyle}>
                <option value="">Zgjidh tipin (opsionale)</option>
                {APT_TYPE_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Sipërfaqja (m²)</label>
                <input name="siperfaqja" type="number" placeholder="p.sh. 75" min="0" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Dhoma</label>
                <input name="dhoma" type="number" placeholder="p.sh. 3" min="0" style={inputStyle} />
              </div>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Kati</label>
                <input name="kati" type="number" placeholder="p.sh. 4" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Disponueshëm nga</label>
                <input name="disponueshem" type="date" style={inputStyle} />
              </div>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Lloji i ofertës</label>
                <select name="angebotstyp" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {ANGEBOTSTYP_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Ofruesi</label>
                <select name="ofruesi" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {OFRUESI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Shkëmbim</label>
              <select name="shkembim" style={inputStyle}>
                <option value="">Zgjidh</option>
                {SHKEMBIM_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Pajisjet</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {PAJISJET_OPT.map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#1D1D1F' }}>
                    <input type="checkbox" name="pajisjet" value={o.v} style={{ width: '16px', height: '16px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Karakteristika të përgjithshme</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {KARAKTERISTIKA_OPT.map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#1D1D1F' }}>
                    <input type="checkbox" name="karakteristika" value={o.v} style={{ width: '16px', height: '16px', accentColor: '#DA291C', cursor: 'pointer', flexShrink: 0 }} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Elektronik-specific fields */}
        {isElektronik && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e pajisjes
            </h2>

            {elMarkat && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Marka</label>
                <select name="marka" style={inputStyle}>
                  <option value="">Zgjidh markën (opsionale)</option>
                  {elMarkat.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {elHasPajisja && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Pajisja</label>
                <select name="pajisja" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {PAJISJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {elHasNgjyra && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Ngjyra</label>
                <select name="ngjyra" style={inputStyle}>
                  <option value="">Zgjidh ngjyrën</option>
                  {NGJYRAT_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {elHasRam && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>RAM</label>
                <select name="ram" style={inputStyle}>
                  <option value="">Zgjidh RAM-in</option>
                  {RAM_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {elHasOs && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Sistemi operativ</label>
                <select name="os" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {OS_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {elHasMadh && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Madhësia</label>
                <select name="madhesia" style={inputStyle}>
                  <option value="">Zgjidh madhësinë</option>
                  {MADHESIA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {elLlojiOpt && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji</label>
                <select name="el_lloji" style={inputStyle}>
                  <option value="">Zgjidh llojin</option>
                  {elLlojiOpt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Gjendja</label>
              <select name="zustand" style={inputStyle}>
                <option value="">Zgjidh gjendjen</option>
                {EL_GJENDJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Lloji i ofertës</label>
                <select name="angebotstyp" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {ANGEBOTSTYP_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Ofruesi</label>
                <select name="ofruesi" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {OFRUESI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Dërgesa</label>
              <select name="dergesa" style={inputStyle}>
                <option value="">Zgjidh</option>
                {DERGESA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Punë-specific fields */}
        {isPune && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e punës
            </h2>

            {isZanate && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Fusha</label>
                <select name="fusha" style={inputStyle}>
                  <option value="">Zgjidh fushën (opsionale)</option>
                  {FUSHA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isTransport && (
              <>
                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>Lloji i vozitjes</label>
                  <select name="lloji_voz" style={inputStyle}>
                    <option value="">Zgjidh</option>
                    {LLOJI_VOZ_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>Patenta</label>
                  <select name="patenta" style={inputStyle}>
                    <option value="">Zgjidh</option>
                    {PATENTA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              </>
            )}

            {isGastro && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Roli</label>
                <select name="roli" style={inputStyle}>
                  <option value="">Zgjidh rolin (opsionale)</option>
                  {ROLI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isSherbim && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Gjuha</label>
                <select name="gjuha" style={inputStyle}>
                  <option value="">Zgjidh gjuhën (opsionale)</option>
                  {GJUHA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isShitje && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji</label>
                <select name="lloji_shitjes" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {LLOJI_SHITJES_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            <div className="form-grid-2" style={{ gap: '16px' }}>
              <div>
                <label style={labelStyle}>Lloji i punës</label>
                <select name="lloji_punes" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {LLOJI_PUNES_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Ofruesi</label>
                <select name="ofruesi" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {OFRUESI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Shërbime-specific fields */}
        {isSherbime && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e shërbimit
            </h2>

            {sherbimeLloji && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji i shërbimit</label>
                <select name="lloji_sherbimi" style={inputStyle}>
                  <option value="">Zgjidh llojin (opsionale)</option>
                  {sherbimeLloji.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            <div className="form-grid-2" style={{ gap: '16px' }}>
              <div>
                <label style={labelStyle}>Lloji i ofertës</label>
                <select name="angebotstyp" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {ANGEBOTSTYP_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Ofruesi</label>
                <select name="ofruesi" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {OFRUESI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Modë-specific fields */}
        {isMode && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e produktit
            </h2>

            {modeMarka && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Marka</label>
                <select name="marka" style={inputStyle}>
                  <option value="">Zgjidh markën (opsionale)</option>
                  {modeMarka.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {modeLlojiOpt && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji</label>
                <select name="mode_lloji" style={inputStyle}>
                  <option value="">Zgjidh llojin</option>
                  {modeLlojiOpt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isVeshje && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Madhësia</label>
                <select name="madhesia" style={inputStyle}>
                  <option value="">Zgjidh madhësinë</option>
                  {MADHESIA_VESHJE.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {isKepuce && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Numri</label>
                <select name="numri_kepuces" style={inputStyle}>
                  <option value="">Zgjidh numrin</option>
                  {NUMRI_KEPUCE.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}

            {modeNgjyrat && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Ngjyra</label>
                <select name="ngjyra" style={inputStyle}>
                  <option value="">Zgjidh ngjyrën</option>
                  {modeNgjyrat.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Gjendja</label>
              <select name="zustand" style={inputStyle}>
                <option value="">Zgjidh gjendjen</option>
                {MODE_GJENDJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Lloji i ofertës</label>
                <select name="angebotstyp" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {ANGEBOTSTYP_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Ofruesi</label>
                <select name="ofruesi" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {OFRUESI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Dërgesa</label>
              <select name="dergesa" style={inputStyle}>
                <option value="">Zgjidh</option>
                {MODE_DERGESA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Fëmijë-specific fields */}
        {isFemije && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e produktit
            </h2>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Gjendja</label>
              <select name="zustand" style={inputStyle}>
                <option value="">Zgjidh gjendjen</option>
                {FEMIJE_GJENDJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Mosha</label>
              <select name="mosha" style={inputStyle}>
                <option value="">Zgjidh moshën</option>
                {FEMIJE_MOSHA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Gjinia</label>
              <select name="gjinia" style={inputStyle}>
                <option value="">Zgjidh gjininë</option>
                {FEMIJE_GJINIA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            {femijeMadhesiaOpt && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Madhësia</label>
                <select name="madhesia" style={inputStyle}>
                  <option value="">Zgjidh madhësinë</option>
                  {femijeMadhesiaOpt.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {isFemijeLodra && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji</label>
                <select name="femije_lloji" style={inputStyle}>
                  <option value="">Zgjidh llojin</option>
                  {FEMIJE_LLOJI_LODRA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Bileta-specific fields */}
        {isBileta && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e biletës
            </h2>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Data e eventit</label>
              <input name="data_eventit" type="date" style={inputStyle} />
            </div>

            {biletaLlojiOpt && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>{biletaLlojiLabel}</label>
                <select name="bileta_lloji" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {biletaLlojiOpt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isBiletaTransport && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Destinacioni</label>
                <input name="destinacioni" type="text" placeholder="p.sh. Tiranë → Vjenë" style={inputStyle} />
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Qyteti i eventit</label>
              <select name="city" style={inputStyle}>
                <option value="">Zgjidh qytetin</option>
                <optgroup label="Shqipëri">
                  {QYTETET_SHQIPERI.map(q => <option key={q} value={q}>{q}</option>)}
                </optgroup>
                <optgroup label="Kosovë">
                  {QYTETET_KOSOVE.map(q => <option key={q} value={q}>{q}</option>)}
                </optgroup>
              </select>
            </div>
          </div>
        )}

        {/* Hobi-specific fields */}
        {isHobi && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e hobisë
            </h2>

            {showHobiGjendja && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Gjendja</label>
                <select name="zustand" style={inputStyle}>
                  <option value="">Zgjidh gjendjen</option>
                  {HOBI_GJENDJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isHobiUdhetim && (
              <>
                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>Destinacioni</label>
                  <input name="destinacioni" type="text" placeholder="p.sh. Tiranë, Paris..." style={inputStyle} />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>Data e udhëtimit</label>
                  <input name="data_eventit" type="date" style={inputStyle} />
                </div>
              </>
            )}

            {isHobiSporti && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji i sportit</label>
                <select name="hobi_lloji" style={inputStyle}>
                  <option value="">Zgjidh llojin</option>
                  {HOBI_LLOJI_SPORTI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isHobiAntika && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Periudha</label>
                <select name="hobi_periudha" style={inputStyle}>
                  <option value="">Zgjidh periudhën</option>
                  {HOBI_PERIUDHA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {hobiLlojiOpt && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji</label>
                <select name="hobi_lloji" style={inputStyle}>
                  <option value="">Zgjidh llojin</option>
                  {hobiLlojiOpt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Dhurate-specific fields */}
        {isDhurate && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e dhuratës
            </h2>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Gjendja</label>
              <select name="zustand" style={inputStyle}>
                <option value="">Zgjidh gjendjen</option>
                {DHURATE_GJENDJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Mosha</label>
              <select name="mosha" style={inputStyle}>
                <option value="">Zgjidh moshën</option>
                {DHURATE_MOSHA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Gjinia</label>
              <select name="gjinia" style={inputStyle}>
                <option value="">Zgjidh gjininë</option>
                {DHURATE_GJINIA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            {isDhurateShkembim && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji</label>
                <select name="dhurate_lloji" style={inputStyle}>
                  <option value="">Zgjidh llojin</option>
                  {DHURATE_LLOJI_SHKEMBIM_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isDhurateHuazim && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Kohëzgjatja</label>
                <select name="dhurate_kohezgjatja" style={inputStyle}>
                  <option value="">Zgjidh kohëzgjatjen</option>
                  {DHURATE_KOHEZGJATJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isDhurateDhurate && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Kategoria</label>
                <select name="dhurate_lloji" style={inputStyle}>
                  <option value="">Zgjidh kategorinë</option>
                  {DHURATE_KATEGORIA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Muzike-specific fields */}
        {isMuzike && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e produktit
            </h2>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Gjendja</label>
              <select name="zustand" style={inputStyle}>
                <option value="">Zgjidh gjendjen</option>
                {MUZIKE_GJENDJA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            {isMuzikeInstrument && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji</label>
                <select name="muzike_lloji" style={inputStyle}>
                  <option value="">Zgjidh llojin</option>
                  {MUZIKE_LLOJI_INSTRUMENTE_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {muzikeZhanriOpt && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Zhanri</label>
                <select name="muzike_zhanri" style={inputStyle}>
                  <option value="">Zgjidh zhanrin</option>
                  {muzikeZhanriOpt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {muzikeLlojiOpt && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji</label>
                <select name="muzike_lloji" style={inputStyle}>
                  <option value="">Zgjidh llojin</option>
                  {muzikeLlojiOpt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {hasGjuha && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Gjuha</label>
                <select name="gjuha" style={inputStyle}>
                  <option value="">Zgjidh gjuhën</option>
                  {MUZIKE_GJUHA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Mësim-specific fields */}
        {isMesim && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e kursit
            </h2>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Lloji</label>
                <select name="mesim_lloji" style={inputStyle}>
                  <option value="">Zgjidh llojin</option>
                  {MESIM_LLOJI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Niveli</label>
                <select name="mesim_niveli" style={inputStyle}>
                  <option value="">Zgjidh nivelin</option>
                  {MESIM_NIVELI_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Gjuha e mësimit</label>
              <select name="gjuha" style={inputStyle}>
                <option value="">Zgjidh gjuhën</option>
                {MESIM_GJUHA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>

            {isMesimGjuhe && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Gjuha e mësuar</label>
                <select name="gjuha_mesuar" style={inputStyle}>
                  <option value="">Zgjidh gjuhën</option>
                  {GJUHA_MESUAR_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isMesimPrivat && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lënda</label>
                <select name="lenda" style={inputStyle}>
                  <option value="">Zgjidh lëndën</option>
                  {LENDA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {mesimSubLlojiOpt && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>{mesimSubLlojiLabel}</label>
                <select name="mesim_sub_lloji" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {mesimSubLlojiOpt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Kafshë-specific fields */}
        {isKafshe && !isKafsheHumura && (
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
              Detajet e kafshës
            </h2>

            <div className="form-grid-2" style={{ gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Gjinia</label>
                <select name="gjinia" style={inputStyle}>
                  <option value="">Zgjidh gjininë</option>
                  {KAFSHE_GJINIA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Mosha</label>
                <select name="mosha" style={inputStyle}>
                  <option value="">Zgjidh moshën</option>
                  {KAFSHE_MOSHA_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>

            {(isKafsheQenMace || isKafsheKuaj) && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Raca</label>
                <input name="raca" type="text" placeholder="p.sh. Labrador, Golden Retriever..." style={inputStyle} />
              </div>
            )}

            {isKafsheQenMace && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Me origjinë</label>
                <select name="me_origjine" style={inputStyle}>
                  <option value="">Zgjidh</option>
                  {KAFSHE_ME_ORIGJINE_OPT.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}

            {isKafsheFreeLloji && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Lloji</label>
                <input name="kafshe_lloji" type="text" placeholder="p.sh. Papagall, Ari i artë..." style={inputStyle} />
              </div>
            )}

            {kafsheLlojiOpt && (
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>{kafsheLlojiLabel}</label>
                <select name="kafshe_lloji" style={inputStyle}>
                  <option value="">Zgjidh llojin</option>
                  {kafsheLlojiOpt.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Price and city */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
            Çmimi dhe vendndodhja
          </h2>

          <div className="form-grid-2" style={{ gap: '16px' }}>
            <div>
              <label style={labelStyle}>Çmimi (€) *</label>
              <input name="price" type="number" placeholder="0" required min="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Qyteti *</label>
              <select name="city" required style={inputStyle}>
                <option value="">Zgjidh qytetin</option>
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

        {/* Përshkrimi */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '24px', letterSpacing: '-0.3px' }}>
            Përshkrimi
          </h2>
          <textarea
            name="description"
            placeholder="Përshkruaj njoftimin tënd në detaje..."
            rows={5}
            required
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Photos */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1D1D1F', marginBottom: '6px', letterSpacing: '-0.3px' }}>
            Foto
          </h2>
          <p style={{ fontSize: '13px', color: '#86868B', marginBottom: '20px', fontWeight: '500' }}>
            Deri në 10 foto · PNG, JPG, WebP
          </p>

          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '14px' }}>
              {images.map((img, idx) => (
                <div key={img.id} style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: idx === 0 ? '2px solid #DA291C' : '1.5px solid rgba(0,0,0,0.08)',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {idx === 0 && (
                    <span style={{
                      position: 'absolute', bottom: '4px', left: '4px',
                      background: '#DA291C', color: '#fff',
                      fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: '700',
                    }}>
                      KRYESORJA
                    </span>
                  )}
                  {img.url === null && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    style={{
                      position: 'absolute', top: '4px', right: '4px',
                      background: 'rgba(0,0,0,0.55)',
                      color: '#fff', border: 'none', borderRadius: '50%',
                      width: '20px', height: '20px',
                      fontSize: '14px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      lineHeight: 1, padding: 0, fontFamily: 'inherit',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < 10 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed rgba(0,0,0,0.12)',
                borderRadius: '14px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#DA291C')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)')}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: '#F5F5F7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
                fontSize: '20px', color: '#6E6E73',
              }}>
                +
              </div>
              <p style={{ fontSize: '14px', color: '#1D1D1F', marginBottom: '4px', fontWeight: '600' }}>
                Kliko për të ngarkuar foto
              </p>
              <p style={{ fontSize: '12px', color: '#86868B', margin: 0 }}>
                PNG, JPG deri në 10MB · {10 - images.length} foto mbetur
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        <button
          type="submit"
          disabled={pending || isUploading}
          style={{
            width: '100%',
            background: (pending || isUploading) ? '#999' : '#DA291C',
            color: '#fff',
            border: 'none',
            padding: '17px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '14px',
            cursor: (pending || isUploading) ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '-0.1px',
          }}
        >
          {isUploading ? 'Duke ngarkuar fotot...' : pending ? 'Duke publikuar...' : 'Publiko njoftimin falas'}
        </button>

      </form>
    </section>
  )
}
