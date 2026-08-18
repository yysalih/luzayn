import { cn } from '#/lib/utils'

/** Alt sayfaların ortak koyu hero'su — ortalanmış kicker + başlık + intro. */
export function PageHero({
  kicker,
  title,
  lead,
  accent,
  children,
  className,
}: {
  kicker: string
  title: string
  lead?: string
  /** Orb rengi; verilmezse marka accent'i */
  accent?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-[#0a0a12] pb-16 pt-20 md:pb-20 md:pt-28',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ backgroundColor: accent ? `${accent}33` : undefined }}
      />
      {!accent ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[130px]"
        />
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="container relative mx-auto max-w-3xl px-4 text-center">
        <span
          className="text-xs font-semibold uppercase tracking-[0.35em]"
          style={{ color: accent }}
        >
          <span className={accent ? undefined : 'text-accent'}>{kicker}</span>
        </span>
        <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {lead ? (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            {lead}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  )
}
