import { createFileRoute } from '@tanstack/react-router'
import { CDN_PATHS, CERTIFICATIONS, CLAIM_DISCLAIMER, SITE } from '#/lib/brand'
import { loadCatalog, loadHome } from '#/lib/cms'
import { mediaUrl } from '#/lib/media'
import { PageHero } from '#/components/shared/page-hero'
import { SeriesExplorer } from '#/components/kurumsal/series-explorer'
import {
  Disclaimer,
  KickerPill,
  KickerRuled,
  SectionLead,
  SectionTitle,
} from '#/components/ui/typography'

export const Route = createFileRoute('/kurumsal')({
  // Felsefe bölümü ana sayfayla aynı kaydı okuyor; iki yerde ayrı metin
  // tutmak, birinin güncellenip diğerinin unutulması demekti.
  loader: async () => {
    const catalog = await loadCatalog()
    const { philosophy } = await loadHome(catalog)
    return { philosophy }
  },
  head: () => ({
    meta: [
      { title: `Kurumsal — ${SITE.name}` },
      {
        name: 'description',
        content: `${SITE.legalName} hakkında: üretim yaklaşımı, kalite belgeleri ve etiket şeffaflığı ilkesi.`,
      },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  const { philosophy } = Route.useLoaderData()

  return (
    <>
      <PageHero
        kicker="Kurumsal"
        title="Bir kutunun içinde ne olduğunu bilme hakkı."
        lead={SITE.description}
      />

      {/* Yaklaşım — açık zemin */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <KickerPill>{philosophy?.kicker}</KickerPill>
              <SectionTitle className="mt-5 max-w-md text-4xl md:text-5xl">
                {philosophy?.title}
              </SectionTitle>
              <SectionLead className="mt-5 max-w-md">
                {philosophy?.intro}
              </SectionLead>

              <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-6">
                <h3 className="text-sm font-semibold text-foreground">
                  {SITE.legalName}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {SITE.fullAddress}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Menşei: {SITE.origin}
                </p>
              </div>
            </div>

            <ul className="grid gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2">
              {(philosophy?.values ?? []).map((value, i) => (
                <li key={value.title} className="bg-card p-7 md:p-8">
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

      {/* Kalite — koyu, fotoğraf arka planlı */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <img
          src={mediaUrl(CDN_PATHS.cover('xsls'))}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[#0a0a12]/95 via-[#0a0a12]/85 to-[#0a0a12]/95"
        />

        <div className="container relative mx-auto px-4">
          <div className="max-w-2xl">
            <KickerRuled>Üretim ve Kalite</KickerRuled>
            <SectionTitle dark className="mt-5">
              Belgesi olanı yazıyoruz.
            </SectionTitle>
            <SectionLead dark className="mt-4">
              Seri, iyi üretim uygulamaları ve gıda güvenliği yönetimi
              kapsamında üretilir. Ambalajda işaretli olan belgeler bunlardır;
              işaretli olmayan hiçbir belgeyi sitede iddia etmiyoruz.
            </SectionLead>
          </div>

          <div className="mt-12 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CERTIFICATIONS.map((cert, i) => (
              <div
                key={cert.code}
                className="animate-[showcase-rise-in_0.5s_ease-out_both] rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="text-2xl font-bold tracking-tight text-white">
                  {cert.code}
                </span>
                <p className="mt-2.5 text-sm leading-relaxed text-white/55">
                  {cert.label}
                </p>
              </div>
            ))}
          </div>

          <Disclaimer dark className="mt-8 max-w-3xl">
            İşletme kayıt numarası ve takviye edici gıda onay numarası her
            ürünün ambalajında yer alır. Bu numaralar teyit edildikçe sitede de
            yayımlanacaktır.
          </Disclaimer>
        </div>
      </section>

      {/* İddia politikası */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4">
          <KickerPill>İddia Politikası</KickerPill>
          <SectionTitle className="mt-5">
            Hangi cümleyi neye dayanarak kuruyoruz?
          </SectionTitle>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              Sağlık beyanı, mevzuatın yetkilendirdiği besin ögeleri için ve
              yalnızca o besin ögesine atfen kurulur. Örneğin “magnezyum
              yorgunluk ve bitkinliğin azalmasına katkıda bulunur” ifadesi
              magnezyuma aittir; ürüne değil.
            </p>
            <p>
              Bitkisel bileşenlerin büyük bölümü için yetkilendirilmiş bir beyan
              bulunmamaktadır. Reishi, kordiseps, safran, rodiola, valerian ve
              karahindiba içeren formüllerimizde bu bileşenleri yalnızca bileşim
              olarak tanımlıyor, onlara fayda atfetmiyoruz.
            </p>
            <p>
              Sitede yer alan her rakam ya doğrudan ürün etiketinden okunur ya
              da etiket verisinden hesaplanır. Kaynağı gösterilemeyen bir
              istatistik yayımlanmaz.
            </p>
          </div>

          <Disclaimer className="mt-8">{CLAIM_DISCLAIMER}</Disclaimer>
        </div>
      </section>

      <SeriesExplorer />
    </>
  )
}
