import { Link } from '@tanstack/react-router'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from './logo'
import { CERTIFICATIONS, SITE } from '#/lib/brand'
import { useCatalog } from '#/lib/catalog-context'
import { LEGAL_NAV } from '#/data/legal'

export function Footer() {
  const { products } = useCatalog()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-[#0a0a12] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-accent-soft/15 blur-[120px]"
      />

      <div className="container relative mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo inverted className="h-9 md:h-10" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {SITE.description}
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                <span>{SITE.fullAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-white/40" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-white/40" />
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                  className="hover:text-white"
                >
                  {SITE.phone}
                </a>
              </li>
            </ul>

            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <InstagramGlyph />
              @luzayntr
            </a>
          </div>

          <FooterColumn title="Ürünler">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  to="/urunler/$slug"
                  params={{ slug: p.slug }}
                  className="flex items-center gap-2 py-1 text-white/60 transition-colors hover:text-white"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: p.accent }}
                  />
                  {p.shortName}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Kurumsal">
            <li>
              <FooterLink to="/kurumsal">Hakkımızda</FooterLink>
            </li>
            <li>
              <FooterLink to="/urunler">Tüm Ürünler</FooterLink>
            </li>
            <li>
              <FooterLink to="/blog">Blog</FooterLink>
            </li>
            <li>
              <FooterLink to="/iletisim">İletişim</FooterLink>
            </li>
          </FooterColumn>

          <FooterColumn title="Yasal">
            {LEGAL_NAV.map((page) => (
              <li key={page.slug}>
                <Link
                  to="/yasal/$slug"
                  params={{ slug: page.slug }}
                  className="block py-1 text-white/60 transition-colors hover:text-white"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-2.5 border-t border-white/10 pt-8">
          {CERTIFICATIONS.map((cert) => (
            <span
              key={cert.code}
              title={cert.label}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white/60 backdrop-blur-md"
            >
              {cert.code}
            </span>
          ))}
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white/60 backdrop-blur-md">
            Menşei: {SITE.origin}
          </span>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-white/40">
          Takviye edici gıdalar normal beslenmenin yerine geçmez; hastalıkların
          önlenmesi veya tedavisi amacıyla kullanılmaz. Tavsiye edilen günlük
          porsiyonu aşmayınız. Hamilelik ve emzirme döneminde, ilaç kullanımında
          veya kronik rahatsızlık varlığında hekiminize danışınız.
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {SITE.legalName}
          </span>
          <span>Tüm hakları saklıdır.</span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
        {title}
      </h3>
      <ul className="mt-4 space-y-0.5 text-sm">{children}</ul>
    </div>
  )
}

function FooterLink({
  to,
  children,
}: {
  to: '/kurumsal' | '/urunler' | '/blog' | '/iletisim'
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="block py-1 text-white/60 transition-colors hover:text-white"
    >
      {children}
    </Link>
  )
}

/** lucide marka ikonlarını kaldırdı; Instagram glifi satır içi çizilir. */
function InstagramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
