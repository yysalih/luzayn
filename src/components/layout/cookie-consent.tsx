import { Link } from '@tanstack/react-router'
import { useConsent, writeConsent } from '#/lib/consent'

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined

/**
 * Çerez onay bandı.
 *
 * Yalnızca izlenecek bir şey varken görünür: hiçbir analitik kimliği
 * tanımlı değilse bant hiç çıkmaz — kullanıcıya onay soracak bir çerez
 * yokken banner göstermek gereksiz sürtünmedir.
 *
 * Karar verilene kadar hiçbir analitik betik yüklenmez (bkz. analytics.tsx).
 */
export function CookieConsent() {
  const { consent, ready } = useConsent()
  const hasTracking = Boolean(GA4_ID || PIXEL_ID)

  if (!ready || !hasTracking || consent !== null) return null

  return (
    <div
      role="dialog"
      aria-label="Çerez tercihi"
      className="fixed inset-x-0 bottom-0 z-50 animate-[showcase-rise-in_0.35s_ease-out] border-t border-white/10 bg-[#0a0a12]/95 backdrop-blur-md"
    >
      <div className="container mx-auto flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:gap-6">
        <p className="flex-1 text-sm leading-relaxed text-white/70">
          Siteyi nasıl kullandığınızı anlamak için analitik çerezler kullanmak
          istiyoruz. Sepetin çalışması için gereken zorunlu çerezler her durumda
          aktiftir.{' '}
          <Link
            to="/yasal/$slug"
            params={{ slug: 'cerez-politikasi' }}
            className="font-medium text-accent hover:underline"
          >
            Çerez Politikası
          </Link>
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => writeConsent('rejected')}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Yalnızca zorunlu
          </button>
          <button
            type="button"
            onClick={() => writeConsent('accepted')}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-105"
          >
            Kabul et
          </button>
        </div>
      </div>
    </div>
  )
}
