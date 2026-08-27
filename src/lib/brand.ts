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
  /**
   * Kapak ve ikinci görsel — ZORUNLU.
   *
   * cms.ts bunları her ürün için dolduruyor: panelde elle girilmiş bir yol
   * varsa o, yoksa slug'dan türetilen CDN yolu. Opsiyonel bırakıldıkları
   * sürece bileşenler `CDN_PATHS.cover(slug)` yazmayı sürdürdü ve panelden
   * girilen görsel sitede hiç görünmedi. Alanları zorunlu yapmak, doğru
   * kaynağı kullanmayı tek makul seçenek haline getiriyor.
   *
   * KURAL: bir ürünün görselini basarken CDN_PATHS'i ÇAĞIRMA, bu alanları
   * kullan. CDN_PATHS yalnızca cms.ts içinde ve ürüne bağlı olmayan
   * (video gibi) yollar için.
   */
  cover: string
  image: string
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

/*
 * COMMERCE, BUNDLE ve bundleTotals() ARTIK BURADA DEĞİL.
 *
 * Kargo eşiği, kargo bedeli, iade süresi ve set teklifi yönetim panelinden
 * yönetiliyor; site bunları katalogla birlikte okuyor
 * (`useCatalog().commerce` / `.bundle`, hesap için `bundleTotals(catalog)`
 * — ikisi de src/lib/cms.ts).
 *
 * Burada sabit bırakılsalardı iki kaynak olurdu: panelden değiştirilen bir
 * kargo bedeli, sözleşme metninde eski haliyle kalırdı.
 */
