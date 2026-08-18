import { createFileRoute } from '@tanstack/react-router'
import { SITE } from '#/lib/brand'

/**
 * /robots.txt — statik dosya yerine rota, çünkü sitemap adresi SITE.url'den
 * türüyor. Alan adı luzayn.com'a taşındığında burası kendiliğinden doğru olur.
 *
 * Sepet ve ödeme adımları indekslenmez: içerik değeri yok, kullanıcıya özel.
 */
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(
          [
            'User-agent: *',
            'Allow: /',
            'Disallow: /sepet',
            'Disallow: /odeme',
            '',
            `Sitemap: ${SITE.url}/sitemap.xml`,
            '',
          ].join('\n'),
          {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'public, max-age=3600',
            },
          },
        ),
    },
  },
})
