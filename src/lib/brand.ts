/**
 * Marka sistemi — tek merkezi kaynak.
 *
 * Her ürünün tek bir sabit accent hex'i vardır ve bu renk ürünün göründüğü
 * HER yerde kullanılır (kart kenarlığı, rozet, grafik, glow, buton). Bileşen
 * içinde renk hardcode edilmez.
 *
 * Palet ambalajlardan türetildi ve renk çemberine eşit dağıtıldı:
 * kırmızı → sarı → amber → turuncu (sıcak aile) ve
 * yeşil → turkuaz → camgöbeği → mavi (soğuk aile).
 *
 * VERİ KAYNAĞI: Ürün adları, kategoriler, fiyatlar, içerik bilgisi tabloları,
 * kullanım ve saklama bilgileri luzayn.com ürün sayfalarından birebir alındı.
 *
 * İDDİA KURALI: Sağlık beyanı yalnızca yetkilendirilmiş besin ögesi
 * (vitamin/mineral, EPA-DHA) bazında kurulur — ürün bazında değil.
 * Bitkisel bileşenler (reishi, kordiseps, safran, rodiola, valerian...)
 * için yetkilendirilmiş beyan YOKTUR; onlar yalnızca bileşim olarak anılır.
 */

export const INK = '#0a0a12'

/** Hex + alfa-suffix hilesi: `${accent}${ALPHA.border}` */
export const ALPHA = {
  wash: '0c', // arka plan yıkaması
  tint: '1f', // aktif chip zemini
  border: '30', // kart kenarlığı
  strong: '66', // glow
} as const

/**
 * Ürün slug'ı.
 *
 * Katalog artık yönetim panelinden geldiği için sekiz değerlik kapalı bir
 * birlik olamaz — panelden yeni ürün eklendiğinde tipin değişmesi
 * gerekirdi. Var olan slug kontrolü tip sisteminde değil, çalışma anında
 * yapılıyor: katalogda olmayan bir slug 404 veya sepetten düşürme ile
 * sonuçlanır.
 */
export type ProductSlug = string

export type ProductHighlight = { title: string; detail: string }

/** İçerik bilgisi tablosunun tek satırı — miktarlar etiketten birebir alınır */
export type CompositionRow = {
  name: string
  amount: string
  /** % Beslenme Referans Değeri; etikette verilmemişse tanımsız */
  nrv?: string
}

export type ProductMeta = {
  slug: ProductSlug
  /** Ürün adı (luzayn.com'daki başlıkla aynı) */
  name: string
  /** Kart ve rozetlerde kullanılan kısa ad */
  shortName: string
  /** Katalog kategorisi (luzayn.com kategori etiketi) */
  category: string
  /** İki kelimelik kimlik — kategori hissi yaratır */
  tagline: string
  subtitle: string
  accent: string
  /** TRY — luzayn.com liste fiyatı */
  price: number
  /** "60 Kapsül", "20 mL" gibi ambalaj üstü birim */
  unit: string
  form: 'Kapsül' | 'Softgel' | 'Damla'
  /** İçerik bilgisinin hangi porsiyona ait olduğu, örn. "2 Kapsül" */
  servingSize: string
  /** Ana sayfa rayında öne çıkar */
  featured?: boolean
  /** Panelden yönetilen stok durumu. Tanımsızsa stokta sayılır. */
  inStock?: boolean
  /** Kapak görseli. Tanımsızsa CDN_PATHS.cover(slug) kullanılır. */
  cover?: string
  /** İkinci görsel. Tanımsızsa CDN_PATHS.image(slug) kullanılır. */
  image?: string
  /** Kısa duygusal motto */
  motto: string
  /** Ürün açıklaması */
  description: string
  /** Ürün özellikleri madde listesi */
  features: Array<string>
  /** İçerik bilgisi tablosu — porsiyon başına miktarlar */
  composition: Array<CompositionRow>
  /** Kartlarda chip olarak dizilen bileşen kilidi */
  keyIngredients: Array<string>
  /** Bileşen bazlı, yetkilendirilmiş beyanlar veya bileşim tanımları */
  highlights: Array<ProductHighlight>
  usage: string
  storage: string
  /** Beyan içeren madde varsa hangi besin ögesine ait olduğu burada yazar */
  claimBasis: Array<string>
  /**
   * Shopify varyant kimliği (sayısal). Ödeme Shopify checkout'una
   * devredilirken sepet satırı bu id ile kurulur.
   */
  shopifyVariantId: string
}

/** Fiyatlar luzayn.com'daki liste fiyatlarıdır. */
export const PRICES_CONFIRMED = true

