import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { FaqItem } from '#/data/content'
import { cn } from '#/lib/utils'

export function FaqAccordion({
  items,
  dark = false,
}: {
  items: Array<FaqItem>
  dark?: boolean
}) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    // Grid içinde kullanılırsa konteynere items-start gerekir; burada tek
    // kolonlu liste olduğu için satır komşusu uzama sorunu oluşmaz.
    <div
      className={cn(
        'divide-y rounded-3xl border',
        dark
          ? 'divide-white/10 border-white/10 bg-white/[0.04] backdrop-blur-md'
          : 'divide-border border-border bg-card',
      )}
    >
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={cn(
                'flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors md:px-8',
                dark ? 'hover:bg-white/[0.03]' : 'hover:bg-muted/60',
              )}
            >
              <span
                className={cn(
                  'text-base font-semibold',
                  dark ? 'text-white' : 'text-foreground',
                )}
              >
                {item.question}
              </span>
              <Plus
                className={cn(
                  'mt-0.5 h-5 w-5 shrink-0 transition-transform duration-300',
                  isOpen && 'rotate-45',
                  dark ? 'text-white/40' : 'text-muted-foreground',
                )}
              />
            </button>

            {isOpen ? (
              <p
                className={cn(
                  'animate-[showcase-fade-in_0.25s_ease-out] px-6 pb-6 text-sm leading-relaxed md:px-8',
                  dark ? 'text-white/60' : 'text-muted-foreground',
                )}
              >
                {item.answer}
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
