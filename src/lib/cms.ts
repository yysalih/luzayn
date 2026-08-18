import { CDN_PATHS } from '#/lib/brand'
import { requireSupabase } from '#/lib/supabase'
import type {
  BundleConfig,
  CommerceConfig,
  CompositionRow,
  ProductHighlight,
  ProductMeta,
  ProductSlug,
} from '#/lib/brand'
import type {
  BlogPost,
  EvidenceStat,
  FaqItem,
  HeroSlide,
  HeroTag,
  Philosophy,
} from '#/data/content'

/**
 * İçerik katmanı — yönetim panelinin yazdığı Supabase tablolarını sitenin
 * kendi tiplerine çevirir.
 *
 * NEDEN AYRI BİR EŞLEME KATMANI: bileşenler bugün `ProductMeta` bekliyor.
 * Veritabanı sütun adları (snake_case, usage_text/storage_text) ile bu tip
 * birebir aynı değil. Eşlemeyi tek yerde yaparsak bileşenlerin hiçbiri
 * veritabanının varlığından haberdar olmak zorunda kalmaz — ileride kaynak
 * değişirse yalnızca bu dosya değişir.
 *
 * OKUMA YETKİSİ: anon anahtar yalnızca `status = 'published'` satırları
 * görür (RLS). Bu yüzden burada ayrıca durum filtresi YAZILMIYOR — iki yerde
 * filtrelemek, birinin unutulduğunda diğerinin koruduğu yanılgısını doğurur.
 * Tek kapı politikalar.
 */

/* ------------------------------------------------------------------ */
/* Satır tipleri — panelin şemasıyla birebir                           */
/* ------------------------------------------------------------------ */

interface ProductRow {
  slug: string
  name: string
  short_name: string
  category: string
  tagline: string
  subtitle: string
  accent: string
  price: string | number
  unit: string
  form: string
  serving_size: string
  motto: string
  description: string
  usage_text: string
  storage_text: string
  features: Array<string>
  key_ingredients: Array<string>
  composition: Array<CompositionRow>
  highlights: Array<ProductHighlight>
  claim_basis: Array<string>
  shopify_variant_id: string
  cover_url: string | null
  image_url: string | null
  featured: boolean
  in_stock: boolean
  sort_order: number
}

function toProduct(row: ProductRow): ProductMeta {
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    category: row.category,
    tagline: row.tagline,
    subtitle: row.subtitle,
    accent: row.accent,
    // PostgREST numeric'i STRING olarak döndürür ("860.00"). Number'a
    // çevirmezsek fiyat toplamaları string birleştirmesine dönüşür.
    price: Number(row.price),
    unit: row.unit,
    form: row.form as ProductMeta['form'],
    servingSize: row.serving_size,
    featured: row.featured,
    inStock: row.in_stock,
    motto: row.motto,
    description: row.description,
    features: row.features ?? [],
    composition: row.composition ?? [],
    keyIngredients: row.key_ingredients ?? [],
    highlights: row.highlights ?? [],
    usage: row.usage_text,
    storage: row.storage_text,
    claimBasis: row.claim_basis ?? [],
    shopifyVariantId: row.shopify_variant_id,
    // Boşsa slug'dan türet — kural sitede tek yerde duruyor (CDN_PATHS).
    cover: row.cover_url || CDN_PATHS.cover(row.slug),
    image: row.image_url || CDN_PATHS.image(row.slug),
  }
}

/* ------------------------------------------------------------------ */
/* Katalog                                                             */
/* ------------------------------------------------------------------ */

export interface Catalog {
  products: Array<ProductMeta>
  bySlug: Record<string, ProductMeta>
  categories: Array<string>
  featured: Array<ProductMeta>
  commerce: CommerceConfig
  bundle: BundleConfig
}

const PRODUCT_COLUMNS =
  'slug, name, short_name, category, tagline, subtitle, accent, price, unit, form, serving_size, motto, description, usage_text, storage_text, features, key_ingredients, composition, highlights, claim_basis, shopify_variant_id, cover_url, image_url, featured, in_stock, sort_order'

/**
 * Katalog önbelleği.
 *
 * Kök route ve sayfa loader'ları aynı katalogu istiyor. Önbellek olmadan tek
 * bir sayfa yüklemesi aynı sekiz satırı iki kez çekerdi.
 *
 * DEĞER DEĞİL PROMISE saklanıyor: iki loader aynı anda çağırdığında ikisi de
 * aynı isteği bekler, iki paralel sorgu açılmaz. Bu, ilk isteğin en sık
 * karşılaşılan durum olduğu SSR'da fark yaratır.
 *
 * Hata durumunda önbellek TEMİZLENİR — başarısız bir okumayı 30 saniye
 * boyunca tekrar tekrar döndürmek, geçici bir kesintiyi kalıcı hataya
 * çevirirdi.
 *
 * Süre panelde yapılan bir değişikliğin sitede görünmesini en fazla bu kadar
 * geciktirir. Yalnızca yayınlanmış içerik önbelleklendiği için kullanıcıya
 * özel veri sızma ihtimali yok.
 */
