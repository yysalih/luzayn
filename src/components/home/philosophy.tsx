import { PHILOSOPHY } from '#/data/content'
import {
  KickerPill,
  SectionLead,
  SectionTitle,
} from '#/components/ui/typography'

export function Philosophy() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <KickerPill>{PHILOSOPHY.kicker}</KickerPill>
            <SectionTitle className="mt-5 max-w-md text-4xl md:text-5xl">
              {PHILOSOPHY.title}
            </SectionTitle>
            <SectionLead className="mt-5 max-w-md">
              {PHILOSOPHY.intro}
            </SectionLead>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2">
            {PHILOSOPHY.values.map((value, i) => (
              <li
                key={value.title}
                className="bg-card p-7 animate-[showcase-rise-in_0.5s_ease-out_both] md:p-8"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-sm font-semibold tabular-nums text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {value.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
