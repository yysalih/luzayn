import { useCallback, useState } from 'react'
import { createShopifyCheckout } from '#/server/shopify'
import type { CartLine } from '#/store/cart'

/**
 * Sepeti Shopify'da oluşturup kullanıcıyı Shopify checkout'una gönderir.
 *
 * Sitede ödeme formu yok: adres, kart ve fatura bilgilerini Shopify checkout
 * topluyor, ödemeyi oraya bağlı iyzico alıyor.
 */
export function useShopifyCheckout() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkout = useCallback(async (lines: Array<CartLine>) => {
    if (lines.length === 0) return
    setError(null)
    setPending(true)
    try {
      const result = await createShopifyCheckout({
        data: { items: lines.map((l) => ({ slug: l.slug, qty: l.qty })) },
      })
      if (result.ok) {
        window.location.href = result.checkoutUrl
        return
      }
      setError(result.message)
    } catch (err) {
      console.error('[ödeme] beklenmeyen hata:', err)
      setError(
        'Ödeme sayfası açılamadı. Lütfen tekrar deneyin veya bizimle iletişime geçin.',
      )
    } finally {
      setPending(false)
    }
  }, [])

  return { checkout, pending, error }
}
