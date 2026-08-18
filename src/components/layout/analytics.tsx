import { useEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { useConsent } from '#/lib/consent'

/**
 * GA4 ve Meta Pixel — yalnızca çerez onayı verildiyse yüklenir.
 *
 * Kimlikler VITE_ önekli: bu değerler zaten tarayıcıda görünür, gizli değiller.
 * Kimlik tanımlı değilse ilgili betik hiç yüklenmez, yani ölçüm kimliği
 * girilene kadar site tek satır fazladan istek atmaz.
 *
 * SPA olduğu için sayfa değişimleri elle bildirilir; yoksa yalnızca ilk
 * yükleme sayılır ve tüm gezinme kaybolur.
 */

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined

declare global {
  interface Window {
    dataLayer?: Array<unknown>
    gtag?: (...args: Array<unknown>) => void
    fbq?: ((...args: Array<unknown>) => void) & { callMethod?: unknown }
    _fbq?: unknown
  }
}

function loadGa4(id: string) {
  if (document.getElementById('ga4-src')) return
  const s = document.createElement('script')
  s.id = 'ga4-src'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(s)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: Array<unknown>) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  // Sayfa görüntülemeyi kendimiz göndereceğiz (SPA)
  window.gtag('config', id, { send_page_view: false })
}

function loadPixel(id: string) {
  if (document.getElementById('meta-pixel-src')) return
  const s = document.createElement('script')
  s.id = 'meta-pixel-src'
  s.async = true
  s.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(s)

  const queue: Array<Array<unknown>> = []
  const fbq = ((...args: Array<unknown>) => {
    if (window.fbq && window.fbq.callMethod) {
      ;(window.fbq.callMethod as (...a: Array<unknown>) => void)(...args)
    } else {
      queue.push(args)
    }
  }) as Window['fbq']
  window.fbq = window.fbq || fbq
  window._fbq = window._fbq || window.fbq
  window.fbq!('init', id)
}

export function Analytics() {
  const { consent } = useConsent()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const loaded = useRef(false)

  useEffect(() => {
    if (consent !== 'accepted' || loaded.current) return
    if (GA4_ID) loadGa4(GA4_ID)
    if (PIXEL_ID) loadPixel(PIXEL_ID)
    loaded.current = true
  }, [consent])

  // Rota değişiminde sayfa görüntüleme bildir
  useEffect(() => {
    if (consent !== 'accepted') return
    if (GA4_ID && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
      })
    }
    if (PIXEL_ID && window.fbq) window.fbq('track', 'PageView')
  }, [pathname, consent])

  return null
}
