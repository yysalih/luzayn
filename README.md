# luzayn.com

Luzayn takviye edici gıda serisinin e-ticaret sitesi.
TanStack Start + React 19 + Tailwind v4 + Zustand + iyzico + Resend.

Tasarım dili `WEBSITE_DESIGN_TEMPLATE.md` şablonundan (NeuroPlanck dili) türetildi:
öğe başına accent kimliği, koyu/açık bölüm nöbetleşmesi, gerçek veri + premium
sunum, auto-advance carousel'ler, dozunda glassmorphism.

## Çalıştırma

```bash
npm install
npm run dev
```

Site `http://localhost:3000` adresinde açılır.

```bash
npm run build     # üretim derlemesi (Vercel nitro preset'i otomatik)
npx tsc --noEmit  # tip kontrolü
npm run format    # prettier + eslint --fix
```

## Ortam değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyalayın.

| Değişken                                                   | Ne işe yarar                                                                           |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `VITE_MEDIA_CDN_URL`                                       | Bunny CDN kökü (`https://luzayn.b-cdn.net`). Boşsa `public/` okunur.                   |
| `PUBLIC_SITE_URL`                                          | iyzico `callbackUrl` bu origin'den üretilir.                                           |
| `IYZICO_URI`                                               | Sandbox veya canlı iyzico adresi.                                                      |
| `IYZICO_API_KEY` / `IYZICO_SECRET_KEY`                     | Ödeme anahtarları. **Boşken ödeme adımı kullanıcıya nazik bir hata gösterir, çökmez.** |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | İletişim formu e-postası. Boşken form alternatif kanal önerir.                         |

## Medya

Tüm görsel ve videolar Bunny CDN'de. Hiçbir URL hardcode edilmez; her `src`
`mediaUrl()`'den geçer (`src/lib/media.ts`). Yollar tek yerde tanımlı:
`CDN_PATHS` (`src/lib/brand.ts`).

```
/covers/<slug>.jfif           ürün kapak fotoğrafı
/images/<slug>.jfif           ikinci görsel (bölüm arka planları)
/videos/desktop/<slug>.mp4    yatay klip
/videos/mobile/<slug>.mp4     dikey klip
```

`useIsMobile()` hangi videonun oynayacağını seçer; biri yoksa diğerine düşer,
o da yoksa kapak fotoğrafı kalır.

## Tek merkezi kaynaklar

| Dosya                 | İçerik                                                                             |
| --------------------- | ---------------------------------------------------------------------------------- |
| `src/lib/brand.ts`    | 8 ürün (accent, fiyat, bileşen, beyan), `SITE`, `COMMERCE`, `BUNDLE`, sertifikalar |
| `src/data/content.ts` | Hero slaytları, video duvarı, sayılar carousel'i, felsefe, SSS, blog               |
| `src/data/legal.ts`   | 7 yasal sayfa metni                                                                |
| `src/store/cart.ts`   | Sepet (zustand + localStorage), `resolveCart()` fiyat matematiği                   |

**Renk hiçbir bileşende hardcode edilmez.** Ürünün accent'i `brand.ts`'ten gelir
ve kart kenarlığı, rozet, halka, glow, buton — hepsinde aynı hex kullanılır.
Yoğunluk kademeleri alfa-suffix ile alınır: `${accent}30`, `${accent}1f`.

## İddia politikası (koda gömülü)

Sağlık beyanı yalnızca mevzuatça yetkilendirilmiş besin ögelerine (vitamin,
mineral, EPA/DHA) atfen kurulur. Her ürünün `claimBasis` alanı hangi besin
ögelerinin beyan taşıdığını listeler; boşsa ürün sayfası bunu açıkça yazar.

Bitkisel bileşenler (reishi, kordiseps, safran, rodiola, valerian, karahindiba)
yalnızca **bileşim** olarak tanımlanır — onlara fayda atfedilmez.

`CLAIM_DISCLAIMER` her beyan bloğunun altına konur.

