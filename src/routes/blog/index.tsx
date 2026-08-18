import { Link, createFileRoute } from '@tanstack/react-router'
import { SITE } from '#/lib/brand'
import { formatBlogDate } from '#/data/content'
import { loadBlogPosts } from '#/lib/cms'
import { mediaUrl } from '#/lib/media'
import { ProductRail } from '#/components/home/product-rail'

export const Route = createFileRoute('/blog/')({
  loader: () => loadBlogPosts(),
  head: () => ({
    meta: [
      { title: `Blog — ${SITE.name}` },
      {
        name: 'description',
        content:
          'Takviye etiketi nasıl okunur, besin ögesi beyanları neye dayanır, magnezyum formları neden farklıdır — Luzayn yazıları.',
      },
    ],
  }),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const posts = Route.useLoaderData()

  return (
    <>
      {/* Blog listeleme açık temadır */}
      <section className="bg-background pb-14 pt-16 md:pb-16 md:pt-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Yazılar
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Etiketi birlikte okuyalım.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Pazarlama cümlesi değil, etiket satırı. Bir takviyenin gerçekte ne
            söylediğini anlamanız için yazıyoruz.
          </p>
        </div>
      </section>

      <section className="bg-background pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="grid items-start gap-10 md:grid-cols-3 md:gap-8">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={mediaUrl(post.cover)}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>

                  <span
                    className="mt-5 inline-block rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider"
                    style={{
                      backgroundColor: `${post.categoryAccent}1f`,
                      color: post.categoryAccent,
                    }}
                  >
                    {post.category}
                  </span>

                  <span className="mt-3 block text-xs text-muted-foreground">
                    {formatBlogDate(post.date)} · {post.readingMinutes} dk okuma
                  </span>

                  <h2 className="mt-2 text-xl font-bold leading-snug tracking-tight text-foreground">
                    {post.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-border">
        <ProductRail />
      </div>
    </>
  )
}
