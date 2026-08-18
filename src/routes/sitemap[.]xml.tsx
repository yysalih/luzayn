import { createFileRoute } from '@tanstack/react-router'
import { SITE } from '#/lib/brand'
import { loadBlogPosts, loadCatalog } from '#/lib/cms'
import { LEGAL_NAV } from '#/data/legal'

/**
 * /sitemap.xml — katalogdan üretilir, elle güncellenmez.
 * Yeni ürün, yazı veya yasal sayfa eklendiğinde otomatik listeye girer.
 *
 * Sepet ve ödeme dışarıda: robots.txt zaten engelliyor.
 */

type Entry = { path: string; priority: string; changefreq: string }

/**
 * Site haritası artık veritabanından üretiliyor.
 *
 * Bunun görünmeyen ama önemli sonucu: panelden taslağa alınan bir ürün veya
 * yazı haritadan da düşer. Statik listeyle, yayından kaldırılan bir sayfayı
 * arama motorlarına önermeye devam ederdik.
 */
async function buildEntries(): Promise<Array<Entry>> {
  const [catalog, posts] = await Promise.all([loadCatalog(), loadBlogPosts()])

  return [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/urunler', priority: '0.9', changefreq: 'weekly' },
    ...catalog.products.map((p) => ({
      path: `/urunler/${p.slug}`,
      priority: '0.9',
      changefreq: 'weekly',
    })),
    { path: '/kurumsal', priority: '0.6', changefreq: 'monthly' },
    { path: '/blog', priority: '0.7', changefreq: 'weekly' },
    ...posts.map((post) => ({
      path: `/blog/${post.slug}`,
      priority: '0.6',
      changefreq: 'monthly',
    })),
    { path: '/iletisim', priority: '0.5', changefreq: 'yearly' },
    ...LEGAL_NAV.map((page) => ({
      path: `/yasal/${page.slug}`,
      priority: '0.3',
      changefreq: 'yearly',
    })),
  ]
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const base = SITE.url.replace(/\/+$/, '')
        const entries = await buildEntries()
        const body = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map((e) =>
            [
              '  <url>',
              `    <loc>${base}${e.path}</loc>`,
              `    <changefreq>${e.changefreq}</changefreq>`,
              `    <priority>${e.priority}</priority>`,
              '  </url>',
            ].join('\n'),
          ),
          '</urlset>',
          '',
        ].join('\n')

        return new Response(body, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