const CATALOG_TTL_MS = 30_000
let catalogCache: { at: number; promise: Promise<Catalog> } | null = null

export function loadCatalog(): Promise<Catalog> {
  const now = Date.now()
  if (catalogCache && now - catalogCache.at < CATALOG_TTL_MS)
    return catalogCache.promise

  const promise = fetchCatalog().catch((err) => {
    catalogCache = null
    throw err
  })

  catalogCache = { at: now, promise }
  return promise
}

async function fetchCatalog(): Promise<Catalog> {
  const db = requireSupabase()

  // İki sorgu paralel: ürünler ve ticari ayarlar birbirine bağlı değil.
  const [productsResult, settingsResult] = await Promise.all([
    db.from('products').select(PRODUCT_COLUMNS).order('sort_order'),
    db.from('commerce_settings').select('*').eq('id', 1).maybeSingle(),
  ])

  if (productsResult.error)
    throw new Error(`Ürünler okunamadı: ${productsResult.error.message}`)
  if (settingsResult.error)
    throw new Error(`Ticari ayarlar okunamadı: ${settingsResult.error.message}`)

  const products = ((productsResult.data ?? []) as Array<ProductRow>).map(
    toProduct,
  )

  const s = settingsResult.data

  return {
    products,
    bySlug: Object.fromEntries(products.map((p) => [p.slug, p])),
    categories: [...new Set(products.map((p) => p.category))],
    featured: products.filter((p) => p.featured),
    commerce: {
      // NULL'u 0'a ÇEVİRME. `?? 0` burada sessiz bir ticari hataydı:
      // NULL "ücretsiz kargo eşiği yok" demek, 0 ise "her tutarda ücretsiz".
      // Sepet ikincisini okuyup koşulsuz ücretsiz kargo vaat ediyordu.
      freeShippingThreshold:
        s?.free_shipping_threshold == null
          ? null
          : Number(s.free_shipping_threshold),
      standardShippingFee: Number(s?.standard_shipping_fee ?? 0),
      returnDays: Number(s?.return_days ?? 14),
    },
    bundle: {
      name: s?.bundle_name ?? '',
      tagline: s?.bundle_tagline ?? '',
      slugs: (s?.bundle_slugs ?? []) as Array<ProductSlug>,
      discountRate: Number(s?.bundle_discount_rate ?? 0),
    },
  }
}

/**
 * Set teklifinin fiyat matematiği.
 *
 * brand.ts'teki bundleTotals()'un katalog alan hali. Setteki bir ürün
 * yayından kaldırılmışsa toplamdan da düşer — aksi halde sepete
 * eklenemeyecek bir ürünün fiyatı toplamda görünürdü.
 *
 * discountRate 0 olduğu sürece saving 0 kalır ve site üstü çizili fiyat
 * göstermez; uydurma çapa fiyat kurulmaz.
 */
export function bundleTotals(catalog: Catalog) {
  const items = catalog.bundle.slugs.flatMap(
    (slug) => catalog.bySlug[slug] ?? [],
  )
  const listTotal = items.reduce((sum, p) => sum + p.price, 0)
  const total = Math.round(listTotal * (1 - catalog.bundle.discountRate))
  return { items, listTotal, total, saving: listTotal - total }
}

/* ------------------------------------------------------------------ */
/* Ana sayfa vitrini                                                   */
/* ------------------------------------------------------------------ */

export interface HomeContent {
  heroSlides: Array<HeroSlide>
  heroTags: Array<HeroTag>
  videoWallSlugs: Array<ProductSlug>
  evidenceStats: Array<EvidenceStat>
  philosophy: Philosophy | null
}

/**
 * Vitrin tabloları ürün verisini tekrarlamaz; başlık, renk ve video
 * ürünün kendi satırından okunur. Bu yüzden katalog parametre olarak
 * geliyor — iki kez çekilmesin diye.
 */
