import { useEffect, useState } from 'react'

/**
 * Çerez onayı — analitik betikleri YALNIZCA onay verildikten sonra yüklenir.
 *
 * Çerez Politikası sayfası "analitik çerezler yalnızca onayınızla çalışır"
 * diyor; bu dosya o sözü teknik olarak tutar. Zorunlu çerezler (sepet)
 * onaydan bağımsızdır, zaten localStorage'da tutuluyor.
 */

const KEY = 'luzayn-consent'

export type ConsentValue = 'accepted' | 'rejected'

export function readConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(KEY)
  return raw === 'accepted' || raw === 'rejected' ? raw : null
}

export function writeConsent(value: ConsentValue) {
  window.localStorage.setItem(KEY, value)
  window.dispatchEvent(new CustomEvent('luzayn-consent', { detail: value }))
}

/**
 * SSR'da her zaman null döner; karar yalnızca istemcide okunur.
 * Böylece sunucu ve ilk istemci render'ı aynı kalır (hydration uyuşmazlığı yok).
 */
export function useConsent() {
  const [consent, setConsent] = useState<ConsentValue | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setConsent(readConsent())
    setReady(true)

    const onChange = (e: Event) => {
      setConsent((e as CustomEvent<ConsentValue>).detail)
    }
    window.addEventListener('luzayn-consent', onChange)
    return () => window.removeEventListener('luzayn-consent', onChange)
  }, [])

  return { consent, ready }
}
