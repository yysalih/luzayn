import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { CDN_PATHS } from '#/lib/brand'
import { useCatalog } from '#/lib/catalog-context'
import type { ProductMeta } from '#/lib/brand'
import { mediaUrl } from '#/lib/media'
import { formatPrice } from '#/lib/utils'
import { SectionTitle } from '#/components/ui/typography'
import { AddToCart } from '#/components/product/add-to-cart'

export function ProductRail() {
  const { products } = useCatalog()

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle>Sekiz formül, sekiz ayrı amaç.</SectionTitle>
          <Link
            to="/urunler"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Tümünü Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/*
         * Ray container'ın içinde durur ama -mx-4/px-4 ile kenardan taşar:
         * ilk kart başlıkla aynı hizada başlar, son kart ekran kenarına
         * kadar kayabilir. py-3 hover'da yükselen karta dikey pay bırakır —
         * yoksa overflow-x-auto kartın üstünü kırpıyor.
         *
         * scroll-px-4 şart: snap-start, kabın padding kenarına değil scroll-port
         * başına hizalıyor; scroll-padding olmadan tarayıcı açılışta 16px
         * kaydırıp ilk kartı sola yapıştırıyordu.
         */}
        <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 py-3 md:mt-12">
          {products.map((product, index) => (
            <RailCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RailCard({ product, index }: { product: ProductMeta; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)

  return (
    <article
      onMouseEnter={() => {
        setHovered(true)
        void videoRef.current?.play().catch(() => undefined)
      }}
      onMouseLeave={() => {
        setHovered(false)
        videoRef.current?.pause()
      }}
      className="group relative w-[78%] shrink-0 snap-start overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1.5 sm:w-72 md:w-80"
      style={{
        minHeight: 480,
        boxShadow: hovered ? `0 30px 70px -30px ${product.accent}` : undefined,
      }}
    >
      <img
        src={mediaUrl(CDN_PATHS.cover(product.slug))}
        alt={product.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={videoRef}
        src={mediaUrl(CDN_PATHS.videoDesktop(product.slug))}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 top-2 font-black leading-none text-white/[0.07]"
        style={{ fontSize: '9rem' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Kartın tamamı tıklanabilir; içerideki butonlar pointer-events-auto ile geri açılır */}
      <Link
        to="/urunler/$slug"
        params={{ slug: product.slug }}
        className="absolute inset-0 z-10"
        aria-label={`${product.name} sayfasına git`}
      />

      <div className="pointer-events-none relative z-20 flex h-full flex-col justify-end p-6">
        <h3 className="text-xl font-bold leading-tight text-white">
          {product.shortName}
        </h3>
        <p className="mt-1.5 text-sm leading-snug text-white/60">
          {product.subtitle}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.keyIngredients.slice(0, 3).map((ing) => (
            <span
              key={ing}
              className="rounded-full border px-2.5 py-1 text-[11px] text-white/70"
              style={{
                borderColor: `${product.accent}30`,
                backgroundColor: `${product.accent}1f`,
              }}
            >
              {ing}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <span className="block text-lg font-bold text-white">
              {formatPrice(product.price)}
            </span>
            <span className="block text-[11px] text-white/45">
              {product.unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AddToCart
              product={product}
              variant="icon"
              className="pointer-events-auto"
            />
            <Link
              to="/urunler/$slug"
              params={{ slug: product.slug }}
              aria-label={`${product.shortName} incele`}
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