const STORAGE_DEFAULT =
  '25°C altındaki oda sıcaklığında, serin ve kuru yerde muhafaza ediniz. Çocukların ulaşamayacağı yerde saklayınız.'

export const PRODUCTS: Array<ProductMeta> = [
  {
    slug: 'magnesium',
    name: 'Magnesium',
    shortName: 'Magnesium',
    category: 'Mineraller',
    tagline: 'Denge Modu',
    subtitle: '5 formlu magnezyum kompleksi',
    accent: '#22D3EE',
    price: 860,
    unit: '60 Kapsül',
    form: 'Kapsül',
    servingSize: '2 Kapsül',
    featured: true,
    motto: 'Tek bir mineral, beş farklı taşıyıcı.',
    description:
      'Luzayn Magnesium, vücudun günlük magnezyum ihtiyacını karşılamaya yardımcı olmak için geliştirilmiş çoklu formül içeren bir besin takviyesidir. İçeriğinde bulunan 5 farklı magnezyum formu, vitaminler ve destekleyici bileşenlerle birlikte kas, sinir sistemi ve enerji metabolizmasını destekler.',
    features: [
      'Malat, bisglisinat, L-threonate, sitrat ve taurat formlarını bir arada içerir.',
      'C vitamini, B6 ve B12 vitaminleri ile desteklenmiştir.',
      'D3 vitamini ve hyalüronik asit içerir.',
      'Sabah–akşam kullanıma uygun kapsül formundadır.',
      '60 kapsül içeren ambalajda sunulmaktadır.',
      'Takviye edici gıda olarak üretilmiştir.',
    ],
    composition: [
      { name: 'Magnezyum', amount: '250 mg' },
      { name: 'Vitamin C', amount: '40 mg' },
      { name: 'Vitamin B6', amount: '2 mg' },
      { name: 'Vitamin B12', amount: '5 µg' },
      { name: 'Vitamin D3', amount: '25 µg (1000 IU)' },
      { name: 'Hyalüronik Asit', amount: '2 mg' },
    ],
    keyIngredients: [
      'Malat',
      'Bisglisinat',
      'L-Threonate',
      'Sitrat',
      'Taurat',
      'B6',
      'B12',
      'C Vitamini',
      'D3',
      'Hyalüronik Asit',
    ],
    highlights: [
      {
        title: 'Magnezyum',
        detail:
          'Yorgunluk ve bitkinliğin azalmasına, normal kas fonksiyonuna ve sinir sisteminin normal fonksiyonuna katkıda bulunur.',
      },
      {
        title: 'B6 Vitamini',
        detail:
          'Normal protein ve glikojen metabolizmasına ve yorgunluğun azalmasına katkıda bulunur.',
      },
      {
        title: 'B12 Vitamini',
        detail:
          'Normal enerji oluşum metabolizmasına ve normal kırmızı kan hücresi oluşumuna katkıda bulunur.',
      },
      {
        title: 'Beş magnezyum formu',
        detail:
          'Magnezyum malat, bisglisinat, L-threonate, sitrat ve taurat aynı formülde bir araya getirilmiştir.',
      },
    ],
    usage:
      '11 yaş ve üzeri yetişkinler için sabah 1 kapsül, akşam 1 kapsül tüketilmesi tavsiye edilir.',
    storage: STORAGE_DEFAULT,
    claimBasis: [
      'Magnezyum',
      'C Vitamini',
      'B6 Vitamini',
      'B12 Vitamini',
      'D Vitamini',
    ],
    shopifyVariantId: '43107284385863',
  },
  {
    slug: 'omega3',
    name: 'Omega 3',
    shortName: 'Omega 3',
    category: 'Omega-3',
    tagline: 'Akış Modu',
    subtitle: '1000 mg balık yağı · 360 EPA / 240 DHA',
    accent: '#3B82F6',
    price: 899,
    unit: '60 Softgel',
    form: 'Softgel',
    servingSize: '1 Yumuşak Kapsül',
    featured: true,
    motto: 'Her softgelde ölçülü EPA ve DHA.',
    description:
      'Luzayn Omega 3, her yumuşak kapsülde 1000 mg balık yağı ve toplam 700 mg omega-3 yağ asidi sağlayan takviye edici gıdadır. Formül 360 mg EPA, 240 mg DHA ve 20 mg koenzim Q10 içerir.',
    features: [
      'Her yumuşak kapsülde 1000 mg balık yağı içerir.',
      'Toplam 700 mg omega-3 yağ asidi sağlar.',
      '360 mg EPA (eikosapentaenoik asit) içerir.',
      '240 mg DHA (dokosaheksaenoik asit) içerir.',
      '20 mg koenzim Q10 ile zenginleştirilmiştir.',
      'Yüksek saflıkta balık yağı kullanılarak formüle edilmiştir.',
      '60 softgel kapsül içeren ambalajda sunulmaktadır.',
      'Takviye edici gıda olarak üretilmiştir.',
    ],
    composition: [
      { name: 'Balık Yağı', amount: '1000 mg' },
      { name: 'Toplam Omega 3 Yağ Asitleri', amount: '700 mg' },
      { name: 'EPA', amount: '360 mg' },
      { name: 'DHA', amount: '240 mg' },
      { name: 'Koenzim Q10', amount: '20 mg' },
    ],
    keyIngredients: [
      '1000 mg Balık Yağı',
      '700 mg Omega 3',
      '360 mg EPA',
      '240 mg DHA',
      '20 mg Q10',
    ],
    highlights: [
      {
        title: 'EPA ve DHA',
        detail:
          'Kalbin normal fonksiyonuna katkıda bulunur. Faydası günlük 250 mg EPA + DHA alımıyla sağlanır.',
      },
      {
        title: 'DHA · beyin',
        detail:
          'Normal beyin fonksiyonlarının korunmasına katkıda bulunur. Faydası günlük 250 mg DHA alımıyla sağlanır.',
      },
      {
        title: 'DHA · görme',
        detail:
          'Normal görme yetisinin korunmasına katkıda bulunur. Faydası günlük 250 mg DHA alımıyla sağlanır.',
      },
      {
        title: 'Koenzim Q10',
        detail:
          'Yağda çözünen bir bileşendir; yağ fazı içeren softgel formunda 20 mg olarak sunulur.',
      },
    ],
    usage:
      '11 yaş ve üzeri bireyler için günde 1 yumuşak kapsül; tercihen yemeklerle birlikte veya sonrasında bol su ile alınız.',
    storage: STORAGE_DEFAULT,
    claimBasis: ['EPA', 'DHA'],
    shopifyVariantId: '43107285434439',
  },
  {
    slug: 'vitaminc',
    name: 'Vitamin C Pure Way',
    shortName: 'Vitamin C',
    category: 'Vitaminler',
    tagline: 'Direnç Modu',
    subtitle: 'PureWay-C® · biyoflavonoid kompleksiyle',
    accent: '#F97316',
    price: 760,
    unit: '60 Kapsül',
    form: 'Kapsül',
    servingSize: '2 Kapsül',
    featured: true,
    motto: 'C vitamini, yalnız değil.',
    description:
      'Luzayn Vitamin C Pure Way, her 2 kapsülde PureWay-C® formunda 1000 mg C vitamini sağlar. Formül turunçgil biyoflavonoid kompleksi, kuşburnu, aserola ve rutin ile zenginleştirilmiştir.',
    features: [
      'Her 2 kapsülde 1000 mg PureWay-C® formunda C vitamini içerir.',
      'Turunçgil biyoflavonoid kompleksi ile zenginleştirilmiştir.',
      'Kuşburnu (Rosa canina) meyve tozu içerir.',
      'Aserola meyve özü ile desteklenmiştir.',
      'Rutin içeren özel formüle sahiptir.',
      '60 kapsül içeren ambalajda sunulmaktadır.',
      'Takviye edici gıda olarak üretilmiştir.',
    ],
    composition: [
      { name: 'Vitamin C (PureWay™ L-Askorbik Asit)', amount: '1000 mg' },
      { name: 'Turunçgil Biyoflavonoid Kompleksi', amount: '50 mg' },
      { name: 'Kuşburnu Tozu (Rosa canina)', amount: '20 mg' },
      {
        name: 'Aserola Meyve Tozu Ekstresi (Malpighia glabra L.)',
        amount: '20 mg',
      },
      { name: 'Rutin', amount: '10 mg' },
    ],
    keyIngredients: [
      'PureWay-C®',
      '1000 mg C Vitamini',
      'Biyoflavonoid',
      'Kuşburnu',
      'Aserola',
      'Rutin',
    ],
    highlights: [
      {
        title: 'C Vitamini · bağışıklık',
        detail:
          'Bağışıklık sisteminin normal fonksiyonuna katkıda bulunur ve hücrelerin oksidatif strese karşı korunmasına katkı sağlar.',
      },
      {
        title: 'C Vitamini · enerji',
        detail:
          'Normal enerji oluşum metabolizmasını destekler; yorgunluk ve bitkinliğin azalmasına katkıda bulunur.',
      },
      {
        title: 'C Vitamini · kolajen',
        detail:
          'Normal kolajen oluşumuna katkı sağlayarak cilt, kemik, diş eti ve damarların normal fonksiyonlarını destekler.',
      },
      {
        title: 'C Vitamini · demir',
        detail: 'Demirin emilimini artırır.',
      },
    ],
    usage:
      '11 yaş ve üzeri yetişkinler için sabah 1 kapsül, akşam 1 kapsül; tercihen yemeklerden sonra bol su ile tüketiniz.',
    storage: STORAGE_DEFAULT,
    claimBasis: ['C Vitamini'],
    shopifyVariantId: '43107286450247',
  },
  {
    slug: 'd3k2',
    name: 'Vitamin D3K2',
    shortName: 'D3K2',
    category: 'Vitaminler',
    tagline: 'Işık Modu',
    subtitle: '20 mL oral damla · kolekalsiferol + menakinon-7',
    accent: '#FACC15',
    price: 390,
    unit: '20 mL',
    form: 'Damla',
    servingSize: '1 Damla',
    featured: true,
    motto: 'Damla damla, ölçülü.',
    description:
      'Luzayn Vitamin D3K2 Oral Damla, kolekalsiferol (D3 vitamini) ve menakinon-7 (K2 vitamini) içeren takviye edici gıdadır. Damlalıklı şişe tasarımı kolay ve pratik kullanım sağlar.',
    features: [
      'Her 1 damlada 1000 IU (25 µg) D3 vitamini içerir.',
      'Her 1 damlada 11,25 µg K2 vitamini içerir.',
      'D3 (kolekalsiferol) ve K2 (menakinon-7) vitaminlerini bir arada sunar.',
      'Oral damla formu sayesinde pratik kullanım sağlar.',
      'Damlalıklı şişe tasarımı ile kolay tüketim imkânı sunar.',
      '20 mL ambalajda sunulmaktadır.',
      'Takviye edici gıda olarak üretilmiştir.',
    ],
    composition: [
      { name: 'D Vitamini (Kolekalsiferol)', amount: '25 µg (1000 IU)' },
      { name: 'K2 Vitamini (Menakinon-7)', amount: '11,25 µg' },
    ],
    keyIngredients: [
      '1000 IU D3',
      'Kolekalsiferol',
      '11,25 µg K2',
      'Menakinon-7',
      '20 mL',
    ],
    highlights: [
      {
        title: 'D Vitamini · kemik ve diş',
        detail:
          'Normal kemiklerin ve normal dişlerin korunmasına katkı sağlar.',
      },
      {
        title: 'D Vitamini · bağışıklık ve kas',
        detail:
          'Bağışıklık sisteminin normal fonksiyonuna ve normal kas fonksiyonunun korunmasına katkıda bulunur.',
      },
      {
        title: 'D Vitamini · kalsiyum',
        detail:
          'Kalsiyum ve fosforun normal emilimine ve kullanımına, normal kan kalsiyum düzeyinin korunmasına katkıda bulunur.',
      },
      {
        title: 'K2 Vitamini',
        detail: 'Normal kemiklerin korunmasına katkıda bulunur.',
      },
    ],
    usage:
      '11 yaş ve üzeri bireyler için günde 1 damla. Doğrudan ağıza damlatılarak veya bir içeceğe eklenerek tüketilebilir.',
    storage: STORAGE_DEFAULT,
    claimBasis: ['D Vitamini', 'K2 Vitamini'],
    shopifyVariantId: '43107286483015',
  },
  {
    slug: 'coenzym',
    name: 'Coenzym Q10',
    shortName: 'Coenzym Q10',
    category: 'Koenzim Q10',
    tagline: 'Hücre Modu',
    subtitle: '100 mg · tek bileşenli formül',
    accent: '#EF4444',
    price: 560,
    unit: '30 Softgel',
    form: 'Softgel',
    servingSize: '1 Yumuşak Kapsül',
    motto: 'Sade formül, tek bileşen.',
    description:
      'Luzayn Coenzyme Q10, her yumuşak kapsülde 100 mg koenzim Q10 içeren takviye edici gıdadır. Koenzim Q10, insan vücudunda doğal olarak bulunan ve özellikle enerji ihtiyacının yüksek olduğu dokularda yer alan bir bileşendir. Günlük kullanıma uygun formülü, pratik softgel yapısı sayesinde kolay tüketim imkânı sunar.',
    features: [
      'Her yumuşak kapsülde 100 mg koenzim Q10 içerir.',
      'Tek bileşenli koenzim Q10 formülüne sahiptir.',
      'Günlük kullanıma uygun olarak geliştirilmiştir.',
      'Yumuşak kapsül (softgel) formu sayesinde kolay tüketim sağlar.',
      '30 softgel kapsül içeren ambalajda sunulmaktadır.',
      'Takviye edici gıda olarak üretilmiştir.',
    ],
    composition: [{ name: 'Koenzim Q10', amount: '100 mg' }],
    keyIngredients: ['100 mg Q10', 'Tek Bileşen', 'Softgel'],
    highlights: [
      {
        title: 'Tek bileşenli formül',
        detail:
          'Karışım değil: yumuşak kapsül başına 100 mg koenzim Q10, başka aktif bileşen eklenmeden.',
      },
      {
        title: 'Neden softgel?',
        detail:
          'Koenzim Q10 suda değil yağda çözünür. Softgel, bileşeni yağ fazının içinde tutar.',
      },
      {
        title: 'Beyan notu',
        detail:
          'Koenzim Q10 için yetkilendirilmiş bir sağlık beyanı bulunmamaktadır; bu sayfada Q10 yalnızca bileşim olarak tanımlanır.',
      },
    ],
    usage:
      '11 yaş ve üzeri bireyler için günde 1 yumuşak kapsül; tercihen yemeklerle birlikte veya sonrasında bol su ile tüketiniz.',
    storage: STORAGE_DEFAULT,
    claimBasis: [],
    shopifyVariantId: '43107286515783',
  },
  {
    slug: 'ro',
    name: 'RO',
    shortName: 'RO',
    category: 'Bitkisel Takviyeler',
    tagline: 'Sükûnet Modu',
    subtitle: 'Magnezyum, L-teanin ve bitkisel ekstraktlar',
    accent: '#14B8A6',
    price: 2800,
    unit: '60 Kapsül',
    form: 'Kapsül',
    servingSize: '2 Kapsül',
    motto: 'Günün sonuna doğru.',
    description:
      'Luzayn RO; magnezyum, L-teanin, valerian (Valeriana officinalis), passiflora (Passiflora incarnata), rodiola (Rhodiola rosea) ve safran (Crocus sativus) ekstreleri, koenzim Q10, çinko, B6 vitamini ve selenyum içeren özel formüle sahip takviye edici gıdadır.',
    features: [
      'Magnezyum, L-teanin ve bitkisel ekstraktları bir arada içerir.',
      'Safran, rodiola, valerian ve passiflora ekstraktları ile zenginleştirilmiştir.',
      'Koenzim Q10, çinko, B6 vitamini ve selenyum içerir.',
      'Çok bileşenli özel formüle sahiptir.',
      '60 kapsül içeren ambalajda sunulmaktadır.',
      'Takviye edici gıda olarak üretilmiştir.',
    ],
    composition: [
      { name: 'Magnezyum', amount: '250 mg' },
      { name: 'L-Teanin', amount: '150 mg' },
      { name: 'Valerian Ekstresi', amount: '100 mg' },
      { name: 'Passiflora Ekstresi', amount: '100 mg' },
      { name: 'Rodiola Ekstresi', amount: '100 mg' },
      { name: 'Koenzim Q10', amount: '100 mg' },
      { name: 'Safran Ekstresi', amount: '20 mg' },
      { name: 'Çinko', amount: '15 mg' },
      { name: 'Vitamin B6', amount: '10 mg' },
      { name: 'Selenyum', amount: '100 µg' },
    ],
    keyIngredients: [
      'Magnezyum',
      'L-Teanin',
      'Safran',
      'Rodiola',
      'Valerian',
      'Passiflora',
      'Koenzim Q10',
      'Çinko',
      'B6',
      'Selenyum',
    ],
    highlights: [
      {
        title: 'Magnezyum',
        detail:
          'Normal psikolojik fonksiyona ve sinir sisteminin normal fonksiyonuna katkıda bulunur.',
      },
      {
        title: 'B6 Vitamini',
        detail:
          'Normal psikolojik fonksiyona ve sinir sisteminin normal fonksiyonuna katkıda bulunur.',
      },
      {
        title: 'Çinko ve selenyum',
        detail: 'Hücrelerin oksidatif stresten korunmasına katkıda bulunur.',
      },
      {
        title: 'Bitkisel bileşenler',
        detail:
          'Safran, rodiola, valerian ve passiflora ekstreleri ile L-teanin formülün bitkisel matrisini oluşturur. Bu bileşenler için yetkilendirilmiş sağlık beyanı bulunmamaktadır.',
      },
    ],
    usage:
      '11 yaş ve üzeri bireyler için sabah 1 kapsül, akşam 1 kapsül; tercihen yemeklerden sonra bol su ile tüketiniz.',
    storage: STORAGE_DEFAULT,
    claimBasis: ['Magnezyum', 'B6 Vitamini', 'Çinko', 'Selenyum'],
    shopifyVariantId: '43107286581319',
  },
  {
    slug: 'reishi',
    name: 'Reishi Mushroom & Echinacea',
    shortName: 'Reishi',
    category: 'Bitkisel Takviyeler',
    tagline: 'Kalkan Modu',
    subtitle: 'Üç mantar, ekinezya ve astragalus',
    accent: '#D97706',
    price: 2400,
    unit: '60 Kapsül',
    form: 'Kapsül',
    servingSize: '2 Kapsül',
    motto: 'Mantar ve kök, bir arada.',
    description:
      'Doğal içeriklerin sinerjisinden güç alan bu formül, geleneksel bitkisel ekstreleri modern antioksidanlar ve vitamin desteğiyle bir araya getirir. Reishi, shiitake ve maitake mantarı ekstreleri; ekinezya ve Çin geveni (astragalus) ekstreleri; C vitamini ve astaksantin içerir.',
    features: [
      'Ganoderma (reishi), shiitake ve maitake mantarı ekstrelerini bir arada içerir.',
      'Ekinezya ve Çin geveni (astragalus) ekstreleri ile desteklenmiştir.',
      'C vitamini (L-askorbik asit) içerir.',
      'Astaksantin ile zenginleştirilmiştir.',
      'Cam şişede sunulur; içeriğin saflığını korur.',
      '60 kapsül içeren ambalajda sunulmaktadır.',
      'Takviye edici gıda olarak üretilmiştir.',
    ],
    composition: [
      { name: 'Ganoderma (Reishi) Mantarı Ekstresi', amount: '300 mg' },
      { name: 'Shiitake Mantarı Ekstresi', amount: '200 mg' },
      { name: 'Maitake Mantarı Ekstresi', amount: '200 mg' },
      { name: 'Ekinezya Ekstresi', amount: '100 mg' },
      { name: 'Çin Geveni (Astragalus) Ekstresi', amount: '100 mg' },
      { name: 'C Vitamini (L-Askorbik Asit)', amount: '50 mg', nrv: '62,5' },
      { name: 'Astaksantin', amount: '200 µg' },
    ],
    keyIngredients: [
      'Reishi',
      'Shiitake',
      'Maitake',
      'Ekinezya',
      'Astragalus',
      'C Vitamini',
      'Astaksantin',
    ],
    highlights: [
      {
        title: 'C Vitamini',
        detail:
          'Bağışıklık sisteminin normal fonksiyonuna katkıda bulunur ve hücrelerin oksidatif stresten korunmasına katkı sağlar. Porsiyon başına 50 mg — beslenme referans değerinin %62,5’i.',
      },
      {
        title: 'Üç mantar ekstresi',
        detail:
          'Ganoderma lucidum (300 mg), Lentinula edodes (200 mg) ve Grifola frondosa (200 mg) aynı porsiyonda.',
      },
      {
        title: 'Ekinezya ve astragalus',
        detail:
          'Formülün bitkisel matrisini tamamlar. Bu bitkiler için yetkilendirilmiş sağlık beyanı bulunmamaktadır.',
      },
      {
        title: 'Cam ambalaj',
        detail:
          'Cam; ürünle etkileşime girmez, içeriğe koku, tat veya zararlı madde bırakmaz.',
      },
    ],
    usage: 'Yetişkinler için günde 2 kapsül tüketilmesi tavsiye edilir.',
    storage: STORAGE_DEFAULT,
    claimBasis: ['C Vitamini'],
    shopifyVariantId: '43107286810695',
  },
  {
    slug: 'xsls',
    name: 'XSLS',
    shortName: 'XSLS',
    category: 'Bitkisel Takviyeler',
    tagline: 'Botanik Modu',
    subtitle: 'Zeytin yaprağı, incir, karahindiba ve kordiseps',
    accent: '#22C55E',
    price: 6500,
    unit: '90 Kapsül',
    form: 'Kapsül',
    servingSize: '2 Kapsül',
    motto: 'Altı bitkisel bileşen, tek kutu.',
    description:
      'Luzayn XSLS; zeytin yaprağı ekstresi, incir ekstresi, karahindiba ekstresi, feverfew (Tanacetum parthenium) ekstresi, kordiseps mantarı ekstresi ve astaksantin içeren bitkisel içerikli takviye edici gıdadır. Özenle seçilmiş bitkisel ekstraktların bir araya getirildiği formülü günlük kullanıma uygun olarak geliştirilmiştir.',
    features: [
      'Zeytin yaprağı ekstresi (Olea europaea) içerir — oleuropein ve hidroksitirozol bakımından zengin standardize ekstrakt.',
      'İncir ekstresi (Ficus carica) içerir — polifenol ve flavonoid kaynaklı meyve ekstraktı.',
      'Karahindiba ekstresi (Taraxacum officinale) içerir.',
      'Feverfew ekstresi (Tanacetum parthenium) içerir — partenolid içeren seskiterpen laktonlar.',
      'Kordiseps mantarı ekstresi (Cordyceps sinensis) içerir.',
      'Mikroalg kaynaklı astaksantin ile zenginleştirilmiştir.',
      '90 kapsül içeren ambalajda sunulmaktadır (net 73,8 g).',
      'Takviye edici gıda olarak üretilmiştir.',
    ],
    composition: [
      { name: 'Zeytin Yaprağı Ekstresi (Olea europaea)', amount: '450 mg' },
      { name: 'İncir Ekstresi (Ficus carica)', amount: '450 mg' },
      { name: 'Karahindiba Ekstresi (Taraxacum officinale)', amount: '286 mg' },
      { name: 'Feverfew Ekstresi (Tanacetum parthenium)', amount: '100 mg' },
      {
        name: 'Kordiseps Mantarı Ekstresi (Cordyceps sinensis)',
        amount: '100 mg',
      },
      { name: 'Astaksantin', amount: '300 µg' },
    ],
    keyIngredients: [
      'Zeytin Yaprağı',
      'İncir',
      'Karahindiba',
      'Feverfew',
      'Kordiseps',
      'Astaksantin',
    ],
    highlights: [
      {
        title: 'Zeytin yaprağı ve incir',
        detail:
          'Porsiyon başına 450’şer mg. Zeytin yaprağı oleuropein ve hidroksitirozol bakımından standardize edilmiştir; incir ekstresi polifenol ve flavonoid içerir.',
      },
      {
        title: 'Karahindiba ve feverfew',
        detail:
          'Karahindiba 286 mg, feverfew 100 mg. Feverfew başta partenolid olmak üzere seskiterpen laktonlar içerir.',
      },
      {
        title: 'Kordiseps ve astaksantin',
        detail:
          'Kordiseps 100 mg; polisakkaritler, kordisepin ve adenozin türevleri içerir. Astaksantin mikroalg kaynaklı bir karotenoiddir (300 µg).',
      },
      {
        title: 'Beyan notu',
        detail:
          'Bu formüldeki bitkisel bileşenler için yetkilendirilmiş sağlık beyanı bulunmamaktadır; bileşenler yalnızca bileşim olarak tanımlanır.',
      },
    ],
    usage: 'Yetişkinler için günde 2 kapsül tüketilmesi tavsiye edilir.',
    storage: STORAGE_DEFAULT,
    claimBasis: [],
    shopifyVariantId: '43107286876231',
  },
]

