import { readConsent } from '#/lib/consent'
import { SUPABASE_ANON_KEY, SUPABASE_REST_URL } from '#/lib/supabase'

/**
 * Buton/olay ölçümü — yönetim panelindeki "Olaylar" ekranını besleyen taraf.
 *
 * TOPLU GÖNDERİM ŞART. Her tıklamada tek istek atmak, ölçmek istediğimiz
 * etkileşimin kendisini yavaşlatır. Olaylar bir tampona yazılıyor ve
 * aşağıdaki üç durumdan biriyle boşaltılıyor: zamanlayıcı, tampon dolması,
 * sekmenin gizlenmesi.
 *
 * ZAMAN PENCERESİ TASARIMI BELİRLİYOR. `ui_events` üzerindeki insert
 * politikası occurred_at'i `now() - 5 dakika` ile `now() + 1 dakika` arasına
 * kilitliyor (geçmişe sahte sayı yazılmasın diye). Bu yüzden:
 *
 *   1. occurred_at'i BİZ GÖNDERMİYORUZ — veritabanının `now()` varsayılanı
 *      kullanılıyor, yani kontrol her zaman geçer.
 *   2. Tampon süresi kısa tutuluyor. Özet gün bazında toplandığı için
 *      tıklama ile yazma arasındaki saniyeler zaten önemsiz; önemli olan
 *      olayın kaybolmaması.
 *
 * ONAY KAPISI. Bu bir analitik ölçüm ve Çerez Politikası sayfası "analitik
 * yalnızca onayınızla çalışır" diyor. Onay verilmemişse hiçbir şey
 * gönderilmez — o sözü teknik olarak tutmayan bir ölçüm, sayfayı yanlış
 * beyana çevirir.
 */

const FLUSH_MS = 5_000
const BUFFER_LIMIT = 20

/** name kolonu 60, path 200 karakterle sınırlı; kırpma burada yapılıyor. */
const NAME_MAX = 60
const PATH_MAX = 200

type QueuedEvent = { name: string; path: string }

let buffer: Array<QueuedEvent> = []
let timer: ReturnType<typeof setTimeout> | null = null
let listenersBound = false

function canTrack() {
  return (
    typeof window !== 'undefined' &&
    Boolean(SUPABASE_REST_URL) &&
    readConsent() === 'accepted'
  )
}

/**
 * Tamponu boşaltır.
 *
 * keepalive: sekme kapanırken bile isteğin tamamlanmasını sağlar. sendBeacon
 * da bunu yapardı ama başlık geçirmeye izin vermiyor ve PostgREST apikey
 * başlığı istiyor.
 *
 * Hata YUTULUYOR ve tekrar denenmiyor. Ölçüm kaybı kabul edilebilir; ölçüm
 * yüzünden konsolu kirletmek veya arayüzü bekletmek değil.
 */
function flush() {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
  if (buffer.length === 0) return

  const rows = buffer
  buffer = []

  try {
    void fetch(`${SUPABASE_REST_URL}/ui_events`, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        // Yanıt gövdesi istemiyoruz; tarayıcıya boşuna veri döndürmesin.
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(rows),
    }).catch(() => {})
  } catch {
    // yapılandırma yoksa veya fetch engellendiyse sessizce vazgeç
  }
}

function bindListeners() {
  if (listenersBound || typeof document === 'undefined') return
  listenersBound = true

  // visibilitychange, pagehide'dan güvenilir: mobil tarayıcılar sekmeyi
  // arka plana alırken pagehide'ı her zaman tetiklemiyor.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush()
  })
  window.addEventListener('pagehide', flush)
}

/**
 * Bir olayı kuyruğa alır.
 *
 * @param name  Kısa, sabit bir ad ("add_to_cart"). Panel bu ada göre grupluyor,
 *              yani sonradan değiştirmek geçmişi ikiye böler.
 * @param path  Olayın geçtiği yol. Verilmezse o anki adres kullanılır —
 *              aynı düğmenin hangi sayfada tıklandığını ayırt etmeyi sağlar.
 */
export function trackEvent(name: string, path?: string) {
  if (!canTrack()) return

  bindListeners()

  buffer.push({
    name: name.trim().slice(0, NAME_MAX),
    path: (path ?? window.location.pathname).slice(0, PATH_MAX),
  })

  if (buffer.length >= BUFFER_LIMIT) {
    flush()
    return
  }

  if (timer === null) timer = setTimeout(flush, FLUSH_MS)
}

/** Panelin 404 monitörünü besleyen olay. Adı şemayla sabit: "not_found". */
export function trackNotFound(path?: string) {
  trackEvent('not_found', path)
}
