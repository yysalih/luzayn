import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowRight,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react'
import { CDN_PATHS, CLAIM_DISCLAIMER, SITE } from '#/lib/brand'
import { mediaUrl } from '#/lib/media'
import { formatPrice } from '#/lib/utils'
import { useCatalog } from '#/lib/catalog-context'
import { resolveCart, useCart, useCartHydrated } from '#/store/cart'
import { useShopifyCheckout } from '#/hooks/use-shopify-checkout'
import { Disclaimer } from '#/components/ui/typography'

export const Route = createFileRoute('/sepet')({
  head: () => ({ meta: [{ title: `Sepet — ${SITE.name}` }] }),
  component: CartPage,
})

function CartPage() {
  const hydrated = useCartHydrated()
  const lines = useCart((s) => s.lines)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)
  const catalog = useCatalog()
  const cart = resolveCart(catalog, hydrated ? lines : [])
  const { checkout, pending, error } = useShopifyCheckout()

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Sepetiniz
        </h1>

        {!hydrated ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Sepet yükleniyor…
          </p>
        ) : cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
            <div>
              <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
                {cart.items.map(({ product, qty, lineTotal }) => (
                  <li key={product.slug} className="flex gap-4 p-4 md:p-5">
                    <Link
                      to="/urunler/$slug"
                      params={{ slug: product.slug }}
                      className="shrink-0"
                    >
                      <img
                        src={mediaUrl(CDN_PATHS.cover(product.slug))}
                        alt={product.name}
                        loading="lazy"
                        className="h-24 w-20 rounded-xl object-cover md:h-28 md:w-24"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <span
                        className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                        style={{ color: product.accent }}
                      >
                        {product.category}
                      </span>
                      <Link
                        to="/urunler/$slug"
                        params={{ slug: product.slug }}
                        className="mt-1 text-sm font-bold text-foreground hover:underline md:text-base"
                      >
                        {product.shortName}
                      </Link>
                      <span className="mt-0.5 text-xs text-muted-foreground">
                        {product.unit} · {formatPrice(product.price)} / adet
                      </span>

                      <div className="mt-auto flex items-center gap-3 pt-3">
                        <div
                          className="inline-flex items-center rounded-full border"
                          style={{ borderColor: `${product.accent}30` }}
                        >
                          <button
                            type="button"
                            onClick={() => setQty(product.slug, qty - 1)}
                            aria-label={`${product.shortName} adet azalt`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold tabular-nums text-foreground">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(product.slug, qty + 1)}
                            aria-label={`${product.shortName} adet artır`}
                            disabled={qty >= 20}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => remove(product.slug)}
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Kaldır
                        </button>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-bold text-foreground md:text-base">
                      {formatPrice(lineTotal)}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/urunler"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                Alışverişe devam et
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-border bg-card p-6 md:p-7">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  Sipariş Özeti
                </h2>

                <dl className="mt-6 space-y-3 text-sm">
                  <Row label={`Ara toplam (${cart.count} ürün)`}>
                    {formatPrice(cart.subtotal)}
                  </Row>
                  <Row label="Kargo">
                    {!cart.shippingKnown ? (
                      <span className="text-xs font-normal text-muted-foreground">
                        Ödeme adımında
                      </span>
                    ) : cart.shipping === 0 ? (
                      <span className="font-semibold text-emerald-600">
                        Ücretsiz
                      </span>
                    ) : (
                      formatPrice(cart.shipping ?? 0)
                    )}
                  </Row>
                  <div className="border-t border-border pt-3">
                    <Row
                      label={cart.shippingKnown ? 'Toplam' : 'Ürün toplamı'}
                      strong
                    >
                      {formatPrice(cart.total)}
                    </Row>
                  </div>
                </dl>

                {!cart.shippingKnown ? null : !cart.freeShipping ? (
                  <FreeShippingProgress
                    subtotal={cart.subtotal}
                    remaining={cart.remainingForFreeShipping}
                  />
                ) : (
                  <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <Truck className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-sm text-emerald-800">
                      Kargonuz ücretsiz.
                    </span>
                  </div>
                )}

                {error ? (
                  <div
                    role="alert"
                    className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <p className="text-sm leading-relaxed text-red-800">
                      {error}
                    </p>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => checkout(lines)}
                  disabled={pending || !hydrated}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  <Lock className="h-4 w-4" />
                  {pending ? 'Yönlendiriliyor…' : 'Güvenli Ödemeye Geç'}
                </button>

                <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
                  Kargo tutarı ve nihai toplam, adresinizi girdikten sonra ödeme
                  sayfasında kesinleşir. Kart bilgileri {SITE.name} sunucularına
                  iletilmez.
                </p>

                <Disclaimer className="mt-5">{CLAIM_DISCLAIMER}</Disclaimer>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

function Row({
  label,
  children,
  strong = false,
}: {
  label: string
  children: React.ReactNode
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt
        className={
          strong ? 'font-semibold text-foreground' : 'text-muted-foreground'
        }
      >
        {label}
      </dt>
      <dd
        className={
          strong
            ? 'text-lg font-bold text-foreground'
            : 'font-medium text-foreground'
        }
      >
        {children}
      </dd>
    </div>
  )
}

function FreeShippingProgress({
  subtotal,
  remaining,
}: {
  subtotal: number
  remaining: number
}) {
  const { commerce } = useCatalog()
  // Eşik yoksa bu çubuk zaten çizilmiyor; 1'e bölme koruması yalnızca
  // sıfıra bölmeyi engellemek için.
  const threshold = commerce.freeShippingThreshold ?? 1
  const percent = Math.min(100, Math.round((subtotal / threshold) * 100))

  return (
    <div className="mt-5 rounded-2xl border border-border bg-muted/50 px-4 py-3.5">
      <p className="text-xs text-muted-foreground">
        Ücretsiz kargoya{' '}
        <span className="font-semibold text-foreground">
          {formatPrice(remaining)}
        </span>{' '}
        kaldı.
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="mt-10 rounded-3xl border border-border bg-card px-6 py-16 text-center">
      <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/40" />
      <h2 className="mt-5 text-lg font-bold text-foreground">
        Sepetiniz henüz boş.
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Serideki sekiz formülü inceleyip size uygun olanı sepete
        ekleyebilirsiniz.
      </p>
      <Link
        to="/urunler"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-transform hover:scale-105"
      >
        Ürünleri Keşfet
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
