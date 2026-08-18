import { Check, ShoppingBag, Truck } from 'lucide-react'
import { BUNDLE, CDN_PATHS, COMMERCE, bundleTotals } from '#/lib/brand'
import { mediaUrl } from '#/lib/media'
import { formatPrice } from '#/lib/utils'
import { useCart, useCartHydrated } from '#/store/cart'
import {
  Disclaimer,
  KickerRuled,
  SectionTitle,
} from '#/components/ui/typography'

/**
 * Set teklifi — fotoğraf arka planlı koyu bölüm.
 * Fiyat matematiği gerçektir: liste fiyatlarının toplamı gösterilir.
 * BUNDLE.discountRate 0 olduğu sürece indirim satırı hiç render edilmez.
 */
export function BundleSection() {
  const { items, listTotal, total, saving } = bundleTotals()
  const hydrated = useCartHydrated()
  const add = useCart((s) => s.add)
  const threshold = COMMERCE.freeShippingThreshold
  const freeShipping = threshold !== null && total >= threshold

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <img
        src={mediaUrl(CDN_PATHS.cover('omega3'))}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#0a0a12]/95 via-[#0a0a12]/80 to-[#0a0a12]/95"
      />

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <KickerRuled>{BUNDLE.tagline}</KickerRuled>
            <SectionTitle dark className="mt-5">
              {BUNDLE.name}
            </SectionTitle>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/60 md:text-lg">
              Serinin vitamin ve mineral tarafını tek sepette toplayan set:
              magnezyum kompleksi, omega-3, C vitamini ve D3K2 damla. Dördü de
              beyanı mevzuatça yetkilendirilmiş besin ögeleri içerir.
            </p>

            <ul className="mt-8 space-y-3">
              {items.map((item) => (
                <li key={item.slug} className="flex items-center gap-3">
                  <span
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${item.accent}1f` }}
                  >
                    <Check
                      className="h-3.5 w-3.5"
                      style={{ color: item.accent }}
                    />
                  </span>
                  <span className="text-sm text-white/80">
                    <span className="font-semibold text-white">
                      {item.shortName}
                    </span>
                    <span className="text-white/50"> · {item.unit}</span>
                  </span>
                  <span className="ml-auto text-sm text-white/50">
                    {formatPrice(item.price)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md animate-[bundle-glow-pulse_6s_ease-in-out_infinite] md:p-10"
            style={{
              backgroundImage:
                'linear-gradient(140deg, rgba(34,211,238,0.08), rgba(59,130,246,0.05) 60%, transparent)',
            }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
              Set Toplamı
            </span>

            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-bold text-white md:text-5xl">
                {formatPrice(total)}
              </span>
              {saving > 0 ? (
                <>
                  <span className="text-lg text-white/40 line-through">
                    {formatPrice(listTotal)}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {formatPrice(saving)} avantaj
                  </span>
                </>
              ) : null}
            </div>

            <p className="mt-2 text-sm text-white/50">
              {items.length} ürünün liste fiyatı toplamı. Fiyatlar sipariş
              anında geçerli olan tutar üzerinden hesaplanır.
            </p>

            {freeShipping ? (
              <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3">
                <Truck className="h-4 w-4 shrink-0 text-emerald-300" />
                <span className="text-sm text-emerald-200">
                  {formatPrice(threshold ?? 0)} eşiğini geçtiği için kargo
                  ücretsiz.
                </span>
              </div>
            ) : null}

            <button
              type="button"
              disabled={!hydrated}
              onClick={() => items.forEach((item) => add(item.slug, 1))}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Seti Sepete Ekle
            </button>

            <Disclaimer dark className="mt-5">
              Takviye edici gıdalar normal beslenmenin yerine geçmez. Birden
              fazla ürünü birlikte kullanmadan önce toplam günlük alımınızı
              kontrol edin ve hekiminize danışın.
            </Disclaimer>
          </div>
        </div>
      </div>
    </section>
  )
}
