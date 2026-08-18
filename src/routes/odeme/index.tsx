import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * Eski site-içi ödeme formu kaldırıldı.
 *
 * Ödeme artık Shopify checkout'unda tamamlanıyor: sepet sayfasındaki
 * "Güvenli Ödemeye Geç" butonu Storefront API ile Shopify'da sepet oluşturup
 * kullanıcıyı oraya yönlendiriyor (bkz. src/server/shopify.ts). Adres, kart
 * ve fatura bilgilerini Shopify topluyor; ödemeyi ona bağlı iyzico alıyor.
 *
 * Bu rota, eski bağlantılar ve yer imleri kırılmasın diye sepete yönlendirir.
 */
export const Route = createFileRoute('/odeme/')({
  beforeLoad: () => {
    throw redirect({ to: '/sepet' })
  },
})
