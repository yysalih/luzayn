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

export const Route = createFileRoute('/')({
  component: HomePage,
})

/**
 * Dikkat eğrisi: heyecan → güven → detay → kanıt → dönüşüm.
 * Koyu ve açık bölümler nöbetleşir; ritim scroll'da hissedilir.
 */
function HomePage() {
  return (
    <>
      <Hero />
      <TagStrip />
      <ProductRail />
      <VideoWall />
      <BundleSection />
      <Philosophy />
      <Banner />
      <TrustSection />
      <EvidenceCarousel />
      <IngredientShowcase />
      <FaqSection />
      <BlogPreview />
    </>
  )
}
