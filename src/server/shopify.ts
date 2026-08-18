import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { loadCatalog } from '#/lib/cms'

/**
 * Shopify Storefront API — ödeme devri.
 *
 * Site vitrin olarak kalır; sepet Shopify'da oluşturulur ve kullanıcı
 * Shopify'ın barındırdığı checkout'a yönlendirilir. Ödemeyi orada
 * Shopify'a bağlı iyzico alır.
 *
 * Bu yüzden sitede kart bilgisi, T.C. kimlik, adres formu YOKTUR — hepsini
 * Shopify checkout toplar. Sipariş, stok, kargo ve fatura da Shopify'da.
 *
 * Token yalnızca sunucuda kullanılır (VITE_ öneki YOK); tarayıcıya inmez.
 *
 * Headless kanalı iki tür token üretir ve İKİSİ FARKLI HEADER İSTER:
 *   - public  → X-Shopify-Storefront-Access-Token
 *   - private → Shopify-Storefront-Private-Token  (sunucu tarafı, daha yüksek limit)
 * Hangisi doldurulmuşsa o kullanılır; private varsa o tercih edilir.
 */

const API_VERSION = process.env.SHOPIFY_API_VERSION ?? '2026-07'

type ShopifyConfig = { domain: string; header: string; token: string }
type ConfigError = { configured: false; reason: string }

function getShopifyConfig(): ShopifyConfig | ConfigError {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')
    .trim()
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim()
  const publicToken = process.env.SHOPIFY_STOREFRONT_TOKEN?.trim()

  if (!domain || (!privateToken && !publicToken)) {
    return {
      configured: false,
      reason:
        'SHOPIFY_STORE_DOMAIN ve (SHOPIFY_STOREFRONT_PRIVATE_TOKEN veya SHOPIFY_STOREFRONT_TOKEN) tanımlı değil.',
    }
  }

  return privateToken
    ? {
        domain,
        header: 'Shopify-Storefront-Private-Token',
        token: privateToken,
      }
    : {
        domain,
        header: 'X-Shopify-Storefront-Access-Token',
        token: publicToken!,
      }
}

function isConfigError(v: ShopifyConfig | ConfigError): v is ConfigError {
  return (v as ConfigError).configured === false
}

const CART_CREATE = `
  mutation SepetOlustur($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        cost { totalAmount { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
`

type CartCreateResponse = {
  data?: {
    cartCreate?: {
      cart?: { id: string; checkoutUrl: string } | null
      userErrors?: Array<{ field?: Array<string>; message: string }>
    }
  }
  errors?: Array<{ message: string }>
}

/**
 * Slug listesi artık modül yüklenirken bilinmiyor: katalog veritabanından
 * geliyor. Bu yüzden z.enum yerine biçim kontrolü yapıyoruz; slug'ın GERÇEK
 * doğrulaması handler içinde, katalogla karşılaştırılarak yapılıyor.
 *
 * Kontrolün zayıfladığı anlamına gelmez: eskiden de asıl güvence
 * "slug katalogda var mı" idi, enum onu derleme anında sabitliyordu.
 */
export const checkoutInputSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z
          .string()
          .min(1)
          .max(64)
          .regex(/^[a-z0-9-]+$/, 'Geçersiz ürün.'),
        qty: z.number().int().min(1).max(20),
      }),
    )
    .min(1, 'Sepetiniz boş.')
    .max(20),
})

export type ShopifyCheckoutResponse =
  { ok: true; checkoutUrl: string } | { ok: false; message: string }

const CONTACT_FALLBACK =
  'Ödeme sayfası şu anda açılamadı. Lütfen birazdan tekrar deneyin veya bizimle iletişime geçin.'

/**
 * Sepeti Shopify'da oluşturur ve checkout adresini döndürür.
 * Varyant kimlikleri istemciden DEĞİL, sunucudaki katalogdan okunur.
 */
export const createShopifyCheckout = createServerFn({ method: 'POST' })
  .validator((data: unknown) => checkoutInputSchema.parse(data))
  .handler(async ({ data }): Promise<ShopifyCheckoutResponse> => {
    const config = getShopifyConfig()
    if (isConfigError(config)) {
      console.error('[shopify] yapılandırma eksik:', config.reason)
      return {
        ok: false,
        message:
          'Ödeme altyapısı henüz bağlanmadı. Siparişinizi almamız için bizimle iletişime geçebilirsiniz.',
      }
    }

    // Varyant kimliği İSTEMCİDEN DEĞİL, sunucudaki katalogdan okunur.
    // İstemciden gelen tek şey slug ve adet; hangi Shopify varyantının
    // hangi fiyattan sepete gireceğine sunucu karar verir.
    const catalog = await loadCatalog()

    const unknown = data.items.filter((item) => !catalog.bySlug[item.slug])
    if (unknown.length > 0) {
      console.error(
        '[shopify] katalogda olmayan slug:',
        unknown.map((i) => i.slug).join(', '),
      )
      return {
        ok: false,
        message:
          'Sepetinizdeki ürünlerden biri artık satışta değil. Sepeti yenileyip tekrar deneyin.',
      }
    }

    // Varyant kimliği boş olan ürün Shopify'da karşılığı olmayan üründür;
    // böyle bir satırla sepet kurmak Shopify tarafında anlamsız bir hataya
    // dönüşür, o yüzden burada yakalıyoruz.
    const missingVariant = data.items.filter(
      (item) => !catalog.bySlug[item.slug].shopifyVariantId,
    )
    if (missingVariant.length > 0) {
      console.error(
        '[shopify] varyant kimliği tanımsız:',
        missingVariant.map((i) => i.slug).join(', '),
      )
      return {
        ok: false,
        message:
          'Sepetinizdeki ürünlerden biri şu anda satın alınamıyor. Bizimle iletişime geçebilirsiniz.',
      }
    }

    const lines = data.items.map((item) => ({
      merchandiseId: `gid://shopify/ProductVariant/${catalog.bySlug[item.slug].shopifyVariantId}`,
      quantity: item.qty,
    }))

    try {
      const response = await fetch(
        `https://${config.domain}/api/${API_VERSION}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            [config.header]: config.token,
          },
          body: JSON.stringify({
            query: CART_CREATE,
            variables: { lines },
          }),
        },
      )

      if (!response.ok) {
        console.error(
          '[shopify] HTTP hatası:',
          response.status,
          response.statusText,
          `(header: ${config.header})`,
          response.status === 401
            ? 'Token reddedildi — yanlış token türü veya eksik kapsam.'
            : '',
        )
        return { ok: false, message: CONTACT_FALLBACK }
      }

      const result = (await response.json()) as CartCreateResponse

      if (result.errors?.length) {
        console.error('[shopify] GraphQL hatası:', result.errors)
        return { ok: false, message: CONTACT_FALLBACK }
      }

      const userErrors = result.data?.cartCreate?.userErrors ?? []
      if (userErrors.length) {
        console.error('[shopify] sepet hatası:', userErrors)
        return {
          ok: false,
          message:
            'Sepetinizdeki ürünlerden biri şu anda satın alınamıyor. Sepeti güncelleyip tekrar deneyin.',
        }
      }

      const checkoutUrl = result.data?.cartCreate?.cart?.checkoutUrl
      if (!checkoutUrl) {
        console.error('[shopify] checkoutUrl boş döndü')
        return { ok: false, message: CONTACT_FALLBACK }
      }

      return { ok: true, checkoutUrl }
    } catch (error) {
      console.error('[shopify] beklenmeyen hata:', error)
      return { ok: false, message: CONTACT_FALLBACK }
    }
  })
