import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <Shell
      code="404"
      title="Aradığınız sayfa bulunamadı."
      description="Bağlantı taşınmış veya hiç var olmamış olabilir. Ürünlere göz atarak devam edebilirsiniz."
    />
  )
}

export function ErrorPage({ error }: { error?: Error }) {
  return (
    <Shell
      code="Hata"
      title="Beklenmedik bir sorun oluştu."
      description={
        error?.message ??
        'Sayfa yüklenirken bir sorunla karşılaştık. Sayfayı yenilemeyi deneyebilirsiniz.'
      }
    />
  )
}

function Shell({
  code,
  title,
  description,
}: {
  code: string
  title: string
  description: string
}) {
  return (
    <section className="relative overflow-hidden bg-[#0a0a12] py-28 text-white md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />
      <div className="container relative mx-auto max-w-2xl px-4 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
          {code}
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/60">
          {description}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfa
          </Link>
          <Link
            to="/urunler"
            className="inline-flex items-center rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Ürünler
          </Link>
        </div>
      </div>
    </section>
  )
}
