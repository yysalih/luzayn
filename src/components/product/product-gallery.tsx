import { useEffect, useRef, useState } from 'react'
import { CDN_PATHS } from '#/lib/brand'
import type { ProductMeta } from '#/lib/brand'
import { mediaUrl } from '#/lib/media'
import { useIsMobile } from '#/hooks/use-is-mobile'
import { cn } from '#/lib/utils'

type Slide = { kind: 'image'; src: string } | { kind: 'video'; src: string }

/** Fotoğraf + video slaytları; scroll-snap, dot göstergesi, kod rozeti. */
export function ProductGallery({ product }: { product: ProductMeta }) {
  const isMobile = useIsMobile()
  const railRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const slides: Array<Slide> = [
    { kind: 'image', src: CDN_PATHS.cover(product.slug) },
    {
      kind: 'video',
      src: isMobile
        ? CDN_PATHS.videoMobile(product.slug)
        : CDN_PATHS.videoDesktop(product.slug),
    },
    { kind: 'image', src: CDN_PATHS.image(product.slug) },
  ]

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setActive(Math.round(rail.scrollLeft / rail.clientWidth))
      })
    }
    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      rail.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const goTo = (i: number) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollTo({ left: i * rail.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={railRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-3xl border"
        style={{ borderColor: `${product.accent}30` }}
      >
        {slides.map((slide, i) => (
          <div
            key={`${slide.kind}-${slide.src}`}
            className="aspect-[4/5] w-full shrink-0 snap-start bg-[#0a0a12]"
          >
            {slide.kind === 'image' ? (
              <img
                src={mediaUrl(slide.src)}
                alt={`${product.name} — görsel ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover"
              />
            ) : (
              <video
                src={mediaUrl(slide.src)}
                muted
                loop
                playsInline
                autoPlay
                preload="none"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <span
        className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md"
        style={{
          backgroundColor: `${product.accent}1f`,
          color: product.accent,
          border: `1px solid ${product.accent}30`,
        }}
      >
        {product.slug}
      </span>

      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={`dot-${slide.kind}-${slide.src}`}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${i + 1}. görsel`}
            aria-current={i === active}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === active
                ? 'w-8'
                : 'w-3 bg-border hover:bg-muted-foreground/40',
            )}
            style={
              i === active ? { backgroundColor: product.accent } : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}
