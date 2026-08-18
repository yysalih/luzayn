import type { HeroTag } from '#/data/content'

/**
 * İnce marka şeridi — hero'nun altında ayrı bir bant.
 *
 * Önce hero'nun içindeydi; 92vh'lik alanda başlık + sekiz sütun + panel ile
 * birlikte fazla katman oluyordu. Kendi bandına alınınca hero nefes aldı.
 *
 * Chip listesi iki kez render edilir, şerit CSS ile -%50 kaydırılır.
 * scrollLeft yaklaşımı, kaydırılabilir alan içeriğin yarısından kısa
 * olduğunda sona yapışıp ileri-geri titriyordu.
 */
export function TagStrip({ tags }: { tags: Array<HeroTag> }) {
  // Şerit sonsuz aksın diye liste iki kez basılıyor.
  const track = [...tags, ...tags]

  return (
    <section className="border-b border-white/[0.06] bg-[#0a0a12] py-5">
      <div
        className="group overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        }}
      >
        <div className="flex w-max gap-2.5 animate-[marquee-slide_45s_linear_infinite] group-hover:[animation-play-state:paused]">
          {track.map((tag, i) => (
            <span
              key={`${tag.label}-${i}`}
              className="shrink-0 rounded-full border px-4 py-2 text-xs font-medium text-white"
              style={{
                borderColor: `${tag.accent}59`,
                backgroundColor: `${tag.accent}14`,
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
