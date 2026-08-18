import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '#/components/home/hero'
import { TagStrip } from '#/components/home/tag-strip'
import { ProductRail } from '#/components/home/product-rail'
import { VideoWall } from '#/components/home/video-wall'
import { BundleSection } from '#/components/home/bundle-section'
import { Philosophy } from '#/components/home/philosophy'
import { Banner } from '#/components/home/banner'
import { TrustSection } from '#/components/home/trust-section'
import { EvidenceCarousel } from '#/components/home/evidence-carousel'
import { IngredientShowcase } from '#/components/home/ingredient-showcase'
import { FaqSection } from '#/components/home/faq-section'
import { BlogPreview } from '#/components/home/blog-preview'
import { loadBlogPosts, loadCatalog, loadFaq, loadHome } from '#/lib/cms'

export const Route = createFileRoute('/')({
  /**
   * Vitrin, SSS ve blog önizlemesi burada okunur.
   *
   * loadCatalog() kök route'ta da çağrılıyor ama ikinci bir sorgu açmıyor:
   * cms.ts kısa ömürlü bir önbellek tutuyor ve aynı promise'i döndürüyor.
   * Vitrin tabloları ürünün rengini, kapağını ve videosunu katalogdan
   * okuduğu için katalog burada da gerekli.
   */
  loader: async () => {
    const catalog = await loadCatalog()
    const [home, faq, posts] = await Promise.all([
      loadHome(catalog),
      loadFaq(),
      loadBlogPosts(),
    ])
    return { home, faq, posts }
  },
  component: HomePage,
})

/**
 * Dikkat eğrisi: heyecan → güven → detay → kanıt → dönüşüm.
 * Koyu ve açık bölümler nöbetleşir; ritim scroll'da hissedilir.
 */
function HomePage() {
  const { home, faq, posts } = Route.useLoaderData()

  // Ürün verisine ihtiyaç duyan bölümler (ray, set, bileşen vitrini) katalogu
  // kendileri bağlamdan okuyor; burada yalnızca sayfaya özel içerik aşağı
  // geçiriliyor. Prop olarak vermek bileşenleri ana sayfaya çivilemiyor —
  // FaqSection başka bir listeyle başka bir sayfada da çağrılabilir.
  return (
    <>
      <Hero slides={home.heroSlides} />
      <TagStrip tags={home.heroTags} />
      <ProductRail />
      <VideoWall slugs={home.videoWallSlugs} />
      <BundleSection />
      <Philosophy content={home.philosophy} />
      <Banner />
      <TrustSection />
      <EvidenceCarousel stats={home.evidenceStats} />
      <IngredientShowcase />
      <FaqSection items={faq} />
      <BlogPreview posts={posts} />
    </>
  )
}
