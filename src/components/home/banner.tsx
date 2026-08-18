import { mediaUrl } from '#/lib/media'
import { KickerRuled } from '#/components/ui/typography'

/** Ken-burns animasyonlu fotoğraf banner'ı — bölümler arası nefes alanı. */
export function Banner() {
  return (
    <section className="relative h-[22rem] overflow-hidden md:h-[28rem]">
      {/* Üç bitkisel formül birlikte; ürünler sağda, sol taraf metne kalıyor.
          object-position sağa çekili ki ken-burns sırasında şişeler kadraj dışına düşmesin. */}
      <img
        src={mediaUrl('/images/3lu.jfif')}
        alt="Luzayn RO, Reishi Mushroom & Echinacea ve XSLS ürünleri"
        loading="lazy"
        className="absolute inset-0 h-full w-full origin-center object-cover object-[70%_center] animate-[wisdom-kenburns_24s_ease-in-out_infinite_alternate] md:object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#0a0a12]/95 via-[#0a0a12]/75 to-[#0a0a12]/25"
      />

      <div className="container relative mx-auto flex h-full max-w-4xl flex-col justify-center px-4">
        <KickerRuled>Luzayn</KickerRuled>
        <p className="mt-5 text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl md:text-4xl">
          Bir formülün değeri, içindekilerin adında değil miktarında saklıdır.
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
          Bu yüzden her ambalajda bileşenin ne kadar olduğunu yazıyoruz ve her
          iddianın hangi bileşene ait olduğunu belirtiyoruz.
        </p>
      </div>
    </section>
  )
}
