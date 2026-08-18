/**
 * Ana sayfa ve blog içeriğinin TİPLERİ.
 *
 * Verinin kendisi artık burada değil: hero slaytları, etiket şeridi, video
 * duvarı, sayılar, felsefe, SSS ve blog yazıları yönetim panelinden
 * yönetiliyor ve `src/lib/cms.ts` üzerinden okunuyor.
 *
 * Tipler burada kaldı çünkü sitenin bileşenleri bu şekilleri bekliyor ve
 * cms.ts veritabanı satırlarını bunlara çeviriyor. Eski statik değerler
 * yönetim paneli deposundaki supabase/seed.sql dosyasına aktarıldı — orası
 * artık bu içeriğin ilk halinin kaynağı.
 */

export type HeroSlide = {
  id: string
  title: string
  description: string
  accent: string
  videoDesktop: string
  videoMobile: string
  poster: string
  ctaLabel: string
}

export type HeroTag = { label: string; accent: string }

export type EvidenceStat = {
  slug: string
  /** Halka dolumu 0-100. Oran anlamlı değilse null — kart büyük rakam gösterir. */
  ring: number | null
  value: string
  unit?: string
  title: string
  context: string
}

export type PhilosophyValue = { title: string; detail: string }

export type Philosophy = {
  kicker: string
  title: string
  intro: string
  values: Array<PhilosophyValue>
}

export type FaqItem = { question: string; answer: string }

export type BlogSection = { heading: string; body: Array<string> }

export type BlogPost = {
  slug: string
  category: string
  categoryAccent: string
  title: string
  excerpt: string
  date: string
  readingMinutes: number
  cover: string
  sections: Array<BlogSection>
}

export function formatBlogDate(iso: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}
