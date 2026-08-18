import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowRight,
  Check,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import {
  CDN_PATHS,
  CLAIM_DISCLAIMER,
  COMMERCE,
  PRODUCTS,
  PRODUCT_BY_SLUG,
  SITE,
} from '#/lib/brand'
import type { ProductMeta, ProductSlug } from '#/lib/brand'
import { mediaUrl } from '#/lib/media'
import { formatPrice } from '#/lib/utils'
import { useShopifyCheckout } from '#/hooks/use-shopify-checkout'
import { ProductGallery } from '#/components/product/product-gallery'
import { AddToCart } from '#/components/product/add-to-cart'
import {
  Disclaimer,
  KickerRuled,
  SectionTitle,
} from '#/components/ui/typography'
import { NotFoundPage } from '#/components/layout/error-states'

export const Route = createFileRoute('/urunler/$slug')({
  loader: ({ params }) => {
    const product = PRODUCT_BY_SLUG[params.slug as ProductSlug]
    if (!product) throw notFound()
    return { product }
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product
    if (!product) return {}
    return {
      meta: [
        { title: `${product.name} — ${SITE.name}` },
        { name: 'description', content: product.description },
        { property: 'og:title', content: `${product.name} — ${SITE.name}` },
        { property: 'og:description', content: product.description },
        {
          property: 'og:image',
          content: mediaUrl(CDN_PATHS.cover(product.slug)),
        },
      ],
    }
  },
  notFoundComponent: NotFoundPage,
  component: ProductPage,
})

function ProductPage() {
  const { product } = Route.useLoaderData()
  const [qty, setQty] = useState(1)

  return (
    <>
      <TopSection product={product} qty={qty} setQty={setQty} />
      <CompositionSection product={product} />
      <InfoAccordion product={product} />
      <HighlightsSection product={product} />
      <CrossSell current={product} />
      <StickyBuyBar product={product} qty={qty} />
    </>
  )
}

/* ---------------------------------------------------------------- */

