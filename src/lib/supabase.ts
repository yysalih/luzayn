import { createClient } from '@supabase/supabase-js'

/**
 * Supabase istemcisi — içerik yönetimi panelinin yazdığı verileri okur.
 *
 * ANON ANAHTAR BİLEREK: yetki anahtardan değil RLS politikalarından geliyor.
 * Storefront hiçbir zaman giriş yapmaz, dolayısıyla yalnızca "public reads
 * published" politikalarının açtığı satırları görür — taslak ürünler,
 * yayınlanmamış yazılar ve iletişim mesajları bu anahtarla okunamaz.
 *
 * service_role anahtarı bu projede YOK ve olmamalı: RLS'i tamamen bypass
 * eder, yani panelde yazılmış bütün politikaları etkisiz kılar.
 */

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim().replace(/\/+$/, '')
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

export const isSupabaseConfigured = Boolean(url && anonKey)

/**
 * Ham REST erişimi için kök ve anahtar.
 *
 * Olay ölçümü (src/lib/track.ts) SDK yerine düz `fetch` kullanıyor: sekme
 * kapanırken gönderim yapabilmek için `keepalive` gerekiyor ve SDK bu seçeneği
 * geçirmiyor. Bunlar zaten tarayıcı paketinin içinde olan değerler, dışa
 * vermek yeni bir şey açmıyor.
 */
export const SUPABASE_REST_URL = url ? `${url}/rest/v1` : ''
export const SUPABASE_ANON_KEY = anonKey

/**
 * Yapılandırılmamışken null döner — throw etmez.
 *
 * Sebep: site iyzico ve Resend eksikken de ayakta kalıyor ve kullanıcıya
 * nazik bir mesaj gösteriyor. Aynı davranışı burada da koruyoruz ki
 * .env'i doldurmamış bir geliştirici beyaz ekran değil, ne eksik olduğunu
 * söyleyen bir hata görsün.
 */
export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        // Storefront oturum açmaz; token yenileme ve localStorage yazma
        // işlerinin hiçbirine gerek yok.
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

export const SUPABASE_MISSING =
  'İçerik veritabanı yapılandırılmamış: VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı olmalı.'

/** Yapılandırma yoksa açıklayıcı hata fırlatır, varsa istemciyi verir. */
export function requireSupabase() {
  if (!supabase) throw new Error(SUPABASE_MISSING)
  return supabase
}
