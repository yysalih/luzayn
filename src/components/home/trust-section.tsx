import { BadgeCheck, FileText, FlaskConical, ShieldCheck } from 'lucide-react'
import { CERTIFICATIONS, SITE } from '#/lib/brand'
import {
  Disclaimer,
  KickerPill,
  SectionTitle,
} from '#/components/ui/typography'

const ICONS = [ShieldCheck, BadgeCheck, FlaskConical, FileText]

/**
 * Resmî güven bloğu. Yalnızca ambalajda işaretli olan sertifikalar listelenir;
 * numara/kapsam bilgisi doğrulanmadan yazılmaz.
 */
export function TrustSection() {
  return (
    <section className="border-y border-border bg-muted/40 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <KickerPill>Üretim ve Kayıt</KickerPill>
          <SectionTitle className="mt-4">
            Ambalajda işaretli olan ne varsa, burada da var.
          </SectionTitle>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATIONS.map((cert, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <div
                key={cert.code}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <Icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 text-base font-bold tracking-tight text-foreground">
                  {cert.code}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {cert.label}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoRow label="Menşei" value={SITE.origin} />
          <InfoRow label="İşletme Kayıt No" value={SITE.businessRegNo} />
          <InfoRow
            label="Takviye Edici Gıda Onay No"
            value={SITE.supplementApprovalNo}
          />
        </div>

        <Disclaimer className="mt-6 max-w-3xl">
          Kayıt ve onay numaraları her ürünün ambalajında yer alır. Sitede
          doğrulanmamış hiçbir numara yayımlanmaz.
        </Disclaimer>
      </div>
    </section>
  )
}

/** Değeri boş olan kart hiç render edilmez. */
function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 block text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}
