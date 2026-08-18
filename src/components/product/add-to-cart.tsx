import { useEffect, useRef, useState } from 'react'
import { Check, Plus, ShoppingBag } from 'lucide-react'
import type { ProductMeta } from '#/lib/brand'
import { useCart, useCartHydrated } from '#/store/cart'
import { cn } from '#/lib/utils'

type Variant = 'solid' | 'ghost' | 'icon'

/**
 * Sepete ekleme; eklendikten sonra 1.8 sn "Eklendi" durumunda kalır.
 * Sepet localStorage'dan hydrate olduğu için hydration bitene kadar buton
 * devre dışıdır — aksi hâlde ilk tıklama boş state üzerine yazardı.
 */
export function AddToCart({
  product,
  qty = 1,
  variant = 'solid',
  label = 'Sepete Ekle',
  className,
}: {
  product: ProductMeta
  qty?: number
  variant?: Variant
  label?: string
  className?: string
}) {
  const hydrated = useCartHydrated()
  const add = useCart((s) => s.add)
  const [added, setAdded] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const onClick = () => {
    add(product.slug, qty)
    setAdded(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1800)
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={!hydrated}
        aria-label={`${product.shortName} sepete ekle`}
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:scale-110 disabled:opacity-50',
          className,
        )}
        style={{ backgroundColor: added ? '#16a34a' : product.accent }}
      >
        {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
    )
  }

  if (variant === 'ghost') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={!hydrated}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-colors disabled:opacity-50',
          className,
        )}
        style={{
          borderColor: `${product.accent}66`,
          color: added ? '#16a34a' : product.accent,
        }}
      >
        {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {added ? 'Sepete Eklendi' : label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!hydrated}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50',
        className,
      )}
      style={{
        backgroundColor: added ? '#16a34a' : product.accent,
        boxShadow: `0 12px 34px -14px ${product.accent}`,
      }}
    >
      {added ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingBag className="h-4 w-4" />
      )}
      {added ? 'Sepete Eklendi' : label}
    </button>
  )
}