export const PRODUCT_BY_SLUG = Object.fromEntries(
  PRODUCTS.map((p) => [p.slug, p]),
) as Record<ProductSlug, ProductMeta>

/** Ana sayfa rayında ve nav dropdown'ında öne çıkanlar */
export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured)

/** Katalog kategorileri — ürün sırasını koruyarak benzersizleştirilir */
export const PRODUCT_CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))]

/**
 * Beyan uyarısı. Mevzuat referansı luzayn.com ürün sayfalarında da
 * dipnot olarak kullanılan kaynaktır.
 */
export const CLAIM_DISCLAIMER =
  'Beyanlar yalnızca ürünün içerdiği vitamin, mineral ve yağ asitlerine ait, mevzuatça izin verilen ifadelerdir (Gıda ve Takviye Edici Gıdalarda Sağlık Beyanı Kullanımı Hakkında Yönetmelik — 32169 sayılı, 20.04.2023 tarihli Resmî Gazete). Takviye edici gıdalar normal beslenmenin yerine geçmez; hastalıkların önlenmesi veya tedavisi amacıyla kullanılmaz. Tavsiye edilen günlük porsiyonu aşmayınız.'

export const CDN_PATHS = {
  cover: (slug: string) => `/covers/${slug}.jfif`,
  image: (slug: string) => `/images/${slug}.jfif`,
  videoDesktop: (slug: string) => `/videos/desktop/${slug}.mp4`,
  videoMobile: (slug: string) => `/videos/mobile/${slug}.mp4`,
} as const

