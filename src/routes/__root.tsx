import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { Header } from '#/components/layout/header'
import { Footer } from '#/components/layout/footer'
import { FloatingContact } from '#/components/layout/floating-contact'
import { CookieConsent } from '#/components/layout/cookie-consent'
import { Analytics } from '#/components/layout/analytics'
import { ErrorPage, NotFoundPage } from '#/components/layout/error-states'
import { SITE } from '#/lib/brand'

export const Route = createRootRoute({
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
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <FloatingContact />
        <CookieConsent />
        <Analytics />
        <Scripts />
      </body>
    </html>
  )
}
