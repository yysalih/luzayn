import { CDN_PATHS, PRODUCT_BY_SLUG } from '#/lib/brand'
import type { ProductSlug } from '#/lib/brand'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export type HeroSlide = {
  id: ProductSlug
  title: string
  description: string
  accent: string
  videoDesktop: string
  videoMobile: string
  poster: string
  ctaLabel: string
}

/**
 * Hero spektrumu — serinin TAMAMI, katalog sırasıyla.
 * Her slaytın satırı porsiyon başına gerçek rakamı söyler; hero'da uzun
 * açıklama yer kaplıyordu, o yüzden tek cümlelik özet kullanılır.
 */
const HERO_ORDER: Array<{ slug: ProductSlug; line: string }> = [
  {
    slug: 'magnesium',
    line: 'İki kapsülde 250 mg magnezyum — beş farklı formda.',
  },
  {
    slug: 'omega3',
    line: 'Bir softgelde 700 mg omega-3: 360 mg EPA, 240 mg DHA.',
  },
  {
    slug: 'vitaminc',
    line: 'İki kapsülde PureWay-C® formunda 1000 mg C vitamini.',
  },
  { slug: 'd3k2', line: 'Bir damlada 1000 IU D3 ve 11,25 µg K2.' },
  {
    slug: 'coenzym',
    line: 'Bir yumuşak kapsülde 100 mg koenzim Q10 — tek bileşen.',
  },
  {
    slug: 'ro',
    line: 'İki kapsülde on bileşen; her birinin miktarı yazılı.',
  },
  {
    slug: 'reishi',
    line: 'İki kapsülde üç mantar ekstresi: 300, 200 ve 200 mg.',
  },
  { slug: 'xsls', line: 'İki kapsülde 1.386 mg bitkisel ekstre.' },
]

export const HERO_SLIDES: Array<HeroSlide> = HERO_ORDER.map(
  ({ slug, line }) => {
    const p = PRODUCT_BY_SLUG[slug]
    return {
      id: slug,
      title: p.motto,
      description: line,
      accent: p.accent,
      videoDesktop: CDN_PATHS.videoDesktop(slug),
      videoMobile: CDN_PATHS.videoMobile(slug),
      poster: CDN_PATHS.cover(slug),
      ctaLabel: `${p.shortName} İncele`,
    }
  },
)

/**
 * Marquee chip'leri. Her chip serideki bir ürünün accent'ini taşır —
 * tek renkli bir şerit yerine paletin tamamı akar.
 */
export type HeroTag = { label: string; accent: string }

export const HERO_TAGS: Array<HeroTag> = [
  { label: 'Takviye Edici Gıda', accent: PRODUCT_BY_SLUG.magnesium.accent },
  { label: 'GMP Sertifikalı Üretim', accent: PRODUCT_BY_SLUG.omega3.accent },
  { label: 'HACCP', accent: PRODUCT_BY_SLUG.ro.accent },
  { label: 'Menşei: Türkiye', accent: PRODUCT_BY_SLUG.xsls.accent },
  { label: 'Etiket Şeffaflığı', accent: PRODUCT_BY_SLUG.d3k2.accent },
  { label: 'ISO Kalite Yönetimi', accent: PRODUCT_BY_SLUG.reishi.accent },
  { label: '8 Formül', accent: PRODUCT_BY_SLUG.vitaminc.accent },
  { label: 'Miktarı Yazılı Bileşen', accent: PRODUCT_BY_SLUG.coenzym.accent },
]

/* ------------------------------------------------------------------ */
/* Dikey video duvarı — hero'ya girmeyen dört ürün                     */
/* ------------------------------------------------------------------ */

export const VIDEO_WALL_SLUGS: Array<ProductSlug> = [
  'coenzym',
  'reishi',
  'ro',
  'vitaminc',
]

/* ------------------------------------------------------------------ */
/* Kanıt / sayılar — hepsi etiketten okunur veya etiket verisinden      */
/* hesaplanır. Doğrulanamayan hiçbir rakam buraya girmez.               */
/* ------------------------------------------------------------------ */

export type EvidenceStat = {
  slug: ProductSlug
  /** Halka dolumu 0-100. Oran anlamlı değilse null — o kart büyük rakam gösterir. */
  ring: number | null
  value: string
  unit?: string
  title: string
  context: string
}

