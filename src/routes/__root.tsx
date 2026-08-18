import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { Header } from '#/components/layout/header'
import { Footer } from '#/components/layout/footer'
import { FloatingContact } from '#/components/layout/floating-contact'
import { CookieConsent } from '#/components/layout/cookie-consent'
import { Analytics } from '#/components/layout/analytics'
import { ErrorPage, NotFoundPage } from '#/components/layout/error-states'
import { SITE } from '#/lib/brand'
import { loadCatalog } from '#/lib/cms'
import { CatalogProvider, EMPTY_CATALOG } from '#/lib/catalog-context'

export const Route = createRootRoute({
  /**
   * Katalog burada BİR KEZ okunur; başlık, altbilgi, ana sayfa ve ürün
   * sayfaları aynı veriyi bağlamdan alır.
   *
   * HATA YUTULUYOR ama SESSİZCE DEĞİL. Kök route'ta throw etmek, Supabase'in
   * kısa bir kesintisinde iletişim ve yasal sayfaları da kapatırdı. Bunun
   * yerine boş katalogla devam edip ekranda uyarı gösteriyoruz; ürün
   * sayfaları zaten 404'e düşer, yani yanlış fiyat gösterme riski yok.
   */
  loader: async () => {
    try {
      return { catalog: await loadCatalog(), error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[katalog] okunamadı:', message)
      return { catalog: EMPTY_CATALOG, error: message }
    }
  },

  // Katalog her istemci gezinmesinde yeniden çekilmesin. SSR'da her sayfa
  // yüklemesi zaten tazesini alıyor; bu süre yalnızca sekme içi gezinmeyi
  // etkiler ve panelde yapılan bir değişikliğin görünmesini en fazla bu
  // kadar geciktirir.
  staleTime: 60_000,

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: `${SITE.name} — ${SITE.tagline}` },
      { name: 'description', content: SITE.description },
      { name: 'theme-color', content: '#0a0a12' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: `${SITE.name} — ${SITE.tagline}` },
      { property: 'og:description', content: SITE.description },
      { property: 'og:locale', content: 'tr_TR' },
      { name: 'twitter:card', content: 'summary_large_image' },
      // Ana sayfa paylaşım görseli — üç bitkisel formülün marka karesi.
      // Ürün sayfaları kendi og:image'ını override eder.
      {
        property: 'og:image',
        content: 'https://luzayn.b-cdn.net/medya-jpg/images/3lu.jpg',
      },
      { property: 'og:image:width', content: '1024' },
      { property: 'og:image:height', content: '572' },
      { property: 'og:url', content: SITE.url },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      {
        rel: 'icon',
        href: '/favicon-32.png',
        type: 'image/png',
        sizes: '32x32',
      },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cinzel:wght@500;600&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { catalog, error } = Route.useLoaderData()

  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        <CatalogProvider value={{ catalog, error }}>
          <div className="flex min-h-screen flex-col">
            {error && (
              <p
                role="alert"
                className="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-black"
              >
                Ürün kataloğu şu anda yüklenemedi. Fiyat ve stok bilgisi
                eksik olabilir.
              </p>
            )}
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CatalogProvider>
        <FloatingContact />
        <CookieConsent />
        <Analytics />
        <Scripts />
      </body>
    </html>
  )
}