Sayılar carousel'indeki her rakam ya ürün sayfasından okunur ya da o veriden
hesaplanır (örn. 1000 mg C vitamini ÷ 80 mg referans değer = %1250).

## Ödeme akışı

1. `/sepet` → `/odeme` formu
2. `startCheckout` server fn — **fiyat daima sunucudaki katalogdan okunur**,
   istemciden gelen tutara güvenilmez
3. iyzico checkout form initialize → `paymentPageUrl`'e yönlendirme
4. iyzico `POST /api/odeme/callback` → `token` retrieve ile **sunucuda** doğrulanır
5. `/odeme/sonuc?durum=basarili&referans=…` → sepet temizlenir

## Ürün verisinin kaynağı

Ürün adları, kategoriler, fiyatlar, içerik bilgisi tabloları (porsiyon başına
miktarlar), ürün özellikleri, kullanım ve saklama bilgileri **luzayn.com ürün
sayfalarından birebir** alındı:

| Slug        | Ürün                        | Kategori            | Fiyat  | Porsiyon         |
| ----------- | --------------------------- | ------------------- | ------ | ---------------- |
| `d3k2`      | Vitamin D3K2                | Vitaminler          | ₺390   | 1 damla          |
| `coenzym`   | Coenzym Q10                 | Koenzim Q10         | ₺560   | 1 yumuşak kapsül |
| `vitaminc`  | Vitamin C Pure Way          | Vitaminler          | ₺760   | 2 kapsül         |
| `magnesium` | Magnesium                   | Mineraller          | ₺860   | 2 kapsül         |
| `omega3`    | Omega 3                     | Omega-3             | ₺899   | 1 yumuşak kapsül |
| `reishi`    | Reishi Mushroom & Echinacea | Bitkisel Takviyeler | ₺2.400 | 2 kapsül         |
| `ro`        | RO                          | Bitkisel Takviyeler | ₺2.800 | 2 kapsül         |
| `xsls`      | XSLS                        | Bitkisel Takviyeler | ₺6.500 | 2 kapsül         |

`%BRD` sütunu yalnızca etikette verilmişse gösterilir (şu an sadece Reishi'de
C vitamini için %62,5) — hesaplanıp uydurulmaz.

## Doldurulmayı bekleyenler

Bu alanlar bilinçli olarak `(Belirtilecek)` bırakıldı; uydurulmadı.

- [ ] `SITE.phone`, `SITE.whatsapp` — WhatsApp numarası girilene kadar yüzen
      buton iletişim sayfasına gider (kırık `wa.me` linki üretilmez).
- [ ] `SITE.mersis`, `taxOffice`, `taxNumber`
- [ ] `SITE.businessRegNo`, `supplementApprovalNo` — ambalaj render'ında
      bulanık okunuyor; teyit edilmeli.
- [ ] `SITE.social.*`
- [ ] **`COMMERCE.freeShippingThreshold` / `shippingFee`** — ticari karardır,
      doğrulanmadı. Şu an 1.000 TL üzeri ücretsiz, altında 89 TL.
- [ ] `BUNDLE.discountRate` — 0 olduğu sürece indirim/üstü çizili fiyat
      gösterilmez (uydurma çapa fiyat kurulmaz).

## Bilinen tuzaklar (şablondan, hepsi uygulandı)

| Tuzak                                       | Çözüm                                                                              |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| Safari'de marquee kaymıyor                  | `overflow-hidden` değil `overflow-x-auto` + `.no-scrollbar`                        |
| Accordion açılınca komşusu uzuyor           | Grid konteynerlerde `items-start`                                                  |
| Fallback `<img>` mobilde 404                | Her `src` `mediaUrl()`'den geçer                                                   |
| Zustand persist + SSR hydration uyuşmazlığı | `skipHydration` + `useCartHydrated()`                                              |
| Kart üstü tam-alan link butonları yutuyor   | Overlay link `z-10`, içerik `pointer-events-none` + butonlar `pointer-events-auto` |
