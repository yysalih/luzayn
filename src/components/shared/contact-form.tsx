import { useState } from 'react'
import { AlertCircle, CheckCircle2, Send } from 'lucide-react'
import { SITE } from '#/lib/brand'
import { SUBJECT_LABELS, sendContactMessage } from '#/server/contact'
import type { ContactInput } from '#/server/contact'

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string }

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setStatus({ kind: 'sending' })
    try {
      const result = await sendContactMessage({
        data: {
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          phone: String(data.get('phone') ?? '') || undefined,
          orderRef: String(data.get('orderRef') ?? '') || undefined,
          subject: String(
            data.get('subject') ?? 'genel',
          ) as ContactInput['subject'],
          message: String(data.get('message') ?? ''),
        },
      })

      if (result.ok) {
        setStatus({ kind: 'sent' })
        form.reset()
        return
      }
      setStatus({ kind: 'error', message: result.message })
    } catch (err) {
      console.error('[iletişim formu] hata:', err)
      setStatus({
        kind: 'error',
        message: `Mesajınız gönderilemedi. Lütfen ${SITE.email} adresine doğrudan yazın.`,
      })
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-4 text-lg font-bold text-emerald-900">
          Mesajınız bize ulaştı.
        </h3>
        <p className="mt-2 text-sm text-emerald-800">
          En kısa sürede dönüş yapacağız.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: 'idle' })}
          className="mt-6 text-sm font-semibold text-emerald-700 hover:underline"
        >
          Yeni mesaj yaz
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-border bg-card p-6 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Ad Soyad" required autoComplete="name" />
        <Field
          name="email"
          label="E-posta"
          type="email"
          required
          autoComplete="email"
        />
        <Field
          name="phone"
          label="Telefon (isteğe bağlı)"
          type="tel"
          autoComplete="tel"
        />
        <Field name="orderRef" label="Sipariş referansı (varsa)" />
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-muted-foreground">Konu</span>
        <select
          name="subject"
          defaultValue="genel"
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
        >
          {Object.entries(SUBJECT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-muted-foreground">Mesaj</span>
        <textarea
          name="message"
          rows={6}
          required
          minLength={10}
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent"
          placeholder="Sorunuzu veya talebinizi yazın."
        />
      </label>

      {status.kind === 'error' ? (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p className="text-sm leading-relaxed text-red-800">
            {status.message}
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status.kind === 'sending'}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-transform hover:scale-105 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status.kind === 'sending' ? 'Gönderiliyor…' : 'Mesajı Gönder'}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Gönderdiğiniz bilgiler yalnızca talebinizi yanıtlamak için işlenir.
        Ayrıntı için KVKK Aydınlatma Metni’ne bakabilirsiniz.
      </p>
    </form>
  )
}

function Field({
  name,
  label,
  ...rest
}: {
  name: string
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        name={name}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent"
        {...rest}
      />
    </label>
  )
}
