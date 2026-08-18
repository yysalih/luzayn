import { Link } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'
import { SITE } from '#/lib/brand'

/**
 * WhatsApp numarası tanımlıysa doğrudan wa.me'ye, tanımlı değilse iletişim
 * sayfasına gider — kırık bir wa.me linki üretmemek için.
 */
export function FloatingContact() {
  const whatsapp = SITE.whatsapp
  const hasWhatsapp = whatsapp.length > 0
  const shared =
    'fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-transform hover:scale-110'

  if (hasWhatsapp) {
    return (
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp'tan yazın"
        className={`${shared} bg-[#25D366] text-white shadow-[#25D366]/30`}
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    )
  }

  return (
    <Link
      to="/iletisim"
      aria-label="İletişime geçin"
      className={`${shared} bg-accent text-white shadow-accent/30`}
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  )
}
