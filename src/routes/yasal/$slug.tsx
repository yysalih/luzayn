import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { SITE } from '#/lib/brand'
import { LEGAL_BY_SLUG, LEGAL_PAGES } from '#/data/legal'
import { NotFoundPage } from '#/components/layout/error-states'

export const Route = createFileRoute('/yasal/$slug')({
  loader: ({ params }) => {
    const page = LEGAL_BY_SLUG[params.slug]
    if (!page) throw notFound()
    return { page }
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page
    if (!page) return {}
    return {
      meta: [
        { title: `${page.title} — ${SITE.name}` },
        { name: 'description', content: page.intro },
      ],
    }
  },
  notFoundComponent: NotFoundPage,
  component: LegalPage,
})

/** Tüm yasal sayfalar bu tek düzenden render edilir — açık tema, max-w-3xl. */
function LegalPage() {
  const { page } = Route.useLoaderData()

  return (
    <>
      <article className="bg-background py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Yasal
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
            {page.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {page.intro}
          </p>

          <div className="mt-12 space-y-10">
            {page.sections.map((section, i) => (
              <section key={section.heading}>
                <h2 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
                  <span className="mr-2 tabular-nums text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-2.5">
                  {section.body.map((line, j) => (
                    <p
                      key={j}
                      className="text-sm leading-relaxed text-muted-foreground"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>

      <section className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Diğer Yasal Sayfalar
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {LEGAL_PAGES.filter((p) => p.slug !== page.slug).map((other) => (
              <Link
                key={other.slug}
                to="/yasal/$slug"
                params={{ slug: other.slug }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                {other.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