export const EVIDENCE_STATS: Array<EvidenceStat> = [
  {
    slug: 'd3k2',
    ring: 100,
    value: '%500',
    title: 'Bir damlada D3',
    context:
      '25 µg (1000 IU) kolekalsiferol — D vitamini için 5 µg olan beslenme referans değerinin 5 katı. Halka %100’de dolar.',
  },
  {
    slug: 'vitaminc',
    ring: 100,
    value: '%1250',
    title: 'İki kapsülde C vitamini',
    context:
      'PureWay-C® formunda 1000 mg C vitamini — 80 mg olan beslenme referans değerinin 12,5 katı. Halka %100’de dolar.',
  },
  {
    slug: 'omega3',
    ring: 70,
    value: '%70',
    title: 'Balık yağının omega-3 payı',
    context:
      '1000 mg balık yağının 700 mg’ı omega-3 yağ asidi; bunun 360 mg’ı EPA, 240 mg’ı DHA.',
  },
  {
    slug: 'omega3',
    ring: null,
    value: '2,4',
    unit: '×',
    title: 'Kalp fonksiyonu eşiği',
    context:
      'Beyanın dayandığı günlük 250 mg EPA + DHA alımının 2,4 katı (600 mg), tek yumuşak kapsülde.',
  },
  {
    slug: 'reishi',
    ring: 63,
    value: '%62,5',
    title: 'Reishi formülünde C vitamini',
    context:
      'İki kapsülde 50 mg L-askorbik asit — beslenme referans değerinin %62,5’i. Etiketteki tek beyanlı besin ögesi.',
  },
  {
    slug: 'magnesium',
    ring: null,
    value: '5',
    unit: 'form',
    title: 'Magnezyum kompleksi',
    context:
      'Malat, bisglisinat, L-threonate, sitrat ve taurat; iki kapsülde toplam 250 mg magnezyum.',
  },
  {
    slug: 'ro',
    ring: null,
    value: '10',
    unit: 'bileşen',
    title: 'RO formülü',
    context:
      'Magnezyum, L-teanin, valerian, passiflora, rodiola, koenzim Q10, safran, çinko, B6 ve selenyum — hepsinin miktarı yazılı.',
  },
  {
    slug: 'xsls',
    ring: null,
    value: '1.386',
    unit: 'mg',
    title: 'Porsiyon başına bitkisel ekstre',
    context:
      'İki kapsülde zeytin yaprağı 450, incir 450, karahindiba 286, feverfew 100 ve kordiseps 100 mg; ayrıca 300 µg astaksantin.',
  },
]

/* ------------------------------------------------------------------ */
/* Marka felsefesi                                                     */
/* ------------------------------------------------------------------ */

export type PhilosophyValue = { title: string; detail: string }

export type Philosophy = {
  kicker: string
  title: string
  intro: string
  values: Array<PhilosophyValue>
}