function TopSection({
  product,
  qty,
  setQty,
}: {
  product: ProductMeta
  qty: number
  setQty: (n: number) => void
}) {
  const { checkout, pending, error } = useShopifyCheckout()

  // Sepetten bağımsız, yalnızca bu ürünle doğrudan Shopify checkout'u
  const buyNow = () => void checkout([{ slug: product.slug, qty }])

  return (
    <section className="bg-background pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="container mx-auto px-4">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Ana Sayfa
          </Link>
          <span aria-hidden>/</span>
          <Link to="/urunler" className="hover:text-foreground">
            Ürünler
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground">{product.shortName}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery product={product} />

          <div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              {product.name}
            </h1>
            <p
              className="mt-3 text-base font-medium"
              style={{ color: product.accent }}
            >
              {product.subtitle}
            </p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-1.5">
              {product.keyIngredients.map((ing) => (
                <span
                  key={ing}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium"
                  style={{
                    borderColor: `${product.accent}30`,
                    backgroundColor: `${product.accent}0c`,
                    color: product.accent,
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-2">
              <span className="text-4xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="pb-1.5 text-sm text-muted-foreground">
                {product.unit} · {product.form}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <QtyPicker qty={qty} setQty={setQty} accent={product.accent} />

              <button
                type="button"
                onClick={buyNow}
                disabled={pending}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50 sm:flex-none"
                style={{
                  backgroundImage: `linear-gradient(120deg, ${product.accent}, ${product.accent}bb)`,
                  boxShadow: `0 14px 38px -16px ${product.accent}`,
                }}
              >
                {pending ? 'Yönlendiriliyor…' : 'Hemen Satın Al'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <AddToCart
                product={product}
                qty={qty}
                variant="ghost"
                className="flex-1 sm:flex-none"
              />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <TrustBadge
                icon={<Truck className="h-4 w-4" />}
                title="Aynı gün kargo"
                detail="15:00'e kadar verilen siparişlerde"
              />
              <TrustBadge
                icon={<ShieldCheck className="h-4 w-4" />}
                title="GMP & HACCP"
                detail={`Menşei: ${SITE.origin}`}
              />
              <TrustBadge
                icon={<Package className="h-4 w-4" />}
                title={`${COMMERCE.returnDays} gün iade`}
                detail="Ambalajı açılmamış ürünlerde"
              />
            </div>

            {error ? (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <p className="text-sm leading-relaxed text-red-800">{error}</p>
              </div>
            ) : null}

            <Disclaimer className="mt-7">{CLAIM_DISCLAIMER}</Disclaimer>
          </div>
        </div>
      </div>
    </section>
  )
}

function QtyPicker({
  qty,
  setQty,
  accent,
}: {
  qty: number
  setQty: (n: number) => void
  accent: string
}) {
  return (
    <div
      className="inline-flex items-center rounded-full border"
      style={{ borderColor: `${accent}30` }}
    >
      <button
        type="button"
        onClick={() => setQty(Math.max(1, qty - 1))}
        aria-label="Adet azalt"
        disabled={qty <= 1}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums text-foreground">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => setQty(Math.min(20, qty + 1))}
        aria-label="Adet artır"
        disabled={qty >= 20}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

function TrustBadge({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode
  title: string
  detail: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3.5">
      <span className="text-accent">{icon}</span>
      <p className="mt-2 text-xs font-semibold text-foreground">{title}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
        {detail}
      </p>
    </div>
  )
}

/* ---------------------------------------------------------------- */

/**
 * İçerik bilgisi tablosu + ürün özellikleri.
 * Miktarlar etiketten birebir alınır; %BRD yalnızca etikette verilmişse
 * gösterilir — hesaplanıp uydurulmaz.
 */
function CompositionSection({ product }: { product: ProductMeta }) {
  const hasNrv = product.composition.some((row) => row.nrv)

  return (
    <section className="bg-background pb-16 md:pb-20">
      <div className="container mx-auto px-4">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              İçerik Bilgisi
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {product.servingSize} için
            </p>

            <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Bileşen
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Miktar
                    </th>
                    {hasNrv ? (
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        %BRD
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {product.composition.map((row) => (
                    <tr key={row.name}>
                      <td className="px-5 py-3 text-foreground">{row.name}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums text-foreground">
                        {row.amount}
                      </td>
                      {hasNrv ? (
                        <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                          {row.nrv ?? '–'}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasNrv ? (
              <p className="mt-3 text-xs text-muted-foreground/70">
                BRD: Beslenme Referans Değeri
              </p>
            ) : null}
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Ürün Özellikleri
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {product.unit} · {product.form}
            </p>

            <ul className="mt-5 space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: product.accent }}
                  />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoAccordion({ product }: { product: ProductMeta }) {
  const rows = [
    { title: 'Kullanım', body: product.usage },
    { title: 'Saklama koşulları', body: product.storage },
    {
      title: 'Beyan dayanağı',
      body:
        product.claimBasis.length > 0
          ? `Bu üründeki sağlık beyanları şu besin ögelerine aittir: ${product.claimBasis.join(', ')}. Formüldeki diğer bileşenler yalnızca bileşim olarak tanımlanır.`
          : 'Bu üründe yer alan bileşenler için yetkilendirilmiş bir sağlık beyanı bulunmamaktadır; bileşenler yalnızca bileşim olarak tanımlanır.',
    },
    {
      title: 'Uyarılar',
      body: 'Tavsiye edilen günlük porsiyonu aşmayınız. Takviye edici gıdalar normal beslenmenin yerine geçmez. Hamilelik ve emzirme döneminde, ilaç kullanıyorsanız veya kronik bir rahatsızlığınız varsa hekiminize danışınız. 4 yaş altı çocuklarda hekim önerisi olmadan kullanmayınız. Bileşenlerden herhangi birine alerjiniz varsa kullanmayınız.',
    },
    {
      title: 'Parti ve tüketim tarihi',
      body: 'Tavsiye edilen tüketim tarihi (TETT) ve parti numarası ambalaj üzerindedir.',
    },
  ]

  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="border-y border-border bg-muted/30 py-14 md:py-20">
      <div className="container mx-auto max-w-3xl px-4">
        {/*
         * Ürünün geniş marka görseli. Bu dosyaların içine kendi başlık metni
         * gömülü olduğu için üzerine yazı bindirilmez, temiz gösterilir.
         */}
        <img
          src={mediaUrl(CDN_PATHS.image(product.slug))}
          alt={product.name}
          loading="lazy"
          className="mb-10 aspect-[16/9] w-full rounded-3xl object-cover"
          style={{ boxShadow: `0 30px 70px -45px ${product.accent}` }}
        />

        <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
          {rows.map((row, i) => {
            const isOpen = open === i
            return (
              <div key={row.title}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/60 md:px-8"
                >
                  <span className="text-base font-semibold text-foreground">
                    {row.title}
                  </span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    style={isOpen ? { color: product.accent } : undefined}
                  />
                </button>
                {isOpen ? (
                  <p className="animate-[showcase-fade-in_0.25s_ease-out] px-6 pb-6 text-sm leading-relaxed text-muted-foreground md:px-8">
                    {row.body}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */

function HighlightsSection({ product }: { product: ProductMeta }) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Arka planda /covers/ kullanılır: /images/ dosyalarının içinde gömülü
          başlık metni var, karartılınca okunaksız parazit oluyor. */}
      <img
        src={mediaUrl(CDN_PATHS.cover(product.slug))}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#0a0a12]/95 via-[#0a0a12]/85 to-[#0a0a12]/95"
      />

      <div className="container relative mx-auto px-4">
        <div className="max-w-2xl">
          <KickerRuled>Bileşen & Dayanak</KickerRuled>
          <SectionTitle dark className="mt-5">
            Formülde ne var, hangi ifade neye ait?
          </SectionTitle>
        </div>

        <div className="mt-12 grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          {product.highlights.map((h, i) => (
            <article
              key={h.title}
              className="animate-[showcase-rise-in_0.5s_ease-out_both] rounded-3xl border bg-white/[0.04] p-7 backdrop-blur-md"
              style={{
                borderColor: `${product.accent}30`,
                animationDelay: `${i * 100}ms`,
              }}
            >
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: `${product.accent}1f` }}
              >
                <Check className="h-4 w-4" style={{ color: product.accent }} />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {h.detail}
              </p>
            </article>
          ))}
        </div>

        <Disclaimer dark className="mt-8 max-w-3xl">
          {CLAIM_DISCLAIMER}
        </Disclaimer>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */

function CrossSell({ current }: { current: ProductMeta }) {
  const others = PRODUCTS.filter((p) => p.slug !== current.slug).slice(0, 4)

  return (
    <section className="bg-background py-16 pb-28 md:py-24 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle className="text-2xl md:text-3xl">
            Seriden diğerleri
          </SectionTitle>
          <Link
            to="/urunler"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            Tümünü Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((p) => (
            <Link
              key={p.slug}
              to="/urunler/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <img
                src={mediaUrl(CDN_PATHS.cover(p.slug))}
                alt={p.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="p-4">
                <h3 className="text-sm font-bold text-foreground">
                  {p.shortName}
                </h3>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {formatPrice(p.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- */

/** Mobilde alta sabitlenen satın alma barı */
function StickyBuyBar({ product, qty }: { product: ProductMeta; qty: number }) {
  const { checkout, pending } = useShopifyCheckout()

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <span className="block truncate text-xs text-muted-foreground">
            {product.shortName}
          </span>
          <span className="block text-base font-bold text-foreground">
            {formatPrice(product.price * qty)}
          </span>
        </div>
        <AddToCart
          product={product}
          qty={qty}
          variant="ghost"
          label="Sepete"
          className="ml-auto shrink-0 px-4 py-3 text-xs"
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => void checkout([{ slug: product.slug, qty }])}
          className="shrink-0 rounded-full px-5 py-3 text-xs font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: product.accent }}
        >
          {pending ? '…' : 'Satın Al'}
        </button>
      </div>
    </div>
  )
}
