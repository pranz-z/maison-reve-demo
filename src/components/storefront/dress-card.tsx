/**
 * A dress in a grid — shop, home rails, favorites. One card, one image
 * component, one price language ("Rent ₱10,360 · retail ₱81,200").
 */
import Link from 'next/link'
import { formatMoney } from '@/lib/money'
import type { CatalogDress } from '@/lib/storefront/catalog'
import { Chip } from '@/components/ui/chip'
import { DressPhoto } from './dress-photo'
import { WishlistHeart } from './wishlist-heart'

export function DressCard({
  dress,
  saved = false,
  signedIn = false,
  eventDate,
  available,
  sizesLeft,
  className,
}: {
  dress: CatalogDress
  saved?: boolean
  signedIn?: boolean
  /** ISO day the visitor is shopping for, when chosen. */
  eventDate?: string | null
  available?: { available: boolean; availableSizes: string[] }
  sizesLeft?: string[]
  className?: string
}) {
  const sizesToShow = available?.availableSizes ?? sizesLeft ?? dress.sizes

  return (
    <div className={className}>
      <div className="relative overflow-hidden">
        <Link
          href={`/dress/${dress.slug}`}
          className="group block outline-offset-4"
          aria-label={`${dress.name} by ${dress.designer} — view details`}
        >
          <DressPhoto
            slug={dress.slug}
            name={dress.name}
            artTone={dress.artTone}
            className="aspect-[3/4] w-full"
          />
        </Link>
        <WishlistHeart dressId={dress.id} dressName={dress.name} saved={saved} signedIn={signedIn} className="absolute top-3 right-3" />
        {eventDate && available ? (
          <div className="absolute bottom-3 left-3">
            <Chip tone="sage" dot>
              Free for your date
            </Chip>
          </div>
        ) : null}
        {dress.isNewArrival && !eventDate ? (
          <div className="absolute bottom-3 left-3">
            <Chip tone="gold">New arrival</Chip>
          </div>
        ) : null}
      </div>

      <div className="mt-3.5">
        <p className="text-[14px] font-medium tracking-wide text-ink-muted">{dress.designer}</p>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <Link href={`/dress/${dress.slug}`} className="font-serif text-[18px] leading-snug text-ink transition-colors hover:text-accent">
            {dress.name}
          </Link>
          <p className="tnum shrink-0 text-[14px] text-ink">{formatMoney(dress.rentalPrice4)}</p>
        </div>
        <p className="mt-1 text-[15px] text-ink-muted">
          {sizesToShow.length > 0 ? `Sizes ${sizesToShow.join(' · ')}` : 'No sizes in rotation'}
          {eventDate && dress.reviewRating ? ` · ${dress.reviewRating.toFixed(1)}/5` : ''}
        </p>
      </div>
    </div>
  )
}
