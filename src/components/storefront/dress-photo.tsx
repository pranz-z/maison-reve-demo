/**
 * Placeholder product photography for the dress lists.
 *
 * The wardrobe has no real campaign shoot yet, so the cards borrow clearly
 * archival gown photographs (Rijksmuseum, CC0 — see public/images/found/CREDITS.md)
 * instead of pretending to show the actual garment. The pick is deterministic
 * per slug and follows the dress's tone, so a noir dress never lands on an
 * ivory plate. Swap this component's internals once the studio shoot lands.
 */
import Image from 'next/image'
import { cn } from '@/lib/cn'

type Plate = { key: string; src: string }

const PLATES: Record<string, Plate> = {
  champagne: { key: 'champagne', src: '/images/placeholders/gown-champagne.jpg' },
  ivory: { key: 'ivory', src: '/images/placeholders/gown-ivory.jpg' },
  gold: { key: 'gold', src: '/images/placeholders/gown-gold.jpg' },
  blue: { key: 'blue', src: '/images/placeholders/gown-blue.jpg' },
  sage: { key: 'sage', src: '/images/placeholders/gown-sage.jpg' },
  noir: { key: 'noir', src: '/images/placeholders/gown-noir.jpg' },
}

const BY_TONE: Record<string, string[]> = {
  champagne: ['champagne', 'gold'],
  gold: ['gold', 'champagne'],
  ivory: ['ivory', 'champagne'],
  pearl: ['ivory', 'blue'],
  blush: ['ivory', 'blue'],
  rose: ['blue', 'ivory'],
  organza: ['ivory', 'blue'],
  satin: ['blue', 'ivory'],
  noir: ['noir'],
  midnight: ['noir', 'sage'],
  emerald: ['sage', 'noir'],
  burgundy: ['noir', 'gold'],
  terracotta: ['gold', 'sage'],
}

function hash(value: string): number {
  let total = 0
  for (let index = 0; index < value.length; index += 1) total = (total * 31 + value.charCodeAt(index)) >>> 0
  return total
}

export function plateFor(slug: string, artTone: string): Plate {
  const choices = BY_TONE[artTone] ?? ['champagne']
  return PLATES[choices[hash(slug) % choices.length]!]!
}

export function DressPhoto({
  slug,
  name,
  artTone,
  className,
  priority = false,
  focus = '18%',
}: {
  slug: string
  name: string
  artTone: string
  className?: string
  priority?: boolean
  focus?: string
}) {
  const plate = plateFor(slug, artTone)

  return (
    <div className={cn('relative overflow-hidden bg-surface-muted', className)}>
      <Image
        src={plate.src}
        alt={`Placeholder photograph standing in for the ${name} — an archival gown from the Rijksmuseum`}
        fill
        priority={priority}
        sizes="(max-width: 640px) 46vw, (max-width: 1024px) 32vw, 300px"
        style={{ objectPosition: `50% ${focus}` }}
        className="object-cover sepia-[0.12] saturate-[0.9] transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
      />
    </div>
  )
}