/**
 * Şirket bilgileri. Ambalajdan okunabilen alanlar doldurulmuştur; render'da
 * net okunamayan kayıt numaraları BOŞ bırakıldı — asla uydurulmaz.
 * Yasal sayfalar ve mesafeli satış sözleşmesi bunları kullanır.
 */
export const SITE = {
  name: 'Luzayn',
  legalName: 'Luzayn Vitamin Sağlık Ürn. San. Tic. A.Ş.',
  tagline: 'Bilimin ölçtüğü, doğanın verdiği',
  description:
    'Luzayn; vitamin, mineral ve bitkisel bileşenlerden oluşan takviye edici gıda serisi. Her formülün içeriği, miktarı ve dayanağı açıkça yazılıdır.',
  email: 'info@luzayn.com',
  phone: '+90 533 412 53 42',
  /** Uluslararası format, boşluksuz — wa.me linki için */
  whatsapp: '905334125342',
  address: 'Üsküdar, İstanbul',
  fullAddress:
    'Aziz Mahmut Hüdayi Mah. Gülfem Sk. Erkmen Han No: 5/12 Üsküdar / İstanbul',
  /**
   * HÂLÂ EKSİK — müşteriden gelecek. Boş oldukları sürece arayüzde hiç
   * gösterilmezler (yer tutucu metin basmak yerine satır gizlenir).
   * Mesafeli satış sözleşmesi bunlar olmadan hukuken eksiktir.
   */
  businessRegNo: '',
  supplementApprovalNo: '',
  mersis: '',
  taxOffice: '',
  taxNumber: '',
  origin: 'Türkiye',
  url: 'https://luzayn.com',
  /** Yalnızca var olan hesaplar listelenir. */
  social: {
    instagram: 'https://www.instagram.com/luzayntr/',
  },
} as const

