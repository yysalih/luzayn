import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { SITE } from '#/lib/brand'
import { recordContactMessage } from '#/lib/cms'

/**
 * İletişim formu → kendi SMTP sunucunuz (DirectAdmin / cPanel).
 *
 * Üçüncü taraf bir e-posta servisi yerine doğrudan alan adınızın posta
 * sunucusu kullanılıyor. Site kendi sunucunuzda barındırılıyorsa SMTP_HOST
 * olarak 'localhost' vermek en hızlısıdır — posta aynı makinede.
 *
 * Gönderen HER ZAMAN kendi alan adınızdaki bir kutu olmalı (örn.
 * noreply@luzayn.com). Ziyaretçinin adresini From'a koymak SPF/DKIM'i
 * bozar ve postayı spam'e düşürür; ziyaretçi adresi Reply-To'ya konur.
 */

export const contactInputSchema = z.object({
  name: z.string().trim().min(2, 'Adınızı girin.'),
  email: z.string().trim().email('Geçerli bir e-posta girin.'),
  phone: z.string().trim().max(20).optional(),
  orderRef: z.string().trim().max(40).optional(),
  subject: z.enum(['genel', 'siparis', 'urun', 'toptan', 'kvkk']),
  message: z
    .string()
    .trim()
    .min(10, 'Mesajınızı biraz açar mısınız?')
    .max(4000),
})

export type ContactInput = z.infer<typeof contactInputSchema>
export type ContactResponse = { ok: true } | { ok: false; message: string }

export const SUBJECT_LABELS: Record<ContactInput['subject'], string> = {
  genel: 'Genel Soru',
  siparis: 'Sipariş / Kargo',
  urun: 'Ürün ve İçerik Sorusu',
  toptan: 'Toptan / İş Birliği',
  kvkk: 'KVKK / Veri Talebi',
}

const FALLBACK = `Mesajınız gönderilemedi. Lütfen doğrudan ${SITE.email} adresine yazın.`

type SmtpConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
  to: string
}

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS
  const to = process.env.CONTACT_TO_EMAIL?.trim() || SITE.email
  if (!host || !user || !pass) return null

  // 465 → doğrudan TLS (implicit), 587 → STARTTLS ile yükseltme
  const port = Number(process.env.SMTP_PORT ?? 465)
  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from: process.env.SMTP_FROM?.trim() || `${SITE.name} <${user}>`,
    to,
  }
}

/** HTML e-postada kullanıcı metnini gömerken kaçış şart */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export const sendContactMessage = createServerFn({ method: 'POST' })
  .validator((data: unknown) => contactInputSchema.parse(data))
  .handler(async ({ data }): Promise<ContactResponse> => {
    /**
     * ÖNCE gelen kutusuna yaz, SONRA e-posta gönder.
     *
     * Sıra bilinçli: e-posta gidemezse (SMTP eksik, kota dolu, spam
     * klasörü) mesaj yine de panelde durur. Tersi sırada, gönderim
     * başarısız olduğunda mesaj hiçbir yerde kalmazdı — bugünkü davranış
     * buydu.
     *
     * Yazma hatası kullanıcıya YANSITILMAZ: e-posta gitmiş olabilir ve
     * "mesajınız gönderilemedi" demek yanlış olurdu. Sunucu günlüğüne
     * düşürüp devam ediyoruz.
     */
    const recorded = await recordContactMessage({
      name: data.name,
      email: data.email,
      phone: data.phone,
      orderRef: data.orderRef,
      subject: data.subject,
      message: data.message,
    })
    if (!recorded.ok)
      console.error('[iletişim] mesaj panele yazılamadı:', recorded.error)

    const config = getSmtpConfig()

    if (!config) {
      console.error(
        '[iletişim] SMTP_HOST / SMTP_USER / SMTP_PASS eksik. Gelen mesaj:',
        { ...data, message: `${data.message.slice(0, 200)}…` },
      )
      // Mesaj panele yazıldıysa gerçekten kaybolmadı; kullanıcıya
      // "gönderilemedi" demek yanlış olur.
      if (recorded.ok) return { ok: true }

      return {
        ok: false,
        message: `E-posta gönderimi henüz yapılandırılmamış. Mesajınızı doğrudan ${SITE.email} adresine iletebilirsiniz.`,
      }
    }

    const konu = SUBJECT_LABELS[data.subject]
    const satirlar = [
      ['Ad Soyad', data.name],
      ['E-posta', data.email],
      ['Telefon', data.phone],
      ['Sipariş Referansı', data.orderRef],
      ['Konu', konu],
    ].filter((row): row is [string, string] => Boolean(row[1]))

    const text = [
      ...satirlar.map(([k, v]) => `${k}: ${v}`),
      '',
      data.message,
    ].join('\n')

    const html = [
      '<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">',
      '<table cellpadding="6" style="border-collapse:collapse">',
      ...satirlar.map(
        ([k, v]) =>
          `<tr><td style="color:#666">${escapeHtml(k)}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`,
      ),
      '</table>',
      `<p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(data.message)}</p>`,
      '</div>',
    ].join('')

    try {
      const nodemailer = await import('nodemailer')
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user: config.user, pass: config.pass },
        // Serverless'ta asılı kalmasın
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      })

      await transporter.sendMail({
        from: config.from,
        to: config.to,
        replyTo: `${data.name} <${data.email}>`,
        subject: `[Web Sitesi İletişim Formu] ${konu} — ${data.name}`,
        text,
        html,
      })

      return { ok: true }
    } catch (err) {
      console.error('[iletişim] SMTP hatası:', err)
      return { ok: false, message: FALLBACK }
    }
  })
