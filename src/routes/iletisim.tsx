import { createFileRoute } from '@tanstack/react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { SITE } from '#/lib/brand'
import { PageHero } from '#/components/shared/page-hero'
import { ContactForm } from '#/components/shared/contact-form'
import { FaqAccordion } from '#/components/shared/faq-accordion'
import { FAQ } from '#/data/content'
import { KickerPill, SectionTitle } from '#/components/ui/typography'

export const Route = createFileRoute('/iletisim')({
  head: () => ({
    meta: [
      { title: `İletişim — ${SITE.name}` },
      {
        name: 'description',
        content:
          'Ürünler, siparişler ve iş birlikleri için Luzayn ile iletişime geçin.',
      },
    ],
  }),
  component: ContactPage,
})

function ContactPage() {
  return (
    <>
      <PageHero
        kicker="İletişim"
        title="Sorunuzu yazın."
        lead="Ürün içeriği, sipariş durumu, toptan alım veya veri talepleri — hepsi için aynı formu kullanabilirsiniz."
      />

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <div>
              <KickerPill>Bize Ulaşın</KickerPill>
              <SectionTitle className="mt-4 text-2xl md:text-3xl">
                Doğrudan iletişim
              </SectionTitle>

              <ul className="mt-8 space-y-5">
                <ContactRow
                  icon={<Mail className="h-4 w-4" />}
                  label="E-posta"
                  value={SITE.email}
                  href={`mailto:${SITE.email}`}
                />
                <ContactRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Telefon"
                  value={SITE.phone}
                  href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                />
                <ContactRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Adres"
                  value={SITE.fullAddress}
                />
              </ul>

              <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  {SITE.legalName}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {SITE.fullAddress}
                </p>
                <dl className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <InfoLine label="MERSİS No" value={SITE.mersis} />
                  <InfoLine label="Vergi Dairesi" value={SITE.taxOffice} />
                  <InfoLine label="Vergi No" value={SITE.taxNumber} />
                  <InfoLine
                    label="İşletme Kayıt No"
                    value={SITE.businessRegNo}
                  />
                </dl>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <SectionTitle className="text-2xl md:text-3xl">
            Önce buraya bakın
          </SectionTitle>
          <div className="mt-8">
            <FaqAccordion items={FAQ.slice(0, 5)} />
          </div>
        </div>
      </section>
    </>
  )
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
        {icon}
      </span>
      <div>
        <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {href ? (
          <a
            href={href}
            className="mt-0.5 block text-sm font-medium text-foreground hover:text-accent"
          >
            {value}
          </a>
        ) : (
          <span className="mt-0.5 block text-sm font-medium text-foreground">
            {value}
          </span>
        )}
      </div>
    </li>
  )
}

/** Değeri boş olan satır hiç render edilmez — canlı sitede yer tutucu metin göstermeyiz. */
function InfoLine({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <dt className="shrink-0">{label}:</dt>
      <dd>{value}</dd>
    </div>
  )
}