export const PHILOSOPHY: Philosophy = {
  kicker: 'Yaklaşımımız',
  title: 'Etikette ne yazıyorsa, kutuda o var.',
  intro:
    'Takviye edici gıdada belirsizlik iki yerde saklanır: bileşenin miktarında ve iddianın dayanağında. Luzayn her iki yeri de açıkta bırakır.',
  values: [
    {
      title: 'Miktar gizlenmez',
      detail:
        'Formüldeki her ana bileşenin miktarı ambalajda yazar. “Özel karışım” arkasına saklanan doz yok.',
    },
    {
      title: 'İddia bileşene bağlanır',
      detail:
        'Sağlık beyanı yalnızca mevzuatın izin verdiği vitamin, mineral ve yağ asitleri için kurulur. Bitkisel bileşenler bileşim olarak anılır, onlara beyan yüklenmez.',
    },
    {
      title: 'Form bilinçli seçilir',
      detail:
        'Yağda çözünen Q10 softgelde, doz ayarı gereken D3 damlada, beş farklı magnezyum tuzu tek kapsülde sunulur.',
    },
    {
      title: 'Üretim belgelenir',
      detail:
        'Seri, GMP ve HACCP kapsamında üretilir; ISO kalite yönetimi ve FDA tesis kaydı ambalajda işaretlidir.',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* SSS                                                                 */
/* ------------------------------------------------------------------ */

export type FaqItem = { question: string; answer: string }

export const FAQ: Array<FaqItem> = [
  {
    question: 'Takviye edici gıda ilaç mıdır?',
    answer:
      'Hayır. Takviye edici gıdalar normal beslenmenin yerine geçmez ve hastalıkların önlenmesi ya da tedavisi amacıyla kullanılmaz. Ambalajlarımızda da bu ifade yer alır.',
  },
  {
    question: 'Birden fazla ürünü aynı anda kullanabilir miyim?',
    answer:
      'Formüller birbirinden bağımsız çalışır, ancak bazı bileşenler birden fazla üründe bulunur (örneğin koenzim Q10 hem Omega 3’te hem Coenzym Q10’da, magnezyum hem Magnesium hem RO’da yer alır). Toplam günlük alımın tavsiye edilen porsiyonu aşmaması için birlikte kullanmadan önce hekiminize veya eczacınıza danışın.',
  },
  {
    question: 'Ürünler hangi durumlarda kullanılmamalı?',
    answer:
      'Hamilelik ve emzirme döneminde, ilaç kullanıyorsanız, kronik bir rahatsızlığınız varsa ya da bir cerrahi işlem planlanıyorsa kullanmadan önce hekiminize danışın. 4 yaş altı çocuklarda hekim önerisi olmadan kullanılmamalıdır. Bileşenlerden herhangi birine alerjiniz varsa kullanmayın.',
  },
  {
    question: 'Neden bazı ürünlerde sağlık beyanı yok?',
    answer:
      'Sağlık beyanı yalnızca mevzuatça yetkilendirilmiş besin ögeleri için kurulabilir. Reishi, kordiseps, safran, rodiola gibi bitkisel bileşenler için yetkilendirilmiş beyan bulunmadığından bu ürünlerde bileşenleri yalnızca bileşim olarak tanımlıyoruz. Eksik bilgi değil, bilinçli bir tercih.',
  },
  {
    question: 'Ürünler nerede üretiliyor?',
    answer:
      'Menşei Türkiye’dir. Üretim GMP ve HACCP kapsamında yapılır; ISO kalite yönetimi ve FDA tesis kaydı işaretleri ambalajda yer alır.',
  },
  {
    question: 'Ürünler nasıl saklanmalı?',
    answer:
      'Serin, kuru ve güneş ışığından uzak bir yerde, çocukların ulaşamayacağı konumda saklayın. D3K2 damla için ambalajda belirtilen saklama koşullarına uyun. Tavsiye edilen tüketim tarihi (TETT) ve parti numarası ambalaj üzerindedir.',
  },
  {
    question: 'Kargo ne zaman çıkar, ne kadar sürer?',
    answer:
      'Saat 15:00’e kadar verilen siparişler aynı iş günü içinde hazırlanır. Teslimat süresi kargo firmasının bölgenize göre değişen takvimine bağlıdır.',
  },
  {
    question: 'İade koşulları nedir?',
    answer:
      'Ambalajı açılmamış, kullanılmamış ve yeniden satılabilir durumdaki ürünler teslimattan itibaren 14 gün içinde iade edilebilir. Sağlık ve hijyen açısından ambalajı açılmış takviye edici gıdalar iade kapsamı dışındadır.',
  },
]

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

export type BlogSection = { heading: string; body: Array<string> }

export type BlogPost = {
  slug: string
  category: string
  categoryAccent: string
  title: string
  excerpt: string
  date: string
  readingMinutes: number
  cover: string
  sections: Array<BlogSection>
}

export const BLOG_POSTS: Array<BlogPost> = [
  {
    slug: 'takviye-etiketi-nasil-okunur',
    category: 'Etiket Okuma',
    categoryAccent: '#22D3EE',
    title: 'Bir takviye etiketi gerçekte ne söyler?',
    excerpt:
      'Ambalajın ön yüzü pazarlama, arka yüzü bilgidir. Arka yüzde hangi dört satıra bakmanız gerektiğini anlatıyoruz.',
    date: '2026-07-14',
    readingMinutes: 5,
    cover: CDN_PATHS.image('magnesium'),
    sections: [
      {
        heading: 'Önce bileşen miktarına bakın',
        body: [
          'Bir bileşenin adının yazması, anlamlı bir miktarda bulunduğu anlamına gelmez. Etikette her ana bileşenin yanında bir miktar (mg, µg, IU) görmelisiniz. Yalnızca “özel karışım” ya da “kompleks” yazıp toplam bir rakam veren etiketler, tek tek hangi bileşenin ne kadar olduğunu gizler.',
          'Luzayn ambalajlarında ana bileşenlerin miktarı ayrı ayrı yazılıdır; ürün sayfalarında da aynı rakamları tekrar ediyoruz.',
        ],
      },
      {
        heading: 'Günlük referans değeri (BRD) yorumlayın',
        body: [
          'Vitamin ve minerallerin yanındaki yüzde, o porsiyonun beslenme referans değerinin (BRD) ne kadarını karşıladığını gösterir. C vitamini için referans değer 80 mg, D vitamini için 5 µg’dır. Dolayısıyla 1000 mg C vitamini %1250, 25 µg D vitamini %500 anlamına gelir.',
          'Yüzdenin yüksek olması her zaman “daha iyi” demek değildir; bazı bileşenlerde tolere edilebilir üst alım düzeyleri vardır. Bu yüzden tavsiye edilen porsiyonu aşmamak önemlidir.',
        ],
      },
      {
        heading: 'Beyanın hangi bileşene ait olduğunu arayın',
        body: [
          'Mevzuat, sağlık beyanını ürüne değil bileşene bağlar. “Magnezyum yorgunluk ve bitkinliğin azalmasına katkıda bulunur” geçerli bir ifadedir; aynı cümleyi ürün adıyla kurmak değildir.',
          'Bitkisel bileşenlerin çoğu için yetkilendirilmiş beyan yoktur. Bir etikette bitkisel bir bileşene doğrudan fayda atfediliyorsa, o ifadenin dayanağını sorgulayın.',
        ],
      },
      {
        heading: 'Kayıt numarası ve parti bilgisini kontrol edin',
        body: [
          'Türkiye’de satılan takviye edici gıdalarda işletme kayıt numarası ve takviye edici gıda onay numarası ambalajda bulunur. Tavsiye edilen tüketim tarihi (TETT) ve parti numarası da ambalaj üzerinde yer almalıdır.',
          'Bu bilgiler yoksa ürünün kaydı hakkında soru sormak için iyi bir nedeniniz var demektir.',
        ],
      },
    ],
  },
  {
    slug: 'magnezyum-formlari-neden-farkli',
    category: 'Bileşen',
    categoryAccent: '#14B8A6',
    title: 'Magnezyum neden tek bir şey değil?',
    excerpt:
      'Sitrat, bisglisinat, malat, treonat, taurat… Aynı mineralin farklı tuzları neden ayrı ayrı anılıyor?',
    date: '2026-06-28',
    readingMinutes: 4,
    cover: CDN_PATHS.image('ro'),
    sections: [
      {
        heading: 'Mineral aynı, taşıyıcı farklı',
        body: [
          'Magnezyum saf hâlde alınmaz; her zaman bir asitle bağlı bir tuz olarak bulunur. Etikette gördüğünüz “magnezyum sitrat”, “magnezyum bisglisinat” gibi adlar bu bağı tarif eder. Mineralin kendisi değişmez, değişen taşıyıcıdır.',
          'Taşıyıcı, tuzun içindeki element magnezyum oranını ve suda çözünürlüğünü etkiler. Bu yüzden farklı formlar farklı miktarlarda saf magnezyum içerir.',
        ],
      },
      {
        heading: 'Formülde birden fazla form ne işe yarar?',
        body: [
          'Tek bir tuza bağlı kalmak yerine birkaç formu bir arada sunmak, formülün toplam magnezyumunu tek bir taşıyıcının özelliklerine bağımlı olmaktan çıkarır. Luzayn Magnesium bu nedenle malat, bisglisinat, L-threonate, sitrat ve taurat formlarını birleştirir.',
        ],
      },
      {
        heading: 'Beyan neye dayanır?',
        body: [
          'Hangi form kullanılırsa kullanılsın, beyan magnezyumun kendisine aittir: magnezyum yorgunluk ve bitkinliğin azalmasına, normal kas fonksiyonuna, sinir sisteminin normal fonksiyonuna ve normal psikolojik fonksiyona katkıda bulunur.',
          'Bir formun diğerinden üstün olduğuna dair yetkilendirilmiş bir beyan yoktur; bu yüzden böyle bir iddiada bulunmuyoruz.',
        ],
      },
    ],
  },
  {
    slug: 'epa-dha-ve-250-mg-esigi',
    category: 'Bileşen',
    categoryAccent: '#3B82F6',
    title: 'EPA ve DHA’da 250 mg neden bu kadar sık geçiyor?',
    excerpt:
      'Omega-3 etiketlerinde tekrar eden bir eşik var. Bu sayının nereden geldiğini ve etikette ne anlama geldiğini açıklıyoruz.',
    date: '2026-06-09',
    readingMinutes: 4,
    cover: CDN_PATHS.image('omega3'),
    sections: [
      {
        heading: 'Balık yağı ile omega-3 aynı şey değil',
        body: [
          'Bir softgelde “1000 mg balık yağı” yazması, 1000 mg omega-3 aldığınız anlamına gelmez. Balık yağının içinde EPA ve DHA belirli bir oranda bulunur; geri kalanı diğer yağ asitleridir.',
          'Luzayn Omega 3’te 1000 mg balık yağının 700 mg’ı omega-3 yağ asididir; bunun 360 mg’ı EPA, 240 mg’ı DHA’dır — yani EPA + DHA toplamı 600 mg.',
        ],
      },
      {
        heading: 'Eşik, beyanın kullanım koşuludur',
        body: [
          'EPA ve DHA’nın normal kalp fonksiyonunun devamına katkıda bulunduğu yönündeki beyan, günlük 250 mg EPA + DHA alımı koşuluyla kullanılabilir. Aynı şekilde DHA’nın normal beyin fonksiyonuna ve normal görmenin korunmasına katkısı için günlük 250 mg DHA koşulu geçerlidir.',
          'Yani 250 mg bir hedef değil, beyanın geçerli olması için etiketin sağlaması gereken bir koşuldur. Etikette beyanı görüyorsanız, yanında bu koşulun da yazması gerekir.',
        ],
      },
      {
        heading: 'Etikete nasıl bakmalı?',
        body: [
          'Toplam balık yağı miktarına değil, EPA ve DHA satırlarına bakın. İki rakamı toplayın ve tavsiye edilen porsiyonla çarpın. Elinizdeki sayı, gerçekte aldığınız omega-3 miktarıdır.',
        ],
      },
    ],
  },
  {
    slug: 'bitkisel-bilesenlerde-beyan-meselesi',
    category: 'Mevzuat',
    categoryAccent: '#22C55E',
    title: 'Bitkisel bileşenlerde beyan neden yok?',
    excerpt:
      'Reishi, kordiseps, safran, rodiola: yüzyıllardır kullanılıyorlar ama etiketlerinde fayda cümlesi göremezsiniz. Nedeni basit.',
    date: '2026-05-22',
    readingMinutes: 3,
    cover: CDN_PATHS.image('reishi'),
    sections: [
      {
        heading: 'Beyan listesi kapalı bir listedir',
        body: [
          'Gıdalarda kullanılabilecek sağlık beyanları önceden değerlendirilip yetkilendirilmiş bir listeye dayanır. Vitaminler, mineraller ve bazı yağ asitleri bu listede yer alır. Bitkisel bileşenlerin büyük kısmı için değerlendirme tamamlanmamıştır.',
          'Bu, “bitki işe yaramaz” demek değildir; “bu ifadeyi etikete yazmaya izin veren bir değerlendirme yok” demektir. Aradaki fark önemlidir.',
        ],
      },
      {
        heading: 'Biz ne yapıyoruz?',
        body: [
          'Reishi, kordiseps, safran, rodiola, valerian ve karahindiba içeren formüllerimizde bu bileşenleri yalnızca bileşim olarak tanımlıyoruz: hangi bitki, hangi tür, formülün neresinde.',
          'Beyan gerektiren tek yer, ürünün içerdiği vitamin ve mineraller. Örneğin Reishi Mushroom & Echinacea formülündeki beyan, ekinezyaya değil C vitaminine aittir.',
        ],
      },
      {
        heading: 'Okur için pratik sonuç',
        body: [
          'Bir bitkisel takviyenin etiketinde iddialı bir fayda cümlesi görüyorsanız, cümlenin hangi bileşene bağlandığına bakın. Bileşen bir vitamin veya mineralse ifade yerindedir. Doğrudan bitkiye bağlanmışsa, o ifadenin dayanağını sormak sizin hakkınızdır.',
        ],
      },
    ],
  },
]

export const BLOG_BY_SLUG = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p]),
) as Record<string, BlogPost>

export function formatBlogDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}