/** Ambalaj üzerindeki sertifika işaretleri */
export const CERTIFICATIONS = [
  { code: 'GMP', label: 'İyi Üretim Uygulamaları' },
  { code: 'ISO', label: 'Kalite Yönetim Sistemi' },
  { code: 'HACCP', label: 'Gıda Güvenliği Yönetimi' },
  { code: 'FDA', label: 'Tesis Kaydı' },
] as const

/**
 * Kargo ve iade — Shopify'daki gerçek ayarlarla hizalı.
 *
 * Shopify Domestic bölgesinde iki yöntem var (Standart 116 TL, Hızlı 299 TL)
 * ve ÜCRETSİZ KARGO EŞİĞİ TANIMLI DEĞİL. Bu yüzden `freeShippingThreshold`
 * null: sepette ücretsiz kargo vaadi gösterilmez. Hangi yöntemin seçileceği
 * checkout'ta belli olduğu için sepet tutarı kargosuz gösterilir.
 *
 * Shopify'a eşik tanımlanırsa buraya sayı yazmak yeterli; ilerleme çubuğu
 * ve "ücretsiz" rozeti otomatik geri gelir.
 */
export type CommerceConfig = {
  freeShippingThreshold: number | null
  standardShippingFee: number
  returnDays: number
}

export type BundleConfig = {
  name: string
  tagline: string
  slugs: Array<ProductSlug>
  discountRate: number
}

export const COMMERCE: CommerceConfig = {
  freeShippingThreshold: null,
  standardShippingFee: 116,
  returnDays: 14,
}

/**
 * Ana sayfadaki set teklifi.
 * `discountRate` 0 olduğu sürece indirim/üstü çizili fiyat GÖSTERİLMEZ —
 * uydurma çapa fiyat kurulmaz. Gerçek set indirimi belirlendiğinde
 * (örn. 0.1 = %10) yalnızca bu değer güncellenir.
 */
export const BUNDLE = {
  slugs: ['magnesium', 'omega3', 'vitaminc', 'd3k2'] as Array<ProductSlug>,
  name: 'Günlük Temel Set',
  tagline: 'Dört Formül',
  discountRate: 0,
} as const

export function bundleTotals() {
  const items = BUNDLE.slugs.map((slug) => PRODUCT_BY_SLUG[slug])
  const listTotal = items.reduce((sum, p) => sum + p.price, 0)
  const total = Math.round(listTotal * (1 - BUNDLE.discountRate))
  return { items, listTotal, total, saving: listTotal - total }
}
