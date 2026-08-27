import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { CDN_PATHS } from '#/lib/brand'
import { useCatalog } from '#/lib/catalog-context'
import type { ProductMeta } from '#/lib/brand'
import { mediaUrl } from '#/lib/media'
import { formatPrice } from '#/lib/utils'
import {
  KickerRuled,
  SectionLead,
  SectionTitle,
} from '#/components/ui/typography'

/**
 * Dikey klip duvarı — hero'ya girmeyen dört ürün.
 * Videolar sessizdir (ürün render'ları), bu yüzden ses kontrolü yok;
 * ancak ekran dışındayken duraklatılır (boşuna decode etmesin).
 */
export function VideoWall({ slugs }: { slugs: Array<string> }) {
  const { bySlug } = useCatalog()
  // Ürünü taslağa alınmış bir satır katalogda yok; o kartı basmak yerine
  // düşürüyoruz (aksi halde undefined üzerinden okuma olurdu).
  const products = slugs.flatMap((slug) => bySlug[slug] ?? [])

  return (
    <section className="relative overflow-hidden bg-[#0a0a12] py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 animate-[orb-drift-a_18s_ease-in-out_infinite] rounded-full bg-accent/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 animate-[orb-drift-b_22s_ease-in-out_infinite] rounded-full bg-accent-soft/15 blur-[120px]"
      />

      <div className="container relative mx-auto px-4">
        <div className="max-w-2xl">
          <KickerRuled>Serinin Diğer Yarısı</KickerRuled>
          <SectionTitle dark className="mt-5">
            Dört formül, dört farklı bileşim mantığı.
          </SectionTitle>
          <SectionLead dark className="mt-4">
            Tek bileşenli bir softgelden on bileşenli bir kompleks kapsüle
            kadar. Bitkisel bileşenler için yetkilendirilmiş sağlık beyanı
            bulunmadığından onları yalnızca bileşim olarak tanımlıyoruz.
          </SectionLead>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {products.map((product, i) => (
            <VideoCard key={product.slug} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function VideoCard({
  product,
  index,
}: {
  product: ProductMeta
  index: number
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => undefined)
        else el.pause()
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Link
      to="/urunler/$slug"
      params={{ slug: product.slug }}
      className="group relative block overflow-hidden rounded-3xl border transition-transform duration-300 hover:scale-[1.02] animate-[showcase-rise-in_0.6s_ease-out_both]"
      style={{
        borderColor: `${product.accent}30`,
        aspectRatio: '9 / 16',
        animationDelay: `${index * 120}ms`,
      }}
    >
      <img
        src={mediaUrl(product.cover)}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={ref}
        src={mediaUrl(CDN_PATHS.videoMobile(product.slug))}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <h3 className="text-base font-bold leading-tight text-white md:text-lg">
          {product.shortName}
        </h3>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-white/80">
            {formatPrice(product.price)}
          </span>
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white transition-colors group-hover:bg-white group-hover:text-black"
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
