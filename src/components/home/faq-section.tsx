import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { CDN_PATHS } from '#/lib/brand'
import { useCatalog } from '#/lib/catalog-context'
import type { FaqItem } from '#/data/content'
import { mediaUrl } from '#/lib/media'
import { FaqAccordion } from '#/components/shared/faq-accordion'
import {
  KickerRuled,
  SectionLead,
  SectionTitle,
} from '#/components/ui/typography'

export function FaqSection({ items }: { items: Array<FaqItem> }) {
  const { bySlug } = useCatalog()

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <img
        src={mediaUrl(bySlug.reishi?.cover ?? CDN_PATHS.cover('reishi'))}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#0a0a12]/95 via-[#0a0a12]/85 to-[#0a0a12]/95"
      />

      <div className="container relative mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <KickerRuled>Sık Sorulanlar</KickerRuled>
            <SectionTitle dark className="mt-5">
              Merak edilenler.
            </SectionTitle>
            <SectionLead dark className="mt-4">
              Kullanım, saklama, kargo ve iade hakkında en çok gelen sorular.
              Yanıtını bulamadığınız bir konu varsa bize yazın.
            </SectionLead>
            <Link
              to="/iletisim"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Soru Sorun
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <FaqAccordion items={items} dark />
        </div>
      </div>
    </section>
  )
}
