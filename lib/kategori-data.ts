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
    nenkategori: ['Makina', 'Motorra', 'Mjete pune', 'Karavane', 'Biçikleta', 'Pjesë makinash', 'Pjesë motorrash'],
  },
  {
    slug: 'imobiliare',
    name: 'Imobiliare',
    shortName: 'Imobiliare',
    icon: '🏢',
    nenkategori: ['Apartamente në shitje', 'Apartamente me qira', 'Shtëpi në shitje', 'Shtëpi me qira', 'Imobiliare tregtare', 'Troje & Kopshte', 'Garazhe', 'Zhvendosje & Transport', 'Projekte të Reja', 'Imobiliare jashtë vendit', 'Imobiliare të tjera'],
  },
  {
    slug: 'shtepi',
    name: 'Shtëpi & Kopsht',
    shortName: 'Shtëpi',
    icon: '🏡',
    nenkategori: ['Dhomë gjumi', 'Dhomë ndenje', 'Kuzhinë & Dhomë ngrënie', 'Banjë', 'Zyrë', 'Dekorim', 'Aksesore Shtëpie', 'Aksesore kopshti & Bimë', 'Tekstile shtëpie', 'Shërbime Shtëpi & Kopsht', 'Shtëpi & Kopsht të tjera'],
  },
  {
    slug: 'elektronik',
    name: 'Elektronik',
    shortName: 'Elektronik',
    icon: '📱',
    nenkategori: ['Celular & Telefon', 'TV & Video', 'Tabletë', 'Laptop', 'Videolojëra', 'Audio & Hi-Fi', 'PC', 'Foto', 'Pajisje shtëpiake', 'Aksesore PC', 'Elektronik Shërbime', 'Elektronik të tjera'],
  },
  {
    slug: 'pune',
    name: 'Punë',
    shortName: 'Punë',
    icon: '💼',
    nenkategori: ['Zanate / Profesionist', 'Transport & Logjistikë', 'Gastronomia & Turizëm', 'Shërbim klienti', 'Sektor social', 'Shitje & Blerje', 'Punë zyre', 'Punë të vogla / Part Time', 'Praktikë', 'Punë të tjera'],
  },
  {
    slug: 'sherbime',
    name: 'Shërbime',
    shortName: 'Shërbime',
    icon: '🛠️',
    nenkategori: ['Zhvendosje & Transport', 'Artistë & Muzikantë', 'Udhëtime & Evente', 'Auto & Biçikleta', 'Kujdes kafshësh', 'Kujdes fëmijësh', 'Kujdes pleqsh', 'Shtëpi & Kopsht', 'Elektronik', 'Shërbime të tjera'],
  },
  {
    slug: 'mode',
    name: 'Modë & Bukuri',
    shortName: 'Modë',
    icon: '👗',
    nenkategori: ['Veshje burrash', 'Veshje femrash', 'Këpucë burrash', 'Këpucë femrash', 'Bukuri & Shëndet', 'Çanta & Aksesore', 'Orë & Bizhuteri', 'Modë të tjera'],
  },
  {
    slug: 'femije',
    name: 'Fëmijë & Bebe',
    shortName: 'Fëmijë',
    icon: '👶',
    nenkategori: ['Veshje fëmijësh', 'Këpucë fëmijësh', 'Karrocë fëmijësh', 'Mobilje fëmijësh', 'Kujdes fëmijësh', 'Sedilje fëmijësh', 'Pajisje bebeje', 'Lodra', 'Të tjera'],
  },
  {
    slug: 'kafsha',
    name: 'Kafshë shtëpiake',
    shortName: 'Kafshë',
    icon: '🐾',
    nenkategori: ['Qen', 'Mace', 'Kuaj', 'Peshq', 'Zogj', 'Kafshë të vogla', 'Kafshë bujqësore', 'Kujdes kafshësh', 'Kafshë të humbura', 'Aksesore për kafshë'],
  },
  {
    slug: 'mesim',
    name: 'Mësim & Kurse',
    shortName: 'Mësim',
    icon: '📚',
    nenkategori: ['Bukuri & Shëndet', 'Muzikë & Këndim', 'Gatim & Pjekje', 'Kurse kompjuteri', 'Kurse vallëzimi', 'Kurse sporti', 'Kurse gjuhe', 'Mësim privat', 'Art & Design', 'Trajnim', 'Kurse të tjera'],
  },
  {
    slug: 'bileta',
    name: 'Bileta & Evente',
    shortName: 'Bileta',
    icon: '🎟️',
    nenkategori: ['Teatër & Musical', 'Transport', 'Koncerte', 'Komedi', 'Kuponë', 'Fëmijë', 'Sport', 'Bileta të tjera'],
  },
  {
    slug: 'hobi',
    name: 'Kohë e lirë, Hobi & Fqinjësi',
    shortName: 'Hobi',
    icon: '🎯',
    nenkategori: ['Artistë & Muzikantë', 'Udhëtim & Evente', 'Humbur & Gjetur', 'Sport & Kampim', 'Punë dore & Art', 'Ushqim & Pije', 'Art & Antika', 'Treg i vjetër', 'Koleksione', 'Aktivitete', 'Hobi të tjera'],
  },
  {
    slug: 'muzike',
    name: 'Muzikë, Filma & Libra',
    shortName: 'Muzikë',
    icon: '🎵',
    nenkategori: ['Instrumente muzikore', 'Libra & Revista', 'Muzikë & CD', 'Film & DVD', 'Kancelari', 'Komiks', 'Të tjera'],
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
