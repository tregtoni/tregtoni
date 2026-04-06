export type KategoriInfo = {
  slug: string
  name: string       // full display name
  shortName: string  // short name for cards
  icon: string
  nenkategori: string[]
}

export const KATEGORITË: KategoriInfo[] = [
  {
    slug: 'makina',
    name: 'Automjete',
    shortName: 'Automjete',
    icon: '🚗',
    nenkategori: ['Makina', 'Motorçikleta', 'Pjesë këmbimi', 'Biçikleta', 'Lundra', 'Pjesë motorçiklete', 'Mjete pune', 'Karavane'],
  },
  {
    slug: 'elektronik',
    name: 'Elektronik',
    shortName: 'Elektronik',
    icon: '📱',
    nenkategori: ['Audio & Hi-Fi', 'Foto', 'Celular & Telefon', 'Pajisje shtëpiake', 'Konsolë', 'Laptop', 'PC', 'Aksesore PC', 'Tabletë', 'TV & Video', 'Videolojëra', 'Elektronik Shërbime', 'Elektronik të tjera'],
  },
  {
    slug: 'shtepi',
    name: 'Shtëpi & Kopsht',
    shortName: 'Shtëpi',
    icon: '🏡',
    nenkategori: ['Banjë', 'Zyrë', 'Dekorim', 'Aksesore kopshti & Bimë', 'Tekstile shtëpie', 'Kuzhinë & Dhomë ngrënie', 'Llamba & Dritë', 'Dhomë gjumi', 'Dhomë ndenje', 'Shërbime Shtëpi & Kopsht', 'Punë shtëpie', 'Shtëpi & Kopsht të tjera'],
  },
  {
    slug: 'pune',
    name: 'Punë',
    shortName: 'Punë',
    icon: '💼',
    nenkategori: ['Praktikë', 'Ndërtim & Zanate', 'Punë zyre', 'Gastronomia & Turizëm', 'Shërbim klienti', 'Punë të vogla', 'Sektor social', 'Transport & Logjistikë', 'Shitje & Blerje', 'Punë të tjera'],
  },
  {
    slug: 'sherbime',
    name: 'Shërbime',
    shortName: 'Shërbime',
    icon: '🛠️',
    nenkategori: ['Kujdes pleqsh', 'Auto & Biçikleta', 'Kujdes fëmijësh', 'Elektronik', 'Shtëpi & Kopsht', 'Artistë & Muzikantë', 'Udhëtim & Evente', 'Kujdes kafshësh', 'Zhvendosje & Transport', 'Shërbime të tjera'],
  },
  {
    slug: 'familje',
    name: 'Familje, Fëmijë & Bebe',
    shortName: 'Familje',
    icon: '👶',
    nenkategori: ['Veshje fëmijësh', 'Këpucë fëmijësh', 'Pajisje bebeje', 'Sedilje fëmijësh', 'Kujdes fëmijësh', 'Karrocë fëmijësh', 'Mobilje fëmijësh', 'Lodra', 'Familje të tjera'],
  },
  {
    slug: 'kafsha',
    name: 'Kafshë shtëpiake',
    shortName: 'Kafshë',
    icon: '🐾',
    nenkategori: ['Peshq', 'Qen', 'Mace', 'Kafshë të vogla', 'Kafshë bujqësore', 'Kuaj', 'Kujdes kafshësh', 'Kafshë të humbura', 'Zogj', 'Aksesore'],
  },
  {
    slug: 'mode',
    name: 'Modë & Bukuri',
    shortName: 'Modë',
    icon: '👗',
    nenkategori: ['Bukuri & Shëndet', 'Veshje femrash', 'Këpucë femrash', 'Veshje burrash', 'Këpucë burrash', 'Çanta & Aksesore', 'Orë & Bizhuteri', 'Modë të tjera'],
  },
  {
    slug: 'mesim',
    name: 'Mësim & Kurse',
    shortName: 'Mësim',
    icon: '📚',
    nenkategori: ['Bukuri & Shëndet', 'Kurse kompjuteri', 'Ezoteriks', 'Gatim & Pjekje', 'Art & Dizajn', 'Muzikë & Këndim', 'Mësim privat', 'Kurse sporti', 'Kurse gjuhe', 'Kurse vallëzimi', 'Trajnim', 'Kurse të tjera'],
  },
  {
    slug: 'bileta',
    name: 'Bileta & Evente',
    shortName: 'Bileta',
    icon: '🎟️',
    nenkategori: ['Tren & Transport', 'Komedi', 'Kuponë', 'Fëmijë', 'Koncerte', 'Sport', 'Teatër & Musical', 'Bileta të tjera'],
  },
  {
    slug: 'hobi',
    name: 'Kohë e lirë, Hobi & Fqinjësi',
    shortName: 'Hobi',
    icon: '🎯',
    nenkategori: ['Ezoteriks', 'Ushqim & Pije', 'Aktivitete', 'Punë dore & Art', 'Art & Antika', 'Artistë & Muzikantë', 'Modelizëm', 'Udhëtim & Evente', 'Koleksione', 'Sport & Kampim', 'Treg i vjetër', 'Humbur & Gjetur', 'Hobi të tjera'],
  },
  {
    slug: 'imobiliare',
    name: 'Imobiliare',
    shortName: 'Imobiliare',
    icon: '🏢',
    nenkategori: ['Me afat & Apartament', 'Kontejnerë', 'Apartamente në shitje', 'Imobiliare jashtë vendit', 'Garazhe', 'Imobiliare tregtare', 'Troje & Kopshte', 'Shtëpi në shitje', 'Shtëpi me qira', 'Apartamente me qira', 'Projekte të reja', 'Zhvendosje & Transport', 'Imobiliare të tjera'],
  },
  {
    slug: 'muzike',
    name: 'Muzikë, Filma & Libra',
    shortName: 'Muzikë',
    icon: '🎵',
    nenkategori: ['Libra & Revista', 'Kancelari', 'Komiks', 'Libra shkollore', 'Film & DVD', 'Muzikë & CD', 'Instrumente muzikore', 'Muzikë & Libra të tjera'],
  },
  {
    slug: 'dhurate',
    name: 'Dhuratë & Shkëmbim',
    shortName: 'Dhuratë',
    icon: '🎁',
    nenkategori: ['Shkëmbim', 'Huazim', 'Dhuratë'],
  },
]

