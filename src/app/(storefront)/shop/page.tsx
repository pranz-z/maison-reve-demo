import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SlidersHorizontal } from 'lucide-react'
import { prisma } from '@/lib/db'
import { cn } from '@/lib/cn'
import { isoDay, addDays, todayUtc } from '@/lib/dates'
import { currentCustomer } from '@/lib/storefront/session'
import {
  STOREFRONT_BOOKING_HORIZON_DAYS,
  facetsFor,
  isShopSort,
  loadCatalog,
  parseEventDay,
  shopDresses,
  shopHref,
  type ShopFilters,
} from '@/lib/storefront/catalog'
import { DressCard } from '@/components/storefront/dress-card'
import { ActiveFilterChips, ShopFilters as ShopFilterPanel } from '@/components/storefront/shop-filters'
import { SortSelect } from '@/components/storefront/sort-select'

export const metadata: Metadata = {
  title: 'Shop — designer dresses to rent',
  description:
    'Browse the Maison Rêve collection: designer gowns, midis and maxis for weddings, galas and black-tie evenings. Filter by occasion, size, colour and date availability.',
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

function one(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  const trimmed = raw?.trim()
  return trimmed ? trimmed : undefined
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filters: ShopFilters = {
    occasion: one(params.occasion),
    size: one(params.size),
    color: one(params.color),
    length: one(params.length),
    price: one(params.price),
    event: one(params.event),
    sort: isShopSort(one(params.sort)) ? (one(params.sort) as ShopFilters['sort']) : 'recommended',
    page: Math.max(Number(one(params.page) ?? '1') || 1, 1),
  }

  const [catalog, customer] = await Promise.all([loadCatalog(), currentCustomer()])
  const facets = facetsFor(catalog)
  const result = shopDresses(catalog, filters)

  const savedIds = customer
    ? new Set(
        (
          await prisma.favorite.findMany({
            where: { customerId: customer.id, dressId: { in: result.dresses.map((dress) => dress.id) } },
            select: { dressId: true },
          })
        ).map((row) => row.dressId),
      )
    : new Set<string>()

  const eventDay = parseEventDay(filters.event)
  const today = todayUtc()
  const filterCount = [filters.occasion, filters.size, filters.color, filters.length, filters.price].filter(Boolean).length

  return (
    <div className="shell py-12 sm:py-16">
      <header className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16" data-reveal>
        <div>
          <h1 className="display-xl max-w-2xl text-ink">
            {filters.occasion ? `Dressed for ${filters.occasion}` : 'The whole wardrobe'}
          </h1>
          <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-ink">
            Designer dresses to rent in Manila, four or eight days at a time. Reserve your event date, wear it once, send it back — cleaning
            and returns are already in the price.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            {eventDay
              ? `Showing pieces that are free for an event on ${isoDay(eventDay)}. A four-day rental arrives the day before and returns two days after.`
              : 'Every piece below is in the studio right now. Filter by occasion, size or colour, or check a date against the live calendar.'}
          </p>
          <p className="tnum mt-6 text-[15px] text-ink-muted">
            {result.total} {result.total === 1 ? 'dress' : 'dresses'} in the collection
          </p>
          <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-ink-muted">Cards use archive gown photography for now.</p>

          <form method="GET" action="/shop" className="mt-7 flex flex-wrap items-end gap-4">
            {filters.occasion ? <input type="hidden" name="occasion" value={filters.occasion} /> : null}
            {filters.size ? <input type="hidden" name="size" value={filters.size} /> : null}
            {filters.color ? <input type="hidden" name="color" value={filters.color} /> : null}
            {filters.length ? <input type="hidden" name="length" value={filters.length} /> : null}
            {filters.price ? <input type="hidden" name="price" value={filters.price} /> : null}
            {filters.sort !== 'recommended' ? <input type="hidden" name="sort" value={filters.sort} /> : null}
            <div>
              <label htmlFor="shop-date" className="mb-1.5 block text-[15px] text-ink-muted">
                Shopping for a date?
              </label>
              <input
                id="shop-date"
                type="date"
                name="event"
                defaultValue={filters.event ?? ''}
                min={isoDay(addDays(today, 2))}
                max={isoDay(addDays(today, STOREFRONT_BOOKING_HORIZON_DAYS))}
                className="line-field w-[190px]"
              />
            </div>
            <button type="submit" className="action h-11 px-6">
              Check availability
            </button>
          </form>
        </div>

        <figure className="relative">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
            <Image
              src="/images/hero/hero-runway.webp"
              alt="A model in a strapless ivory gown in the studio's salon, under the chandelier."
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <figcaption className="mt-3 text-[13px] leading-relaxed text-ink-muted">The salon, Legazpi Street</figcaption>
        </figure>
      </header>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-6 bg-surface-muted p-5 sm:p-6" data-reveal>
        <div className="flex flex-wrap items-center gap-6">
          <p className="text-[15px] text-ink">{filters.occasion ? `For ${filters.occasion.toLowerCase()}` : 'Every piece, ready to wear'}</p>
          {eventDay ? <p className="text-[14px] text-ink-muted">Free on {isoDay(eventDay)}</p> : null}
        </div>
        <SortSelect value={filters.sort} />
      </div>

      <div className="mt-4">
        <ActiveFilterChips facets={facets} filters={filters} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[210px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ShopFilterPanel facets={facets} filters={filters} resultCount={result.total} />
          </div>
        </aside>

        <div>
          <details className="mb-6 bg-surface-muted lg:hidden">
            <summary className="flex h-12 cursor-pointer list-none items-center gap-2 px-4 text-[14px] text-ink [&::-webkit-details-marker]:hidden">
              <SlidersHorizontal className="size-4" strokeWidth={1.5} aria-hidden />
              Filters
              {filterCount > 0 ? <span className="tnum text-[13px] text-ink-muted">({filterCount})</span> : null}
            </summary>
            <div className="px-4 py-6">
              <ShopFilterPanel facets={facets} filters={filters} resultCount={result.total} />
            </div>
          </details>

          {result.dresses.length === 0 ? (
            <div className="py-20">
              <p className="font-serif text-[28px] leading-tight text-ink">Nothing matches — yet</p>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-muted">
                Try removing a filter{eventDay ? ', or a different event date' : ''}. The studio adds new pieces most weeks.
              </p>
              <Link
                href={shopHref(filters, { occasion: undefined, size: undefined, color: undefined, length: undefined, price: undefined, event: undefined, page: 1 })}
                className="action mt-6"
              >
                Show everything
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-5 gap-y-12 xl:grid-cols-3">
                {result.dresses.map((dress, index) => (
                  <div key={dress.id} data-reveal style={{ '--reveal-delay': `${(index % 3) * 60}ms` } as CSSProperties}>
                    <DressCard
                      dress={dress}
                      saved={savedIds.has(dress.id)}
                      signedIn={Boolean(customer)}
                      eventDate={filters.event ?? null}
                      available={result.availability.get(dress.id)}
                    />
                  </div>
                ))}
              </div>

              {result.pageCount > 1 ? (
                <nav aria-label="Shop pages" className="mt-16 flex items-center gap-2">
                  {Array.from({ length: result.pageCount }, (_, index) => index + 1).map((page) => (
                    <Link
                      key={page}
                      href={shopHref(filters, { page })}
                      aria-current={page === result.page ? 'page' : undefined}
                      className={cn(
                        'tnum grid size-10 place-items-center border text-[13px] transition-colors',
                        page === result.page
                          ? 'border-accent bg-accent text-accent-ink'
                          : 'border-line text-ink-muted hover:border-ink hover:text-ink',
                      )}
                    >
                      {page}
                    </Link>
                  ))}
                </nav>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* the studio, the street, the archive */}
      <section aria-label="The studio, the street and the archive" className="mt-24">
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {[
            {
              src: '/images/found/makati-avenue.jpg',
              alt: 'Ayala Avenue, Makati, looking toward the BGC skyline.',
              caption: 'Ayala Avenue, from the door.',
              position: 'object-[50%_60%]',
            },
            {
              src: '/images/found/plate-1884.jpg',
              alt: 'A De Bazar fashion plate from 1884: two women in evening gowns.',
              caption: 'De Bazar, 1884.',
              position: 'object-[50%_40%]',
            },
            {
              src: '/images/found/plate-1900.jpg',
              alt: 'A Le Chic fashion plate from 1900: a tiered polka-dot gown.',
              caption: 'Le Chic, 1900.',
              position: 'object-[50%_35%]',
            },
          ].map((picture) => (
            <figure key={picture.src}>
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
                <Image src={picture.src} alt={picture.alt} fill sizes="(max-width: 640px) 32vw, 26vw" className={`object-cover ${picture.position}`} />
              </div>
              <figcaption className="mt-2 text-[13px] leading-snug text-ink-muted">{picture.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
