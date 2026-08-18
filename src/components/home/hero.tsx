import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { HERO_SLIDES } from '#/data/content'
import type { HeroSlide } from '#/data/content'
import { PRODUCT_BY_SLUG, SITE } from '#/lib/brand'
import { mediaUrl } from '#/lib/media'
import { useIsMobile } from '#/hooks/use-is-mobile'
import { cn } from '#/lib/utils'

const AUTO_MS = 6500
const SLIDE_MS = 1200
const SWIPE_THRESHOLD = 40
const COUNT = HERO_SLIDES.length

/**
 * Tam ekran video hero — tek slayt, yavaşça sola kayarak ilerler, sonsuz döner.
 *
 * Kesme/fade yerine yatay kayma kullanılıyor; videoların zemini aynı koyu
 * lacivert tema olduğu için geçiş dikişsiz görünüyor.
 *
 * Sonsuz döngü: şerit iki kez render edilir (16 slayt). `index` COUNT'a
 * ulaştığında görünen slayt zaten baştaki slaytla aynı olduğundan, geçiş
 * biter bitmez animasyonsuz 0'a snap ediyoruz — kullanıcı geri sarma görmez.
 */
export function Hero() {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [pendingPrev, setPendingPrev] = useState(false)
  const [paused, setPaused] = useState(false)
  const [width, setWidth] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  /**
   * Slayt genişliğini ölç. Yüzdeyle kaydırmak işe yaramaz: translateX'teki
   * yüzde öğenin KENDİ genişliğine göredir, şerit ise 16 slayt genişliğinde.
   * Slaytın kendisi de izlenmeli — yalnızca şerit izlenirse ilk ölçüm
   * slaytlar genişlik almadan yapılıyor ve 0 kalıyor.
   */
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => {
      const first = el.children[0] as HTMLElement | undefined
      if (first && first.offsetWidth > 0) setWidth(first.offsetWidth)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    if (el.children[0]) ro.observe(el.children[0])
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const next = useCallback(() => setIndex((i) => i + 1), [])

  const prev = useCallback(() => {
    setIndex((i) => {
      if (i > 0) return i - 1
      setAnimate(false)
      setPendingPrev(true)
      return COUNT
    })
  }, [])

  /**
   * Snap sonrası animasyonu geri aç. requestAnimationFrame KULLANILMAZ:
   * arka plan sekmesinde kare üretilmediği için rAF tetiklenmiyor ve
   * carousel geçişi kapalı hâlde kilitleniyordu.
   */
  useEffect(() => {
    if (animate) return
    const t = setTimeout(() => {
      setAnimate(true)
      if (pendingPrev) {
        setIndex(COUNT - 1)
        setPendingPrev(false)
      }
    }, 40)
    return () => clearTimeout(t)
  }, [animate, pendingPrev])

  // Sona gelince görünmeden başa sar
  useEffect(() => {
    if (index !== COUNT || pendingPrev) return
    const t = setTimeout(() => {
      setAnimate(false)
      setIndex(0)
    }, SLIDE_MS)
    return () => clearTimeout(t)
  }, [index, pendingPrev])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(next, AUTO_MS)
    return () => clearTimeout(t)
  }, [index, paused, next])

  const active = index % COUNT
  const current = HERO_SLIDES[active]

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-[#0a0a12]"
      style={{ height: 'min(92vh, 900px)' }}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(dx) > SWIPE_THRESHOLD) (dx < 0 ? next : prev)()
        touchStartX.current = null
      }}
    >
      <h1 className="sr-only">
        {SITE.name} — {SITE.tagline}
      </h1>

      {/* Kayan şerit */}
      <div
        ref={trackRef}
        className="flex h-full"
        style={{
          transform: `translateX(${-index * width}px)`,
          transition: animate
            ? `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`
            : 'none',
        }}
      >
        {[...HERO_SLIDES, ...HERO_SLIDES].map((slide, i) => (
          <HeroSlideView
            key={`${slide.id}-${i}`}
            slide={slide}
            /* Yalnızca komşu slaytlar video yükler; sekiz videoyu aynı anda
               decode etmemek için. Geçiş sırasında hem çıkan hem giren slayt
               göründüğünden pencere bir slayt geniş tutuluyor. */
            live={Math.abs(i - index) <= 1}
          />
        ))}
      </div>

      {/* Kontroller — şeritle birlikte kaymasın diye şeridin dışında */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="container mx-auto flex items-center gap-2 px-4 pb-8">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={PRODUCT_BY_SLUG[s.id].shortName}
              aria-current={i === active}
              className={cn(
                'pointer-events-auto h-1.5 rounded-full transition-all',
                i === active ? 'w-9' : 'w-4 bg-white/30 hover:bg-white/50',
              )}
              style={
                i === active ? { backgroundColor: current.accent } : undefined
              }
            />
          ))}
          <span className="ml-auto text-sm tabular-nums text-white/40">
            {String(active + 1).padStart(2, '0')} /{' '}
            {String(COUNT).padStart(2, '0')}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="Önceki slayt"
        className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="Sonraki slayt"
        className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </section>
  )
}

/** Tek tam ekran slayt: video + çift gradient + alt sol içerik */
function HeroSlideView({ slide, live }: { slide: HeroSlide; live: boolean }) {
  const product = PRODUCT_BY_SLUG[slide.id]
  const isMobile = useIsMobile()
  const src = isMobile ? slide.videoMobile : slide.videoDesktop

  return (
    <div className="relative h-full w-full shrink-0 overflow-hidden">
      <img
        src={mediaUrl(slide.poster)}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {live ? (
        <video
          src={mediaUrl(src)}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {/* Çift gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 20%, ${slide.accent}30, transparent 45%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
      />

      <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-24 md:pb-28">
        <div className="max-w-3xl">
          <h2 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {product.motto}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            {slide.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/urunler/$slug"
              params={{ slug: slide.id }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105"
            >
              {slide.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/urunler"
              className="inline-flex items-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Tüm Seri
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
