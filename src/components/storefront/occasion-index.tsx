'use client'

/**
 * The occasion index — the shop's front door on the home page.
 * Six real occasions from the wardrobe; choosing one swaps the large
 * garment plate beside the list. One tap on a phone, one click on a
 * desktop, and the row is a plain link list if the script never runs.
 */
import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { DressPhoto } from './dress-photo'

export type OccasionTile = {
  occasion: string
  blurb: string
  count: number
  href: string
  hero: { slug: string; name: string; designer: string; color: string; colorHex: string; artTone: string }
}

export function OccasionIndex({ tiles }: { tiles: OccasionTile[] }) {
  const [active, setActive] = useState(0)
  const tile = tiles[Math.min(active, tiles.length - 1)]

  if (!tile) return null

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.02fr] lg:items-start lg:gap-16">
      <div className="order-2 lg:order-1">
        <ul>
          {tiles.map((entry, index) => (
            <li key={entry.occasion}>
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-pressed={index === active}
                className="group flex w-full items-baseline justify-between gap-6 py-4 text-left"
              >
                <span
                  className={
                    index === active
                      ? 'font-serif text-[clamp(1.6rem,2.4vw,2rem)] leading-none text-ink'
                      : 'font-serif text-[clamp(1.6rem,2.4vw,2rem)] leading-none text-ink-muted transition-colors group-hover:text-ink'
                  }
                >
                  {entry.occasion}
                </span>
                <span className="tnum shrink-0 text-[13px] text-ink-muted">
                  {entry.count} {entry.count === 1 ? 'piece' : 'pieces'}
                </span>
              </button>
              {index === active ? <p className="max-w-md pb-4 text-[16px] leading-relaxed text-ink">{entry.blurb}</p> : null}
            </li>
          ))}
        </ul>

        <Link href={tile.href} className="text-link mt-7 text-ink">
          See the {tile.occasion.toLowerCase()} dresses
          <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>

      <div className="order-1 lg:order-2">
        <Link href={tile.href} className="group block" aria-label={`See the ${tile.occasion} dresses`}>
          <DressPhoto
            slug={tile.hero.slug}
            name={tile.hero.name}
            artTone={tile.hero.artTone}
            focus="38%"
            className="aspect-[4/5] w-full"
          />
        </Link>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <p className="font-serif text-[16px] text-ink">{tile.hero.name}</p>
          <p className="text-[13px] text-ink-muted">{tile.hero.designer}</p>
        </div>
      </div>
    </div>
  )
}
