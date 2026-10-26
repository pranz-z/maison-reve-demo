/**
 * The home hero — one photograph, one sentence, one action, and the date
 * search within the first screen so the promise ("reserved for your date")
 * is a tool, not a claim.
 *
 * The photograph is pushed toward the figure at a crawl and the words rise
 * once. Everything yields to prefers-reduced-motion.
 */
import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DateSearch } from '@/components/storefront/date-search'

/* The photograph and a 16px blur of it (so the scene never flashes empty). */
const HERO_PHOTO = {
  src: '/images/hero/hero-runway.webp',
  blurDataURL:
    'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAQCdASoQAAwABIB0JbACdACw2z4bJAD+7NDHFXppBI6QPIfADJlsCTC//So/ktcVqcmjb/BE+HLkUMi/0LrnavBo6+BmdOAhD9YZCRUAadKNts8eg4XEgAA=',
}

const HERO = {
  headline: ['One night,', 'one dress.'],
  lede: 'Designer dress rental in Manila. Reserve the gown for your date — pressed, delivered and collected, returns already paid for.',
  primary: { label: 'Find your dress', href: '#find-your-date' },
  secondary: { label: 'How renting works', href: '/how-it-works' },
  footnote: '418 Legazpi Street, Legazpi Village, Makati · delivery, cleaning and returns included',
}

export type HeroStats = {
  fromPrice: string
  gowns: number
  rating: number | null
  reviews: number
}

export function HomeHero({ occasions, sizes, stats }: { occasions: string[]; sizes: string[]; stats: HeroStats }) {
  const trust = [
    `From ${stats.fromPrice} a rental`,
    `${stats.gowns} gowns in rotation`,
    stats.rating ? `${stats.rating.toFixed(1)} from ${stats.reviews} verified rentals` : null,
  ].filter(Boolean) as string[]

  return (
    <section aria-labelledby="hero-heading" className="bg-page">
      <div className="relative isolate min-h-[70svh] overflow-hidden bg-charcoal sm:min-h-[72svh]">
        <Image
          src={HERO_PHOTO.src}
          alt=""
          aria-hidden
          fill
          preload
          sizes="100vw"
          quality={80}
          placeholder="blur"
          blurDataURL={HERO_PHOTO.blurDataURL}
          className="hero-photo object-cover object-[52%_38%] sm:object-[50%_30%]"
        />
        <div aria-hidden className="hero-scrim absolute inset-0" />

        <div className="shell relative z-10 flex min-h-[70svh] flex-col justify-end pt-24 pb-10 sm:min-h-[72svh] sm:pb-12">
          <div className="max-w-[44rem] text-ivory">
            <h1 id="hero-heading" className="display-xl hero-rise text-ivory" style={{ '--rise-delay': '80ms' } as CSSProperties}>
              {HERO.headline[0]}
              <br />
              {HERO.headline[1]}
            </h1>
            <p
              className="hero-rise mt-5 max-w-[33rem] text-[18px] leading-relaxed text-ivory"
              style={{ '--rise-delay': '200ms' } as CSSProperties}
            >
              {HERO.lede}
            </p>
            <div className="hero-rise mt-7 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8" style={{ '--rise-delay': '320ms' } as CSSProperties}>
              <a href={HERO.primary.href} className="action action--ivory">
                {HERO.primary.label}
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
              </a>
              <Link href={HERO.secondary.href} className="text-link text-ivory">
                {HERO.secondary.label}
              </Link>
            </div>
            <p className="hero-rise mt-6 text-[14px] text-ivory/90" style={{ '--rise-delay': '380ms' } as CSSProperties}>
              {trust.join(' · ')}
            </p>
          </div>
          <p className="mt-10 text-[14px] text-ivory/80">{HERO.footnote}</p>
        </div>
      </div>

      {/* the date-first search, on paper, inside the first screen */}
      <div id="find-your-date" className="scroll-mt-24 bg-surface-muted">
        <div className="shell py-6">
          <DateSearch occasions={occasions} sizes={sizes} />
        </div>
      </div>
    </section>
  )
}
