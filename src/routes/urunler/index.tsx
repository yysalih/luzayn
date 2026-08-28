import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { CDN_PATHS, CLAIM_DISCLAIMER, SITE } from '#/lib/brand'
import { useCatalog } from '#/lib/catalog-context'
import type { ProductMeta } from '#/lib/brand'
import { mediaUrl } from '#/lib/media'
import { formatPrice } from '#/lib/utils'
import { PageHero } from '#/components/shared/page-hero'
import { AddToCart } from '#/components/product/add-to-cart'
import { Disclaimer } from '#/components/ui/typography'

export const Route = createFileRoute('/urunler/')({
  head: () => ({
    meta: [
      { title: `Ürünler — ${SITE.name}` },
      {
        name: 'description',
        content:
          'Luzayn takviye edici gıda serisinin tamamı: magnezyum kompleksi, omega-3, C vitamini, D3K2 damla, koenzim Q10, reishi, RO ve XSLS.',
      },
    ],
  }),
  component: ProductsPage,
})

function ProductsPage() {
  const { products } = useCatalog()

  return (
    <div className="bg-[#0a0a12]">
      <PageHero
        logo
        title="Sekiz formül, tek seri."
        lead="Her ürünün bileşenleri, miktarları ve iddiasının hangi bileşene dayandığı ayrı ayrı yazılıdır. Ne eksik ne fazla."
      />

      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>

          <Disclaimer dark className="mt-10 max-w-3xl">
            {CLAIM_DISCLAIMER}
          </Disclaimer>
        </div>
      </section>
    </div>
  )
}

function ProductCard({
  product,
  index,
}: {
  product: ProductMeta
  index: number
}) {
  return (
    <article
      className="group flex animate-[showcase-rise-in_0.5s_ease-out_both] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link
        to="/urunler/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden"
      >
        <img
          src={mediaUrl(product.cover)}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1.5px ${product.accent}66` }}
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
          {product.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-lg font-bold leading-tight text-white">
          {product.shortName}
        </h2>
        <p className="mt-1.5 text-sm leading-snug text-white/55">
          {product.subtitle}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.keyIngredients.slice(0, 4).map((ing) => (
            <span
              key={ing}
              className="rounded-full border px-2.5 py-1 text-[11px] text-white/60"
              style={{ borderColor: `${product.accent}30` }}
            >
              {ing}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            <span className="block text-xl font-bold text-white">
              {formatPrice(product.price)}
            </span>
            <span className="block text-[11px] text-white/40">
              {product.unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AddToCart product={product} variant="icon" />
            <Link
              to="/urunler/$slug"
              params={{ slug: product.slug }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              İncele
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
