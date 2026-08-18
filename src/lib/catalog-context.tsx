import { createContext, useContext } from 'react'
import type { Catalog } from '#/lib/cms'

/**
 * Katalog bağlamı.
 *
 * Ürünler, ticari ayarlar ve set teklifi kök route'ta BİR KEZ okunur ve
 * buradan dağıtılır. Alternatifi her bileşenin kendi sorgusunu atmasıydı;
 * başlık, altbilgi, ana sayfa rayı ve sepet aynı sekiz satırı ayrı ayrı
 * çekerdi.
 */

interface CatalogState {
  catalog: Catalog
  /** Katalog okunamadıysa sebebi; okunduysa null. */
  error: string | null
}

/**
 * Katalog okunamadığında sitenin tamamını düşürmemek için boş katalog.
 *
 * Kök route'ta hata fırlatmak, Supabase'in bir dakikalık kesintisinde
 * iletişim ve yasal sayfaları da kapatırdı. Bunun yerine katalog boş kalıyor
 * ve ekranda görünür bir uyarı çıkıyor — SESSİZCE boş göstermek daha
 * kötüsü olurdu: "ürünlerimiz tükendi" gibi okunur.
 */
export const EMPTY_CATALOG: Catalog = {
  products: [],
  bySlug: {},
  categories: [],
  featured: [],
  commerce: {
    freeShippingThreshold: null,
    standardShippingFee: 0,
    returnDays: 14,
  },
  bundle: { name: '', tagline: '', slugs: [], discountRate: 0 },
}

const CatalogContext = createContext<CatalogState | null>(null)

export function CatalogProvider({
  value,
  children,
}: {
  value: CatalogState
  children: React.ReactNode
}) {
  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  )
}

function useCatalogState(): CatalogState {
  const state = useContext(CatalogContext)
  if (!state)
    throw new Error(
      'useCatalog yalnızca CatalogProvider içinde çağrılabilir. Sağlayıcı kök route’ta (__root.tsx) kuruluyor.',
    )
  return state
}

export function useCatalog(): Catalog {
  return useCatalogState().catalog
}

/** Katalog okunamadıysa sebebi — uyarı şeridi bunu gösteriyor. */
export function useCatalogError(): string | null {
  return useCatalogState().error
}
