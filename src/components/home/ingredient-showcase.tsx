import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { CDN_PATHS, CLAIM_DISCLAIMER } from '#/lib/brand'
import { useCatalog } from '#/lib/catalog-context'
import { mediaUrl } from '#/lib/media'
import {
  Disclaimer,
  KickerRuled,
  SectionLead,
  SectionTitle,
} from '#/components/ui/typography'

/**
 * Etkileşimli detay carousel'i: üstte chip satırı, altta seçili ürünün
 * bileşen/beyan panelini gösteren glass panel. Panel key={aktif} ile
 * remount edilip fade-in ile girer.
 */
export function IngredientShowcase() {
  const { products } = useCatalog()

  const [active, setActive] = useState(0)
  const product = products[active]

  const go = (dir: 1 | -1) =>
    setActive((i) => (i + dir + products.length) % products.length)

  return (
    <section className="relative overflow-hidden bg-[#0a0a12] py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full blur-[140px] transition-colors duration-700"
        style={{ backgroundColor: `${product.accent}25` }}
      />

      <div className="container relative mx-auto px-4">
        <div className="max-w-2xl">
          <KickerRuled>İçerik & Dayanak</KickerRuled>
          <SectionTitle dark className="mt-5">
            Hangi bileşen, hangi cümleyi taşıyor?
          </SectionTitle>
          <SectionLead dark className="mt-4">
            Bir ürün seçin: formüldeki her ana bileşeni ve o bileşene ait
            ifadeyi ayrı ayrı görün. Beyanı olmayan bileşenler için bunu açıkça
            yazıyoruz.
          </SectionLead>
        </div>

        {/* Chip satırı */}
        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
          {products.map((p, i) => {
            const isActive = i === active
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className="shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  borderColor: isActive
                    ? `${p.accent}66`
                    : 'rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? `${p.accent}1f` : 'transparent',
                  color: isActive ? p.accent : 'rgba(255,255,255,0.6)',
                }}
              >
                {p.shortName}
              </button>
            )
          })}
        </div>

        {/* Panel */}
        <div
          key={product.slug}
          className="mt-6 animate-[showcase-fade-in_0.4s_ease-out] rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md md:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
            <div>
              <div
                className="relative overflow-hidden rounded-2xl border"
                style={{ borderColor: `${product.accent}30` }}
              >
                <img
                  src={mediaUrl(CDN_PATHS.cover(product.slug))}
                  alt={product.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(to top, #0a0a12cc, transparent 55%)`,
                  }}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {product.keyIngredients.map((ing) => (
                  <span
                    key={ing}
                    className="rounded-full border px-2.5 py-1 text-[11px] text-white/70"
                    style={{ borderColor: `${product.accent}30` }}
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  {product.shortName}
                </h3>
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider"
                  style={{
                    backgroundColor: `${product.accent}1f`,
                    color: product.accent,
                  }}
                >
                  {product.servingSize} için
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {product.description}
              </p>

              <dl className="mt-7 space-y-5">
                {product.highlights.map((h) => (
                  <div
                    key={h.title}
                    className="border-l pl-4"
                    style={{ borderColor: `${product.accent}66` }}
                  >
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      Bileşen
                    </dt>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {h.title}
                    </p>
                    <dt className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      İfade
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-white/60">
                      {h.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <Link
                  to="/urunler/$slug"
                  params={{ slug: product.slug }}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
                  style={{ backgroundColor: product.accent }}
                >
                  Ürünü İncele
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center gap-3">
                  <span className="text-sm tabular-nums text-white/40">
                    {String(active + 1).padStart(2, '0')} /{' '}
                    {String(products.length).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Önceki ürün"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Sonraki ürün"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Disclaimer dark className="mt-6 max-w-3xl">
          {CLAIM_DISCLAIMER}
        </Disclaimer>
      </div>
    </section>
  )
}
