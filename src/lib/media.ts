/**
 * BOM (﻿) ve boşluk temizliği şart: env değeri bazı kabuklardan BOM ile
 * yazılabiliyor ve o hâlde `﻿https://…` göreli yol sayılıp tüm görseller
 * 404 veriyor.
 */
const CDN_BASE = (import.meta.env.VITE_MEDIA_CDN_URL ?? '')
  .replace(/^﻿/, '')
  .trim()
  .replace(/\/+$/, '')

/**
 * Tüm görsel/video kaynakları bu fonksiyondan geçmelidir — fallback <img>'ler dahil.
 * CDN tanımlı değilse yol olduğu gibi döner (public/ altındaki yerel dosyalar için).
 */
export function mediaUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path
  return `${CDN_BASE}${path.startsWith('/') ? path : `/${path}`}`
}