export const KATEGORI_MAP: Record<string, KategoriInfo> = Object.fromEntries(
  KATEGORITË.map(k => [k.slug, k])
)

// Fallback icons for any old category values still in the DB
export const CATEGORY_ICON = (cat: string): string =>
  KATEGORI_MAP[cat]?.icon ?? '📦'

export const MARKAT_MAKINA = [
  'Abarth', 'Aixam', 'Alfa Romeo', 'Aston Martin', 'Audi',
  'Bentley', 'BMW', 'BYD', 'Cadillac', 'Chevrolet',
  'Chrysler', 'Citroen', 'Corvette', 'Cupra', 'Dacia',
  'Daewoo', 'Daihatsu', 'Dodge', 'DS Automobiles', 'Ferrari',
  'Fiat', 'Ford', 'Honda', 'Hyundai', 'Infiniti',
  'Iveco', 'Jaguar', 'Jeep', 'KGM', 'Kia',
  'Lada', 'Lamborghini', 'Lancia', 'Land Rover', 'Lexus',
  'Maserati', 'Mazda', 'Mercedes Benz', 'MG', 'Microcar',
  'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot',
  'Polestar', 'Porsche', 'Renault', 'Rolls-Royce', 'Rover',
  'Saab', 'Seat', 'Skoda', 'Smart', 'Ssangyong',
  'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Trabant',
  'Triumph', 'Volkswagen', 'Volvo', 'Wartburg', 'Marka të tjera',
]

export const MARKAT_MOTOCIKLETA = [
  'Aprilia', 'BMW', 'Buell', 'Ducati', 'Harley', 'Honda', 'Husqvarna',
  'Kawasaki', 'KTM', 'Kymco', 'Moto Guzzi', 'MZ', 'Peugeot', 'Piaggio',
  'Simson', 'Suzuki', 'Triumph', 'Vespa', 'Yamaha', 'Zündapp', 'Marka të tjera',
]

export const QYTETET_SHQIPERI = [
  'Tiranë', 'Durrës', 'Vlorë', 'Shkodër', 'Fier', 'Korçë', 'Elbasan', 'Berat',
  'Lushnjë', 'Kavajë', 'Gjirokastër', 'Sarandë', 'Lezhë', 'Kukës', 'Pogradec',
  'Peshkopi', 'Burrel', 'Krujë', 'Laç', 'Patos', 'Corovodë', 'Gramsh', 'Librazhd',
  'Përmet', 'Tepelenë', 'Selenicë', 'Himarë', 'Delvinë', 'Konispol', 'Bajram Curri',
  'Tropojë', 'Has', 'Bulqizë', 'Mat', 'Mirditë', 'Mamurras', 'Rrogozhinë', 'Peqin',
  'Cerrik', 'Prrenjas', 'Bilisht', 'Devoll', 'Mallakastër', 'Ballsh', 'Divjakë',
  'Roskovec', 'Ura Vajgurore', 'Kuçovë', 'Poliçan', 'Memaliaj',
]

export const QYTETET_KOSOVE = [
  'Prishtinë', 'Prizren', 'Pejë', 'Mitrovicë', 'Gjakovë', 'Gjilan',
  'Ferizaj', 'Vushtrri', 'Suharekë', 'Rahovec', 'Malishevë', 'Klinë', 'Skenderaj',
  'Drenas', 'Lipjan', 'Podujevë', 'Fushë Kosovë', 'Obiliq', 'Kaçanik', 'Shtime',
  'Novobërdë', 'Kamenicë', 'Viti', 'Dragash', 'Junik', 'Mamuşa', 'Hani i Elezit',
  'Partesh', 'Ranillug', 'Klokot', 'Graçanicë', 'Štrpce',
]

export const QYTETET = [...QYTETET_SHQIPERI, ...QYTETET_KOSOVE]

export const RENDITJA = [
  { value: 're_re',           label: 'Më të rejat' },
  { value: 'te_vjetrat',      label: 'Më të vjetrat' },
  { value: 'me_i_lire',       label: 'Çmimi: i ulët → i lartë' },
  { value: 'me_i_shtrenjtë',  label: 'Çmimi: i lartë → i ulët' },
]
