import { mediaUrl } from '#/lib/media'
import { cn } from '#/lib/utils'

/**
 * Logo CDN'de. null yapılırsa ambalajdaki kelime markası kilidi render edilir
 * (Wordmark). Her iki durumda da kaynak mediaUrl()'den geçer.
 */
const LOGO_FILE: string | null = '/logo.png'

export function Logo({
  inverted = false,
  className,
}: {
  /** Koyu/şeffaf zeminde beyaz görünüm */
  inverted?: boolean
  className?: string
}) {
  if (LOGO_FILE) {
    return (
      <img
        src={mediaUrl(LOGO_FILE)}
        alt="Luzayn"
        className={cn(
          'h-7 w-auto md:h-8',
          inverted && 'brightness-0 invert',
          className,
        )}
      />
    )
  }

  return <Wordmark inverted={inverted} className={className} />
}

/**
 * Ambalajdaki kilit: ortada aralıklı serif harfler, iki yanında uçları
 * içeri kırılan ince çizgiler.
 */
export function Wordmark({
  inverted = false,
  className,
}: {
  inverted?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 select-none',
        inverted ? 'text-white' : 'text-foreground',
        className,
      )}
      aria-label="Luzayn"
    >
      <Rule side="left" />
      <span className="wordmark text-[17px] leading-none md:text-[19px]">
        Luzayn
      </span>
      <Rule side="right" />
    </span>
  )
}

function Rule({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 28 10"
      aria-hidden
      className={cn('h-2.5 w-7 shrink-0', side === 'right' && 'scale-x-[-1]')}
    >
      <path
        d="M28 5H6L1 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  )
}
