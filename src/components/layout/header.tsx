import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronDown, Menu, ShoppingBag, X } from 'lucide-react'
import { Logo } from './logo'
import { CDN_PATHS } from '#/lib/brand'
import type { ProductMeta } from '#/lib/brand'
import { useCatalog } from '#/lib/catalog-context'
import { mediaUrl } from '#/lib/media'
import { useScrolled } from '#/hooks/use-scrolled'
import { resolveCart, useCart, useCartHydrated } from '#/store/cart'
import { cn } from '#/lib/utils'

type NavChild = {
  label: string
  slug: string
  accent: string
  hint: string
  /** Dropdown'da renkli nokta yerine gösterilen kapak fotoğrafı */
  image: string
}

type NavItem = {
  label: string
  to: '/urunler' | '/kurumsal' | '/blog' | '/iletisim'
  childPattern?: '/urunler/$slug'
  children?: Array<NavChild>
}

/**
 * Menü artık katalogdan kuruluyor, o yüzden modül seviyesinde sabit olamaz:
 * ürünler istek anında veritabanından geliyor.
 */
function buildNav(products: Array<ProductMeta>): Array<NavItem> {
  return [
    {
      label: 'Ürünler',
      to: '/urunler',
      childPattern: '/urunler/$slug',
      children: products.map((p) => ({
        label: p.shortName,
        slug: p.slug,
        accent: p.accent,
        hint: p.subtitle,
        image: p.cover ?? CDN_PATHS.cover(p.slug),
      })),
    },
    { label: 'Kurumsal', to: '/kurumsal' },
    { label: 'Blog', to: '/blog' },
    { label: 'İletişim', to: '/iletisim' },
  ]
}

export function Header() {
  const { products } = useCatalog()
  const NAV = useMemo(() => buildNav(products), [products])

  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isHome = pathname === '/'
  const scrolled = useScrolled(80)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const transparent = isHome && !scrolled

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  useEffect(() => {
    if (!openDropdown) return
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [openDropdown])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'z-50 w-full transition-all duration-300',
        isHome ? 'fixed top-0 left-0' : 'sticky top-0',
        transparent
          ? 'bg-transparent'
          : 'border-b border-border bg-white/90 backdrop-blur-md',
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:h-18">
        <Link to="/" className="shrink-0" aria-label="Luzayn ana sayfa">
          <Logo inverted={transparent} />
        </Link>

        <nav ref={navRef} className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.to} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.to ? null : item.to)
                  }
                  aria-expanded={openDropdown === item.to}
                  className={cn(
                    'flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                    transparent
                      ? 'text-white/85 hover:bg-white/10 hover:text-white'
                      : 'text-foreground/75 hover:bg-muted hover:text-foreground',
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 transition-transform',
                      openDropdown === item.to && 'rotate-180',
                    )}
                  />
                </button>

                {openDropdown === item.to ? (
                  <div className="absolute left-0 top-full mt-2 grid w-[34rem] grid-cols-2 gap-0.5 animate-[showcase-fade-in_0.18s_ease-out] rounded-2xl border border-border bg-white p-2 shadow-xl shadow-black/5">
                    {item.children.map((child) => (
                      <Link
                        key={child.slug}
                        to={item.childPattern!}
                        params={{ slug: child.slug }}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"
                      >
                        <img
                          src={mediaUrl(child.image)}
                          alt=""
                          aria-hidden
                          loading="lazy"
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          style={{
                            boxShadow: `inset 0 0 0 1px ${child.accent}30`,
                          }}
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-foreground">
                            {child.label}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {child.hint}
                          </span>
                        </span>
                      </Link>
                    ))}
                    <Link
                      to={item.to}
                      className="col-span-2 mt-1 block rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-accent hover:bg-muted"
                    >
                      Tümünü Gör
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  transparent
                    ? 'text-white/85 hover:bg-white/10 hover:text-white'
                    : 'text-foreground/75 hover:bg-muted hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <CartButton transparent={transparent} />

          <Link
            to="/urunler"
            className={cn(
              'hidden rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition-transform hover:scale-105 sm:inline-flex',
              transparent
                ? 'bg-white text-black shadow-black/20'
                : 'bg-accent text-white shadow-accent/25',
            )}
          >
            Ürünleri Keşfet
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden',
              transparent
                ? 'text-white hover:bg-white/10'
                : 'text-foreground hover:bg-muted',
            )}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 animate-[showcase-fade-in_0.2s_ease-out] overflow-y-auto border-t border-border bg-white px-4 pb-10 pt-4 lg:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.to} className="border-b border-border/70">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileSection(
                        mobileSection === item.to ? null : item.to,
                      )
                    }
                    aria-expanded={mobileSection === item.to}
                    className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-foreground"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-muted-foreground transition-transform',
                        mobileSection === item.to && 'rotate-180',
                      )}
                    />
                  </button>
                  {mobileSection === item.to ? (
                    <div className="pb-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.slug}
                          to={item.childPattern!}
                          params={{ slug: child.slug }}
                          className="flex items-center gap-3 py-2 text-sm text-muted-foreground"
                        >
                          <img
                            src={mediaUrl(child.image)}
                            alt=""
                            aria-hidden
                            loading="lazy"
                            className="h-9 w-9 shrink-0 rounded-lg object-cover"
                            style={{
                              boxShadow: `inset 0 0 0 1px ${child.accent}30`,
                            }}
                          />
                          {child.label}
                        </Link>
                      ))}
                      <Link
                        to={item.to}
                        className="block py-2.5 text-xs font-semibold uppercase tracking-wider text-accent"
                      >
                        Tümünü Gör
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className="border-b border-border/70 py-4 text-base font-medium text-foreground"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <Link
            to="/urunler"
            className="mt-6 block rounded-full bg-accent px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-accent/25"
          >
            Ürünleri Keşfet
          </Link>
        </div>
      ) : null}
    </header>
  )
}

function CartButton({ transparent }: { transparent: boolean }) {
  const hydrated = useCartHydrated()
  const lines = useCart((s) => s.lines)
  // Hydration tamamlanana kadar sunucu render'ıyla aynı kalmalı
  const count = hydrated ? resolveCart(lines).count : 0

  return (
    <Link
      to="/sepet"
      aria-label={count > 0 ? `Sepet — ${count} ürün` : 'Sepet'}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors',
        transparent
          ? 'text-white hover:bg-white/10'
          : 'text-foreground hover:bg-muted',
      )}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  )
}