export async function loadHome(catalog: Catalog): Promise<HomeContent> {
  const db = requireSupabase()

  const [slides, tags, videos, stats, philosophy] = await Promise.all([
    db.from('hero_slides').select('product_slug, line').order('sort_order'),
    db.from('hero_tags').select('label, product_slug').order('sort_order'),
    db.from('video_wall_items').select('product_slug').order('sort_order'),
    db
      .from('evidence_stats')
      .select('product_slug, ring, value, unit, title, context')
      .order('sort_order'),
    db.from('philosophy').select('*').eq('id', 1).maybeSingle(),
  ])

  const firstError = [slides, tags, videos, stats, philosophy].find(
    (r) => r.error,
  )
  if (firstError?.error)
    throw new Error(`Vitrin okunamadı: ${firstError.error.message}`)

  return {
    // Ürünü silinmiş/taslağa alınmış satırlar düşürülür: RLS ürünü
    // gizlerken vitrin satırı yayında kalabilir ve o durumda karta
    // basılacak renk, video, başlık yoktur.
    heroSlides: (slides.data ?? []).flatMap((row) => {
      const p = catalog.bySlug[row.product_slug]
      if (!p) return []
      return [
        {
          id: p.slug,
          title: p.motto,
          description: row.line,
          accent: p.accent,
          videoDesktop: CDN_PATHS.videoDesktop(p.slug),
          videoMobile: CDN_PATHS.videoMobile(p.slug),
          poster: p.cover ?? CDN_PATHS.cover(p.slug),
          ctaLabel: `${p.shortName} İncele`,
        },
      ]
    }),

    heroTags: (tags.data ?? []).map((row) => ({
      label: row.label,
      accent: row.product_slug
        ? (catalog.bySlug[row.product_slug]?.accent ?? '')
        : '',
    })),

    videoWallSlugs: (videos.data ?? [])
      .map((row) => row.product_slug)
      .filter((slug) => Boolean(catalog.bySlug[slug])),

    evidenceStats: (stats.data ?? []).flatMap((row) => {
      if (!catalog.bySlug[row.product_slug]) return []
      return [
        {
          slug: row.product_slug,
          ring: row.ring,
          value: row.value,
          unit: row.unit || undefined,
          title: row.title,
          context: row.context,
        },
      ]
    }),

    philosophy: philosophy.data
      ? {
          kicker: philosophy.data.kicker,
          title: philosophy.data.title,
          intro: philosophy.data.intro,
          // Panelde `principles`, sitede `values`: VALUES Postgres'te
          // rezerve kelime olduğu için sütun adı ayrışıyor.
          values: philosophy.data.principles ?? [],
        }
      : null,
  }
}

/* ------------------------------------------------------------------ */
/* SSS                                                                 */
/* ------------------------------------------------------------------ */

export async function loadFaq(): Promise<Array<FaqItem>> {
  const db = requireSupabase()

  const { data, error } = await db
    .from('faq_items')
    .select('question, answer')
    .order('sort_order')

  if (error) throw new Error(`SSS okunamadı: ${error.message}`)
  return (data ?? []) as Array<FaqItem>
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

interface BlogRow {
  slug: string
  title: string
  excerpt: string
  category: string
  published_at: string
  read_minutes: number | null
  cover: string | null
  accent: string | null
  sections: Array<{ heading?: string; body: string }>
}

/**
 * Panelde bölüm gövdesi tek bir metin kutusu, sitede paragraf dizisi.
 * Boş satır ayracıyla bölüyoruz — seed de aynı ayraçla birleştirmişti.
 */
function toPost(row: BlogRow): BlogPost {
  return {
    slug: row.slug,
    category: row.category,
    categoryAccent: row.accent ?? '',
    title: row.title,
    excerpt: row.excerpt,
    date: row.published_at,
    readingMinutes: row.read_minutes ?? 0,
    cover: row.cover ?? '',
    sections: (row.sections ?? []).map((s) => ({
      heading: s.heading ?? '',
      body: s.body
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
    })),
  }
}

const BLOG_COLUMNS =
  'slug, title, excerpt, category, published_at, read_minutes, cover, accent, sections'

export async function loadBlogPosts(): Promise<Array<BlogPost>> {
  const db = requireSupabase()

  const { data, error } = await db
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .order('published_at', { ascending: false })

  if (error) throw new Error(`Blog yazıları okunamadı: ${error.message}`)
  return ((data ?? []) as Array<BlogRow>).map(toPost)
}

export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  const db = requireSupabase()

  const { data, error } = await db
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw new Error(`Yazı okunamadı: ${error.message}`)
  return data ? toPost(data as BlogRow) : null
}

/* ------------------------------------------------------------------ */
/* İletişim mesajı                                                     */
/* ------------------------------------------------------------------ */

export interface ContactRecord {
  name: string
  email: string
  phone?: string
  orderRef?: string
  subject: string
  message: string
}

/**
 * Mesajı gelen kutusuna yazar.
 *
 * Hata FIRLATMAZ, sonuç döndürür: bu çağrı e-posta gönderiminin yanında
 * ikinci bir kayıt yolu. Veritabanı yazımı başarısız diye kullanıcıya
 * "mesajınız gönderilemedi" demek yanlış olur — e-posta gitmiş olabilir.
 */
export async function recordContactMessage(
  input: ContactRecord,
): Promise<{ ok: boolean; error?: string }> {
  if (!supabaseAvailable()) return { ok: false, error: 'yapılandırılmamış' }

  const { error } = await requireSupabase()
    .from('contact_messages')
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      order_ref: input.orderRef || null,
      subject: input.subject,
      message: input.message,
      status: 'new',
    })

  return error ? { ok: false, error: error.message } : { ok: true }
}

function supabaseAvailable() {
  try {
    requireSupabase()
    return true
  } catch {
    return false
  }
}
