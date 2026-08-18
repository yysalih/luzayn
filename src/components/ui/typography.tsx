import { cn } from '#/lib/utils'

/** Başlığın üstündeki küçük etiket — pill varyantı (açık zeminde) */
export function KickerPill({
  children,
  accent,
  className,
}: {
  children: React.ReactNode
  /** Verilmezse marka accent'i kullanılır */
  accent?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider',
        accent ? undefined : 'bg-accent/10 text-accent',
        className,
      )}
      style={
        accent ? { backgroundColor: `${accent}1f`, color: accent } : undefined
      }
    >
      {children}
    </span>
  )
}

/** Başlığın üstündeki küçük etiket — çizgili varyant (koyu zeminde) */
export function KickerRuled({
  children,
  className,
  align = 'left',
}: {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center'
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        align === 'center' && 'justify-center',
        className,
      )}
    >
      {align === 'center' ? (
        <span
          aria-hidden
          className="h-px w-10 bg-gradient-to-l from-white/30 to-transparent"
        />
      ) : null}
      <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">
        {children}
      </span>
      <span
        aria-hidden
        className="h-px w-10 bg-gradient-to-r from-white/30 to-transparent"
      />
    </div>
  )
}

export function SectionTitle({
  children,
  className,
  dark = false,
}: {
  children: React.ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <h2
      className={cn(
        'text-3xl font-bold tracking-tight md:text-4xl',
        dark ? 'text-white' : 'text-foreground',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function SectionLead({
  children,
  className,
  dark = false,
}: {
  children: React.ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <p
      className={cn(
        'text-base leading-relaxed md:text-lg',
        dark ? 'text-white/60' : 'text-muted-foreground',
        className,
      )}
    >
      {children}
    </p>
  )
}

/** Her beyan bloğunun altına konan referans/uyarı satırı */
export function Disclaimer({
  children,
  dark = false,
  className,
}: {
  children: React.ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <p
      className={cn(
        'text-xs leading-relaxed',
        dark ? 'text-white/35' : 'text-muted-foreground/70',
        className,
      )}
    >
      {children}
    </p>
  )
}
