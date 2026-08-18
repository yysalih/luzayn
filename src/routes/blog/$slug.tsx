import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { CLAIM_DISCLAIMER, SITE } from '#/lib/brand'
import { BLOG_BY_SLUG, BLOG_POSTS, formatBlogDate } from '#/data/content'
import { mediaUrl } from '#/lib/media'
import { Disclaimer } from '#/components/ui/typography'
import { NotFoundPage } from '#/components/layout/error-states'

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const post = BLOG_BY_SLUG[params.slug]
    if (!post) throw notFound()
    return { post }
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post
    if (!post) return {}
    return {
      meta: [
        { title: `${post.title} — ${SITE.name}` },
        { name: 'description', content: post.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.excerpt },
        { property: 'og:image', content: mediaUrl(post.cover) },
      ],
    }
  },
  notFoundComponent: NotFoundPage,
  component: BlogPostPage,
})

function BlogPostPage() {
  const { post } = Route.useLoaderData()
  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      {/* Okuma ağırlıklı sayfa: tamamen açık tema */}
      <article className="bg-background py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm yazılar
          </Link>

          <span
            className="mt-8 inline-block rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider"
            style={{
              backgroundColor: `${post.categoryAccent}1f`,
              color: post.categoryAccent,
            }}
          >
            {post.category}
          </span>

          <h1 className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-foreground md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            {formatBlogDate(post.date)} · {post.readingMinutes} dk okuma
          </p>

          <img
            src={mediaUrl(post.cover)}
            alt=""
            aria-hidden
            className="mt-9 aspect-[16/10] w-full rounded-3xl object-cover"
            style={{ boxShadow: `0 30px 70px -40px ${post.categoryAccent}` }}
          />

          <p className="mt-10 text-lg leading-relaxed text-foreground/80">
            {post.excerpt}
          </p>

          <div className="mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <Disclaimer className="mt-12 rounded-2xl border border-border bg-muted/40 p-5">
            {CLAIM_DISCLAIMER}
          </Disclaimer>
        </div>
      </article>

      <section className="border-t border-border bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Diğer Yazılar
          </h2>

          <div className="mt-8 grid items-start gap-8 md:grid-cols-3 md:gap-6">
            {others.map((other) => (
              <Link
                key={other.slug}
                to="/blog/$slug"
                params={{ slug: other.slug }}
                className="group block"
              >
                <img
                  src={mediaUrl(other.cover)}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <span
                  className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: other.categoryAccent }}
                >
                  {other.category}
                </span>
                <h3 className="mt-1.5 text-base font-bold leading-snug tracking-tight text-foreground">
                  {other.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
