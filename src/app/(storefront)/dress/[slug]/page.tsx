import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BadgeCheck, RefreshCcw, Sparkles, Star, Truck } from 'lucide-react'
import { prisma } from '@/lib/db'
import { addDays, isoDay, todayUtc } from '@/lib/dates'
import { formatMoney } from '@/lib/money'
import { depositFor, rentalPriceFor } from '@/lib/pricing'
import { currentCustomer } from '@/lib/storefront/session'
import { STOREFRONT_BOOKING_HORIZON_DAYS, busyDays, loadStorefrontOccupancies } from '@/lib/storefront/availability'
import type { CatalogDress } from '@/lib/storefront/catalog'
import { DressGallery } from '@/components/storefront/dress-gallery'
import { DressCard } from '@/components/storefront/dress-card'
import { InquiryForm } from '@/components/storefront/inquiry-form'
import { PurchasePanel } from '@/components/storefront/purchase-panel'
import { SaveToList } from '@/components/storefront/save-to-list'
import { Chip } from '@/components/ui/chip'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const [dress, settings] = await Promise.all([
    prisma.dress.findUnique({
      where: { slug },
      select: { name: true, designer: true, story: true, retailValue: true, status: true },
    }),
    prisma.studioSettings.findUniqueOrThrow({ where: { id: 'studio' } }),
  ])
  if (!dress || dress.status === 'RETIRED') return { title: 'Dress not found' }
  return {
    title: `${dress.name} — rent for ${formatMoney(rentalPriceFor(dress.retailValue, 4, settings))}`,
    description: `${dress.story.slice(0, 150)} Rent the ${dress.name} by ${dress.designer} from Maison Rêve, delivered pressed with free returns and cleaning.`,
  }
}

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={className} role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          aria-hidden
          className={step <= Math.round(rating) ? 'inline size-4 fill-gold text-gold' : 'inline size-4 text-line-strong'}
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}

