import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { formatBlogDate } from '#/data/content'
import type { BlogPost } from '#/data/content'
import { mediaUrl } from '#/lib/media'
import { KickerPill, SectionTitle } from '#/components/ui/typography'

/**
 * Sade editoryal önizleme: çıplak görsel, üstünde rozet YOK.
 * Kategori metni accent renginde, kart çerçevesi yok.
 */
export function BlogPreview({ posts: all }: { posts: Array<BlogPost> }) {
  const posts = all.slice(0, 3)

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <KickerPill>Yazılar</KickerPill>
            <SectionTitle className="mt-4">
              Etiketi birlikte okuyalım.
            </SectionTitle>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Tüm Yazılar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="group block"
            >
              <img
                src={mediaUrl(post.cover)}
                alt=""
                aria-hidden
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span
                className="mt-5 block text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: post.categoryAccent }}
              >
                {post.category}
              </span>
              <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-foreground">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <span className="mt-3 block text-xs text-muted-foreground/70">
                {formatBlogDate(post.date)} · {post.readingMinutes} dk okuma
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
