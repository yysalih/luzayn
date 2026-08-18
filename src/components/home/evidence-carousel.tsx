import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CLAIM_DISCLAIMER } from '#/lib/brand'
import type { EvidenceStat } from '#/data/content'
import { useCatalog } from '#/lib/catalog-context'
import {
  Disclaimer,
  KickerRuled,
  SectionLead,
  SectionTitle,
} from '#/components/ui/typography'
import { cn } from '#/lib/utils'

const AUTO_MS = 5000

/**
 * Sayılar carousel'i. Her rakam ambalaj etiketinden okunur veya etiket
 * verisinden hesaplanır — doğrulanamayan hiçbir veri buraya girmez.
 * Kendi kendine ilerler; ok, dot ve swipe ile her an müdahale edilebilir.
 */
export function EvidenceCarousel({ stats }: { stats: Array<EvidenceStat> }) {
  const { bySlug } = useCatalog()
  const railRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const scrollTo = useCallback((index: number) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.children[index] as HTMLElement | undefined
    if (!card) return
    rail.scrollTo({
      left: card.offsetLeft - rail.offsetLeft,
      behavior: 'smooth',
    })
    setActive(index)
  }, [])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(
      () => scrollTo((active + 1) % stats.length),
      AUTO_MS,
    )
    return () => clearTimeout(t)
  }, [active, paused, scrollTo])

  // Kullanıcı elle kaydırdığında aktif kartı takip et
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const children = Array.from(rail.children) as Array<HTMLElement>
        const nearest = children.reduce(
          (best, child, i) => {
            const distance = Math.abs(
              child.offsetLeft - rail.offsetLeft - rail.scrollLeft,
            )
            return distance < best.distance ? { i, distance } : best
          },
          { i: 0, distance: Infinity },
        )
        setActive(nearest.i)
      })
    }
    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      rail.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      className="relative overflow-hidden bg-[#0a0a12] py-20 md:py-28"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <KickerRuled>Etiketten Okunan Sayılar</KickerRuled>
            <SectionTitle dark className="mt-5">
              Her rakamın bir kaynağı var.
            </SectionTitle>
            <SectionLead dark className="mt-4">
              Aşağıdaki sayılar ürün etiketlerinden okunur veya doğrudan etiket
              verisinden hesaplanır. Kaynağı gösterilemeyen bir istatistik bu
              sayfada yer almaz.
            </SectionLead>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <NavButton
              label="Önceki"
              onClick={() =>
                scrollTo(
                  (active - 1 + stats.length) % stats.length,
                )
              }
            >
              <ChevronLeft className="h-5 w-5" />
            </NavButton>
            <NavButton
              label="Sonraki"
              onClick={() => scrollTo((active + 1) % stats.length)}
            >
              <ChevronRight className="h-5 w-5" />
            </NavButton>
          </div>
        </div>

        <div
          ref={railRef}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        >
          {stats.map((stat, i) => (
            <StatCard key={`${stat.slug}-${i}`} stat={stat} index={i} />
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2">
          {stats.map((stat, i) => (
            <button
              key={`dot-${stat.slug}-${i}`}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`${i + 1}. kart`}
              aria-current={i === active}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === active ? 'w-8' : 'w-3 bg-white/25 hover:bg-white/45',
              )}
              style={
                i === active
                  ? { backgroundColor: bySlug[stat.slug]?.accent }
                  : undefined
              }
            />
          ))}
        </div>

        <Disclaimer dark className="mt-8 max-w-3xl">
          {CLAIM_DISCLAIMER}
        </Disclaimer>
      </div>
    </section>
  )
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
    >
      {children}
    </button>
  )
}

function StatCard({ stat, index }: { stat: EvidenceStat; index: number }) {
  const { bySlug } = useCatalog()
  const product = bySlug[stat.slug]

  // Kartın rengi tamamen üründen geliyor. loadHome() ürünü olmayan
  // satırları zaten düşürüyor; buradaki kontrol katalog boş döndüğünde
  // (okuma hatası) undefined üzerinden okumayı engelliyor.
  if (!product) return null

  return (
    <article
      className="flex w-[82%] shrink-0 snap-start flex-col rounded-3xl border bg-white/[0.04] p-7 backdrop-blur-md sm:w-80 md:p-8"
      style={{ borderColor: `${product.accent}30` }}
    >
      {stat.ring === null ? (
        <BigNumber stat={stat} accent={product.accent} />
      ) : (
        <Ring stat={stat} accent={product.accent} index={index} />
      )}

      <h3 className="mt-6 text-base font-bold text-white">{stat.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">
        {stat.context}
      </p>

      <span
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider"
        style={{
          backgroundColor: `${product.accent}1f`,
          color: product.accent,
        }}
      >
        {product.shortName}
      </span>
    </article>
  )
}

function Ring({
  stat,
  accent,
  index,
}: {
  stat: EvidenceStat
  accent: string
  index: number
}) {
  const target = 100 - (stat.ring ?? 0)

  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        {/* pathLength=100 sayesinde çevre hesabı yapılmaz */}
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke={accent}
          strokeWidth="10"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100}
          className="animate-[evidence-ring-fill_1.2s_ease-out_forwards]"
          style={
            {
              '--ring-target': target,
              animationDelay: `${index * 90}ms`,
            } as React.CSSProperties
          }
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
        {stat.value}
      </span>
    </div>
  )
}

function BigNumber({ stat, accent }: { stat: EvidenceStat; accent: string }) {
  return (
    <div className="flex h-32 items-center">
      <span
        className="text-6xl font-bold leading-none animate-[evidence-pop-in_0.5s_ease-out_both] md:text-7xl"
        style={{ color: accent }}
      >
        {stat.value}
      </span>
      {stat.unit ? (
        <span className="ml-2 self-end pb-2 text-lg font-medium text-white/50">
          {stat.unit}
        </span>
      ) : null}
    </div>
  )
}