export default async function DressPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const dress = await prisma.dress.findUnique({
    where: { slug },
    include: {
      sizes: { orderBy: { position: 'asc' } },
      images: { orderBy: { position: 'asc' } },
      reviews: { orderBy: { createdAt: 'desc' } },
      _count: { select: { reviews: true } },
    },
  })
  if (!dress || dress.status === 'RETIRED') notFound()

  const [settings, customer] = await Promise.all([
    prisma.studioSettings.findUniqueOrThrow({ where: { id: 'studio' } }),
    currentCustomer(),
  ])

  const [occupanciesByDress, accessories, related, savedIds, measurements, lists] = await Promise.all([
    loadStorefrontOccupancies(prisma, [dress.id], settings.prepDays, settings.bufferDays),
    prisma.accessory.findMany({
      where: { active: true, OR: [{ dressId: dress.id }, { dressId: null }] },
      orderBy: { price: 'asc' },
    }),
    prisma.dress.findMany({
      where: { occasion: dress.occasion, id: { not: dress.id }, status: { not: 'RETIRED' } },
      include: { sizes: { orderBy: { position: 'asc' } }, reviews: { select: { rating: true } }, _count: { select: { reviews: true } } },
      orderBy: { timesRented: 'desc' },
      take: 4,
    }),
    customer
      ? prisma.favorite
          .findMany({ where: { customerId: customer.id }, select: { dressId: true } })
          .then((rows) => new Set(rows.map((row) => row.dressId)))
      : Promise.resolve(new Set<string>()),
    customer ? prisma.measurement.findUnique({ where: { customerId: customer.id } }) : Promise.resolve(null),
    customer
      ? prisma.eventList.findMany({ where: { customerId: customer.id }, select: { id: true, name: true }, orderBy: { createdAt: 'desc' } })
      : Promise.resolve([]),
  ])

  const occupancies = occupanciesByDress.get(dress.id) ?? []
  const price4 = rentalPriceFor(dress.retailValue, 4, settings)
  const price8 = rentalPriceFor(dress.retailValue, 8, settings)
  const deposit = depositFor(dress.retailValue, settings)
  const today = todayUtc()
  const minDay = isoDay(addDays(today, 2))
  const maxDay = isoDay(addDays(today, STOREFRONT_BOOKING_HORIZON_DAYS))
  const minIso = isoDay(today)
  const maxIso = isoDay(addDays(today, STOREFRONT_BOOKING_HORIZON_DAYS + 8))

  const busyBySize: Record<string, string[]> = {}
  for (const size of dress.sizes) {
    busyBySize[size.size] = [...busyDays(occupancies, size.size)].filter((iso) => iso >= minIso && iso <= maxIso)
  }

  const backupAccessory = accessories.find((accessory) => accessory.name === 'Backup size')
  const backupFee = backupAccessory?.price ?? 2500
  const addOnAccessories = accessories.filter((accessory) => accessory.name !== 'Backup size')

  const reviewCount = dress._count.reviews
  const rating = reviewCount > 0 ? dress.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : null
  const defaultSize = measurements?.dressSizeLabel ?? null

  const relatedDresses: CatalogDress[] = related.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    designer: row.designer,
    category: row.category,
    occasion: row.occasion,
    color: row.color,
    colorHex: row.colorHex,
    length: row.length,
    neckline: row.neckline,
    sleeve: row.sleeve,
    fabric: row.fabric,
    retailValue: row.retailValue,
    rentalPrice4: rentalPriceFor(row.retailValue, 4, settings),
    rentalPrice8: rentalPriceFor(row.retailValue, 8, settings),
    featured: row.featured,
    isNewArrival: row.isNewArrival,
    timesRented: row.timesRented,
    artTone: row.artTone,
    sizes: row.sizes.map((size) => size.size),
    reviewCount: row._count.reviews,
    reviewRating:
      row.reviews.length > 0 ? Math.round((row.reviews.reduce((sum, review) => sum + review.rating, 0) / row.reviews.length) * 10) / 10 : null,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: dress.name,
    description: dress.story,
    brand: { '@type': 'Brand', name: dress.designer },
    color: dress.color,
    material: dress.fabric,
    category: dress.category,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: (price4 / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dress/${dress.slug}`,
    },
    ...(rating && reviewCount > 0
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.toFixed(1), reviewCount } }
      : {}),
  }

  return (
    <div className="shell py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-[13px] text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-line-strong">
            /
          </li>
          <li>
            <Link href="/shop" className="hover:text-accent">
              Shop
            </Link>
          </li>
          <li aria-hidden className="text-line-strong">
            /
          </li>
          <li aria-current="page" className="text-ink">
            {dress.name}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <DressGallery slug={dress.slug} name={dress.name} artTone={dress.artTone} />
        </div>

        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <h1 className="font-serif text-[clamp(2.1rem,3.6vw,3.1rem)] leading-[1.02] tracking-[-0.02em] text-ink">{dress.name}</h1>
          <p className="mt-3 text-[18px] leading-snug text-ink-muted">
            Designer gown rental · {dress.occasion.toLowerCase()} · {dress.color.toLowerCase()}
          </p>

          <p className="mt-5 font-serif text-[26px] leading-none text-ink">
            {formatMoney(price4)}
            <span className="ml-2 font-sans text-[15px] text-ink-muted">
              four days · eight days {formatMoney(price8)} · retail {formatMoney(dress.retailValue)}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[14px] text-ink-muted">
            {rating ? (
              <span className="flex items-center gap-2">
                <Stars rating={rating} />
                <span>
                  {rating.toFixed(1)} from {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </span>
            ) : (
              <span>New to the wardrobe</span>
            )}
          </div>

          <p className="mt-6 text-[16px] leading-relaxed text-ink">{dress.story}</p>

          <div className="mt-8">
            <PurchasePanel
              dressId={dress.id}
              dressName={dress.name}
              sizes={dress.sizes.map((size) => size.size)}
              price4={price4}
              price8={price8}
              deposit={deposit}
              backupFee={backupFee}
              busyBySize={busyBySize}
              minDay={minDay}
              maxDay={maxDay}
              defaultSize={defaultSize}
            />
          </div>

          {customer ? (
            <div className="mt-6">
              <SaveToList
                dressId={dress.id}
                dressName={dress.name}
                sizes={dress.sizes.map((size) => size.size)}
                lists={lists}
                defaultSize={defaultSize}
              />
            </div>
          ) : null}

          <ul className="mt-8 grid gap-3 text-[13px] text-ink-muted sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <Truck className="size-4 text-ink" strokeWidth={1.5} aria-hidden /> Free two-way shipping, insured
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="size-4 text-ink" strokeWidth={1.5} aria-hidden /> Cleaned and pressed before it arrives
            </li>
            <li className="flex items-center gap-2">
              <RefreshCcw className="size-4 text-ink" strokeWidth={1.5} aria-hidden /> Free exchanges while it ships
            </li>
            <li className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-ink" strokeWidth={1.5} aria-hidden /> Fit advice from a stylist
            </li>
          </ul>

          <details className="group mt-6">
            <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[14px] text-ink [&::-webkit-details-marker]:hidden">
              Ask about this dress
              <span className="text-ink-muted transition-transform group-open:rotate-45" aria-hidden>
                ＋
              </span>
            </summary>
            <div className="pb-4">
              <InquiryForm
                channel="DRESS_PAGE"
                subject={`About the ${dress.name}`}
                topicDefault="SIZING"
                defaultName={customer?.name ?? ''}
                defaultEmail={customer?.email ?? ''}
                context={`${dress.designer} · ${dress.name}`}
                replyTargetHours={settings.replyTargetHours}
              />
            </div>
          </details>
        </div>
      </div>

      {/* fit and care */}
      <section aria-labelledby="fit-care" className="mt-20 grid gap-10 md:grid-cols-2 md:gap-16" data-reveal>
        <h2 id="fit-care" className="sr-only">
          Fit and care
        </h2>
        <div>
          <h3 className="font-serif text-[24px] leading-tight text-ink">Fit notes from the studio</h3>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">{dress.fitNotes}</p>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
            {dress.neckline} neckline, {dress.sleeve.toLowerCase()} — cut in {dress.fabric.toLowerCase()}.{' '}
            <Link href="/size-guide" className="text-ink underline decoration-line-strong underline-offset-4 hover:text-accent">
              See how to measure
            </Link>
            .
          </p>
        </div>
        <div>
          <h3 className="font-serif text-[24px] leading-tight text-ink">Care and wear</h3>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">{dress.careNotes}</p>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
            Cleaning is on us. If a hem catches or a bead slips, tell the studio — small repairs are part of the rental, not a charge.
          </p>
        </div>
      </section>

      {/* the studio it comes from */}
      <section aria-label="The studio it comes from" className="mt-20" data-reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
          {[
            {
              src: '/images/found/makati-avenue.jpg',
              alt: 'Ayala Avenue, Makati, looking toward the BGC skyline.',
              caption: 'The street, from the door.',
              position: 'object-[50%_60%]',
            },
            {
              src: '/images/hero/hero-runway.webp',
              alt: 'A model in a strapless ivory gown under the chandelier in the salon.',
              caption: 'The salon, third floor.',
              position: 'object-[50%_28%]',
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
                <Image src={picture.src} alt={picture.alt} fill sizes="(max-width: 640px) 45vw, 22vw" className={`object-cover ${picture.position}`} />
              </div>
              <figcaption className="mt-2 text-[13px] leading-snug text-ink-muted">{picture.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* reviews */}
      <section aria-labelledby="reviews" className="mt-20">
        <div className="heading-row">
          <h2 id="reviews" className="display-md text-ink">
            {reviewCount > 0 ? `Notes from ${reviewCount} ${reviewCount === 1 ? 'customer' : 'customers'}` : 'Be the first to wear it'}
          </h2>
          {rating ? (
            <p className="flex items-center gap-2 text-[13px] text-ink-muted">
              <Stars rating={rating} /> {rating.toFixed(1)} average
            </p>
          ) : null}
        </div>

        {reviewCount > 0 ? (
          <div className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {dress.reviews.slice(0, 9).map((review, index) => (
              <article key={review.id} data-reveal style={{ '--reveal-delay': `${(index % 3) * 70}ms` } as CSSProperties}>
                <Stars rating={review.rating} />
                <h3 className="mt-3 font-serif text-[21px] leading-snug text-ink">{review.title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-muted">{review.body}</p>
                <p className="mt-4 text-[13px] text-ink-muted">
                  <span className="text-ink">{review.customerName}</span>
                  {review.occasion ? ` · ${review.occasion}` : ''}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-muted">
            Every review on this page is from a verified rental. Wear it beautifully and you may find your own note here.
          </p>
        )}
      </section>

      {/* accessories */}
      {addOnAccessories.length > 0 ? (
        <section aria-labelledby="accessories" className="mt-20" data-reveal>
          <h2 id="accessories" className="display-md text-ink">
            Little things, chosen well
          </h2>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
            Add these at checkout — they arrive in the same box as the dress, and go back in it.
          </p>
          <ul className="mt-8">
            {addOnAccessories.map((accessory) => (
              <li key={accessory.id} className="flex items-start justify-between gap-6 py-5">
                <div>
                  <h3 className="text-[15px] text-ink">{accessory.name}</h3>
                  <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-ink-muted">{accessory.description}</p>
                  {accessory.category === 'FIT' || accessory.category === 'COVERAGE' ? (
                    <Chip tone="gold" className="mt-2.5">
                      Choose at checkout
                    </Chip>
                  ) : null}
                </div>
                <p className="tnum shrink-0 text-[15px] text-ink">{formatMoney(accessory.price)}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* related */}
      {relatedDresses.length > 0 ? (
        <section aria-labelledby="related" className="mt-20" data-reveal>
          <h2 id="related" className="display-md text-ink">
            More for {dress.occasion.toLowerCase()}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {relatedDresses.map((relatedDress) => (
              <DressCard key={relatedDress.id} dress={relatedDress} saved={savedIds.has(relatedDress.id)} signedIn={Boolean(customer)} />
            ))}
          </div>
        </section>
      ) : null}

      {/* how it works strip */}
      <section aria-label="What renting looks like" className="mt-20" data-reveal>
        <div className="grid gap-10 sm:grid-cols-3">
          {[
            { title: 'Choose', copy: 'Pick your dress, size and dates. The calendar shows what the studio can truly promise.' },
            { title: 'Wear it', copy: 'It arrives pressed with a prepaid return label. Live your evening; we handle the rest.' },
            { title: 'Send it back', copy: 'Drop the box with any LBC branch when you are done. Cleaning and inspection are on us.' },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-serif text-[22px] leading-none text-ink">{item.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">{item.copy}</p>
            </div>
          ))}
        </div>
        <Link href="/how-it-works" className="text-link mt-8 text-ink">
          See how renting works
        </Link>
      </section>
    </div>
  )
}
