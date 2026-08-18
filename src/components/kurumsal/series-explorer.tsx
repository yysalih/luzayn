import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { CDN_PATHS, CLAIM_DISCLAIMER } from '#/lib/brand'
import { useCatalog } from '#/lib/catalog-context'
import { mediaUrl } from '#/lib/media'
import { formatPrice } from '#/lib/utils'
import { AddToCart } from '#/components/product/add-to-cart'
import {
  Disclaimer,
  KickerRuled,
  SectionLead,
  SectionTitle,
} from '#/components/ui/typography'

/**
 * Seri gezgini — pill'e tıklanınca hemen altında seçilen ürün açılır:
 * solda dikey klip, sağda kimlik + porsiyon başına bileşim.
 *
 * Panel key={slug} ile remount edilir; hem metin hem video baştan girer.
 * Videolar sessizdir (ürün render'ı), bu yüzden ses kontrolü yok.
 */
export function SeriesExplorer() {
  const [active, setActive] = useState(0)
  const { products } = useCatalog()
  const product = products[active]

  const go = (dir: 1 | -1) =>
    setActive((i) => (i + dir + products.length) % products.length)

  return (
    <section className="relative overflow-hidden bg-[#0a0a12] py-20 md:py-28">
      {/* Orb seçili ürünün rengini alır — geçiş yumuşak */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-[26rem] w-[26rem] rounded-full blur-[140px] transition-colors duration-700"
        style={{ backgroundColor: `${product.accent}2e` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <KickerRuled>Seri Gezgini</KickerRuled>
            <SectionTitle dark className="mt-5">
              Serideki {products.length} formül.
            </SectionTitle>
            <SectionLead dark className="mt-4">
              Bir formül seçin: klibini izleyin, porsiyon başına ne içerdiğini
              aynı ekranda görün.
            </SectionLead>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-white/40">
              {String(active + 1).padStart(2, '0')} /{' '}
              {String(products.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Önceki formül"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Sonraki formül"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Pill satırı — her pill kendi kapak fotoğrafını taşır */}
        <div
          className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Formüller"
        >
          {products.map((p, i) => {
            const isActive = i === active
            return (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className="flex shrink-0 items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-medium transition-all"
                style={{
                  borderColor: isActive
                    ? `${p.accent}80`
                    : 'rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? `${p.accent}1f` : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                  boxShadow: isActive
                    ? `0 10px 30px -12px ${p.accent}`
                    : undefined,
                }}
              >
                <img
                  src={mediaUrl(CDN_PATHS.cover(p.slug))}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="h-7 w-7 rounded-full object-cover transition-opacity"
                  style={{ opacity: isActive ? 1 : 0.5 }}
                />
                {p.shortName}
              </button>
            )
          })}
        </div>

        {/* Panel */}
        <div
          key={product.slug}
          className="mt-6 animate-[showcase-fade-in_0.45s_ease-out] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md"
        >
          <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            {/* Sol: dikey klip */}
            <div
              className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:min-h-[32rem]"
              style={{
                backgroundImage: `linear-gradient(160deg, ${product.accent}26, transparent 60%)`,
              }}
            >
              <img
                src={mediaUrl(CDN_PATHS.cover(product.slug))}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
              />
              <video
                key={`${product.slug}-video`}
                src={mediaUrl(CDN_PATHS.videoMobile(product.slug))}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0a0a12]/45"
              />
              <span
                className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md"
                style={{
                  backgroundColor: `${product.accent}26`,
                  border: `1px solid ${product.accent}4d`,
                }}
              >
                <Play className="h-3 w-3" />
                {product.category}
              </span>
            </div>

            {/* Sağ: kimlik + bileşim */}
            <div className="flex flex-col p-7 md:p-10">
              <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                {product.name}
              </h3>
              <p
                className="mt-2 text-sm font-medium"
                style={{ color: product.accent }}
              >
                {product.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                {product.description}
              </p>

              <div className="mt-7">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  İçerik · {product.servingSize} için
                </span>
                <dl className="mt-3 divide-y divide-white/[0.07] border-y border-white/[0.07]">
                  {product.composition.map((row) => (
                    <div
                      key={row.name}
                      className="flex items-baseline justify-between gap-4 py-2"
                    >
                      <dt className="text-sm text-white/70">{row.name}</dt>
                      <dd className="shrink-0 text-sm font-semibold tabular-nums text-white">
                        {row.amount}
                        {row.nrv ? (
                          <span className="ml-2 text-xs font-normal text-white/40">
                            %{row.nrv} BRD
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
                <div>
                  <span className="block text-2xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                  <span className="block text-xs text-white/40">
                    {product.unit}
                  </span>
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-3">
                  <AddToCart product={product} variant="ghost" />
                  <Link
                    to="/urunler/$slug"
                    params={{ slug: product.slug }}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-105"
                    style={{
                      backgroundColor: product.accent,
                      boxShadow: `0 14px 38px -16px ${product.accent}`,
                    }}
                  >
                    Ürünü İncele
                    <ArrowRight className="h-4 w-4" />
                  </Link>
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
