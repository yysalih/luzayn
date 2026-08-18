import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ProductMeta, ProductSlug } from '#/lib/brand'
import type { Catalog } from '#/lib/cms'

export type CartLine = { slug: ProductSlug; qty: number }

type CartState = {
  lines: Array<CartLine>
  add: (slug: ProductSlug, qty?: number) => void
  setQty: (slug: ProductSlug, qty: number) => void
  remove: (slug: ProductSlug) => void
  clear: () => void
}

const MAX_QTY = 20

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (slug, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.slug === slug)
          if (!existing) return { lines: [...state.lines, { slug, qty }] }
          return {
            lines: state.lines.map((l) =>
              l.slug === slug
                ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) }
                : l,
            ),
          }
        }),
      setQty: (slug, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.slug !== slug)
              : state.lines.map((l) =>
                  l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, qty) } : l,
                ),
        })),
      remove: (slug) =>
        set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: 'luzayn-cart',
      storage: createJSONStorage(() => localStorage),
      // Sunucuda localStorage yok; hydration'ı elle tetikliyoruz (useCartHydrated).
      skipHydration: true,
      /**
       * Katalog artık veritabanından geliyor ve hydration anında elimizde
       * OLMUYOR — bu yüzden burada slug doğrulaması yapılamıyor. Bilinmeyen
       * slug'lar resolveCart() içinde düşürülüyor: orada katalog var.
       *
       * Pratik sonucu aynı: kaldırılmış bir ürün sepette görünmez. Farkı,
       * localStorage'da satırın durmaya devam etmesi — zararsız.
       */
      merge: (persisted, current) => {
        const saved = (persisted as CartState | undefined)?.lines ?? []
        return { ...current, lines: saved.filter((l) => l.qty > 0) }
      },
    },
  ),
)

/**
 * SSR ile istemci ilk render'ı aynı olmalı; sepet yalnızca hydration
 * tamamlandıktan sonra gerçek değerini gösterir. Bu hook'u sepet sayısı,
 * sepet sayfası gibi persist verisine bağlı her yerde kullanın.
 */
export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    void useCart.persist.rehydrate()
    setHydrated(true)
  }, [])

  return hydrated
}

export type CartItem = { product: ProductMeta; qty: number; lineTotal: number }

/**
 * Sepet matematiği.
 *
 * `shipping` null olabilir: Shopify'da ücretsiz kargo eşiği tanımlı değil ve
 * müşteri Standart/Hızlı seçimini checkout'ta yapıyor. Bu durumda sepette
 * kargo tutarı gösterilmez, "ödeme adımında hesaplanır" denir — sitede
 * gerçekleşmeyecek bir toplam göstermemek için.
 */
/**
 * Sepet satırlarını katalogla eşleştirip tutarları hesaplar.
 *
 * Katalog PARAMETRE olarak geliyor, modülden okunmuyor: fiyatlar artık
 * veritabanından ve zustand store'u asenkron veri bekleyemez. Çağıran taraf
 * katalogu bağlamdan alıp veriyor.
 */
export function resolveCart(catalog: Catalog, lines: Array<CartLine>) {
  const items: Array<CartItem> = lines.flatMap((line) => {
    // Katalogda olmayan slug: ürün yayından kaldırılmış olabilir. Sessizce
    // düşürülür — sepette fiyatı bilinmeyen bir satır göstermek yerine.
    const product = catalog.bySlug[line.slug]
    if (!product) return []
    return [{ product, qty: line.qty, lineTotal: product.price * line.qty }]
  })

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const count = items.reduce((sum, item) => sum + item.qty, 0)
  const threshold = catalog.commerce.freeShippingThreshold

  // Eşik tanımlı değilse kargo checkout'ta belli olur
  if (threshold === null) {
    return {
      items,
      count,
      subtotal,
      shipping: null as number | null,
      total: subtotal,
      freeShipping: false,
      remainingForFreeShipping: 0,
      shippingKnown: false,
    }
  }

  const freeShipping = subtotal >= threshold
  const shipping =
    items.length === 0 || freeShipping ? 0 : catalog.commerce.standardShippingFee

  return {
    items,
    count,
    subtotal,
    shipping: shipping as number | null,
    total: subtotal + shipping,
    freeShipping,
    remainingForFreeShipping: Math.max(0, threshold - subtotal),
    shippingKnown: true,
  }
}
