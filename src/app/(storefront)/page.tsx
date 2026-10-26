import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { prisma } from '@/lib/db'
import { formatMoney } from '@/lib/money'
import { currentCustomer } from '@/lib/storefront/session'
import { facetsFor, featuredDresses, loadCatalog, trendingDresses, shopHref } from '@/lib/storefront/catalog'
import { DressCard } from '@/components/storefront/dress-card'
import { DressPhoto } from '@/components/storefront/dress-photo'
import { HomeHero } from '@/components/storefront/home-hero'
import { NewsletterForm } from '@/components/storefront/newsletter-form'
import { OccasionIndex, type OccasionTile } from '@/components/storefront/occasion-index'

export const metadata: Metadata = {
  title: 'Designer dress rental in Manila',
  description:
    'Rent designer gowns for weddings, galas and black-tie evenings. Reserve your dates online, we deliver pressed to your door and take care of cleaning and returns.',
}

const OCCASIONS = [
  { occasion: 'Wedding guest', blurb: 'Silks and midis that never upstage the bride.' },
  { occasion: 'Gala', blurb: 'Statement gowns for a room full of candlelight.' },
  { occasion: 'Black tie', blurb: 'Floor-sweeping velvet and hand-set beading.' },
  { occasion: 'Bridal shower', blurb: 'Soft tulle for the bride-to-be.' },
  { occasion: 'Debut', blurb: 'Eighteen, and the room is yours.' },
  { occasion: 'Anniversary', blurb: 'Something worth remembering.' },
]

const STEPS = [
  {
    title: 'Choose',
    copy: 'Pick the dress and a size — with a backup if you are between two — then drop your event date on the live calendar. It only offers what the studio can promise.',
  },
  {
    title: 'Wear it',
    copy: 'The dress arrives the day before, steamed and boxed with the prepaid return label. Insurance and a styling hand are one tap away at checkout.',
  },
  {
    title: 'Send it back',
    copy: 'Fold it into the same box and hand it to any LBC branch by your return date. Cleaning, inspection and the deposit ride are handled by the studio.',
  },
]

export default async function HomePage() {
  const [catalog, customer, stories, reviewSummary] = await Promise.all([
    loadCatalog(),
    currentCustomer(),
    prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { dress: { select: { name: true, slug: true, color: true, colorHex: true, artTone: true, designer: true, occasion: true } } },
    }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
  ])

  const facets = facetsFor(catalog)
  const trending = trendingDresses(catalog, 8)
  const featured = featuredDresses(catalog, 4)
  const savedIds = customer
    ? new Set(
        (
          await prisma.favorite.findMany({ where: { customerId: customer.id }, select: { dressId: true } })
        ).map((row) => row.dressId),
      )
    : new Set<string>()

  const tiles: OccasionTile[] = OCCASIONS.flatMap((tile) => {
    const matches = catalog.dresses.filter((dress) => dress.occasion === tile.occasion)
    if (matches.length === 0) return []
    const hero = [...matches].sort((a, b) => Number(b.featured) - Number(a.featured) || b.timesRented - a.timesRented)[0]!
    return [
      {
        ...tile,
        count: matches.length,
        href: shopHref({ sort: 'recommended', page: 1 }, { occasion: tile.occasion }),
        hero: {
          slug: hero.slug,
          name: hero.name,
          designer: hero.designer,
          color: hero.color,
          colorHex: hero.colorHex,
          artTone: hero.artTone,
        },
      },
    ]
  })

  const fromPrice = formatMoney(Math.min(...catalog.dresses.map((dress) => dress.rentalPrice4)))
  const lead = stories[0]
  const notes = stories.slice(1, 4)

  return (
    <>
      <HomeHero
        occasions={facets.occasions.map((entry) => entry.value)}
        sizes={facets.sizes}
        stats={{
          fromPrice,
          gowns: catalog.dresses.length,
          rating: reviewSummary._avg.rating,
          reviews: reviewSummary._count,
        }}
      />

      {/* shop by occasion */}
      <section id="dress-for-the-invitation" aria-labelledby="occasions" className="section shell scroll-mt-24">
        <div className="heading-row" data-reveal>
          <h2 id="occasions" className="display-lg max-w-xl text-ink">
            Dress for the invitation
          </h2>
          <Link href="/shop" className="text-link text-ink">
            The whole collection
            <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>

        <div className="mt-12" data-reveal>
          <OccasionIndex tiles={tiles} />
        </div>
      </section>

      {/* trending */}
      <section aria-labelledby="trending" className="bg-surface-muted">
        <div className="shell section">
          <div className="heading-row" data-reveal>
            <h2 id="trending" className="display-lg text-ink">
              Most-worn this season
            </h2>
            <Link href="/shop?sort=rented" className="text-link text-ink">
              All most-rented
              <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4" data-reveal>
            {trending.map((dress, index) => (
              <div key={dress.id} style={{ '--reveal-delay': `${(index % 4) * 60}ms` } as CSSProperties}>
                <DressCard dress={dress} saved={savedIds.has(dress.id)} signedIn={Boolean(customer)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* new arrivals — editorial split */}
      {featured.length > 0 ? (
        <section aria-labelledby="new" className="section shell">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.6fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
              <h2 id="new" className="display-lg text-ink">
                Just arrived
              </h2>
              <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-ink">
                Four or five pieces join the Legazpi Street racks most months — often one at a time, often gone by the weekend. A stylist
                can tell you what is coming next.
              </p>
              <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink-muted">
                Photography note: archival gowns stand in until the studio reshoot lands.
              </p>
              <Link href="/shop?sort=newest" className="text-link mt-6 text-ink">
                All new arrivals
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-6">
              {featured.map((dress, index) => (
                <div key={dress.id} className={index % 2 === 1 ? 'sm:mt-16' : undefined} data-reveal style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}>
                  <DressCard dress={dress} saved={savedIds.has(dress.id)} signedIn={Boolean(customer)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* how it works */}
      <section aria-labelledby="how" className="bg-charcoal text-ivory">
        <div className="shell section">
          <div className="heading-row" data-reveal>
            <h2 id="how" className="display-lg max-w-3xl text-ivory">
              Choose it. Wear it. Send it back.
            </h2>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-10" data-reveal>
            {STEPS.map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-[32px] leading-none text-ivory">{item.title}</h3>
                <p className="mt-4 max-w-xs text-[16px] leading-relaxed text-ivory/80">{item.copy}</p>
              </div>
            ))}
          </div>

          <Link href="/how-it-works" className="text-link mt-12 text-ivory">
            The details, hour by hour
            <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>

      {/* the idea is old — archival plates from the Rijksmuseum */}
      <section aria-labelledby="history" className="section shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <div data-reveal>
            <h2 id="history" className="display-lg max-w-md text-ink">
              Borrowed, since 1884.
            </h2>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink">
              For a century and a half, the evening gown has been the one thing worth having made, worn once, and kept in tissue paper. These
              plates — The Hague, 1884; Paris, 1900 — are the same problem this studio solves with a calendar instead of a wardrobe.
            </p>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-muted">
              You get the cut, the silk and the room. We keep the tissue paper, the steamer and the fifty weeks it spends unworn.
            </p>
            <Link href="/how-it-works" className="text-link mt-7 text-ink">
              Why we rent, not sell
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-8" data-reveal>
            <figure>
              <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
                <Image
                  src="/images/found/plate-1884.jpg"
                  alt="A fashion plate from De Bazar, 1884: two women in rose and ivory evening gowns."
                  fill
                  sizes="(max-width: 1024px) 45vw, 30vw"
                  className="object-cover object-[50%_42%]"
                />
              </div>
              <figcaption className="mt-3 text-[13px] leading-relaxed text-ink-muted">De Bazar, 1884 · Rijksmuseum</figcaption>
            </figure>
            <figure className="mt-10 sm:mt-16">
              <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
                <Image
                  src="/images/found/plate-1900.jpg"
                  alt="A Le Chic fashion plate, 1900: a woman in a tiered polka-dot evening gown."
                  fill
                  sizes="(max-width: 1024px) 45vw, 30vw"
                  className="object-cover object-[50%_38%]"
                />
              </div>
              <figcaption className="mt-3 text-[13px] leading-relaxed text-ink-muted">Le Chic, 1900 · Rijksmuseum</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* the street */}
      <section aria-labelledby="visit" className="relative isolate overflow-hidden bg-charcoal">
        <div className="relative min-h-[62svh]">
          <Image
            src="/images/found/makati-avenue.jpg"
            alt="Legazpi Street, Manila, looking toward the BGC skyline at dusk."
            fill
            sizes="100vw"
            className="object-cover object-[50%_55%]"
          />
          <div aria-hidden className="photo-scrim absolute inset-0" />
          <div className="shell relative flex min-h-[62svh] flex-col justify-end pt-24 pb-12">
            <h2 id="visit" className="display-lg max-w-xl text-ivory">
              Find us on Ayala Avenue.
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ivory/80">
              Floor three, above the galleries. Fittings by appointment, Tuesday to Saturday — bring the invitation and let the studio worry
              about the hem.
            </p>
            <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
              <Link href="/contact" className="action action--ivory">
                Plan a fitting
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
              </Link>
              <p className="text-[13px] text-ivory/65">Photograph: Patrick Roque, CC BY-SA 4.0</p>
            </div>
          </div>
        </div>
      </section>

      {/* customer stories */}
      {lead ? (
        <section aria-labelledby="stories" className="section shell">
          <div className="heading-row" data-reveal>
            <h2 id="stories" className="display-lg text-ink">
              Worn by you, reviewed honestly
            </h2>
            <p className="max-w-xs text-[16px] leading-relaxed text-ink">
              Every note below is from a verified rental. The fit advice is the part that keeps.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
            <Link href={`/dress/${lead.dress.slug}`} className="group block" data-reveal aria-label={`See the ${lead.dress.name}`}>
              <DressPhoto
                slug={lead.dress.slug}
                name={lead.dress.name}
                artTone={lead.dress.artTone}
                focus="30%"
                className="aspect-[4/5] w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
              />
            </Link>

            <figure data-reveal>
              <blockquote className="font-serif text-[clamp(1.9rem,3.2vw,2.9rem)] leading-[1.12] tracking-[-0.01em] text-ink">
                “{lead.title}”
              </blockquote>
              <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-ink">{lead.body}</p>
              <figcaption className="mt-6 text-[14px] text-ink">
                {lead.customerName}
                <span className="text-ink-muted">
                  {' · '}
                  {lead.occasion ?? lead.dress.occasion} · {lead.dress.name}
                </span>
              </figcaption>
            </figure>
          </div>

          {notes.length > 0 ? (
            <div className="mt-16 grid gap-10 sm:grid-cols-3" data-reveal>
              {notes.map((story) => (
                <figure key={story.id}>
                  <blockquote className="font-serif text-[20px] leading-snug text-ink">“{story.title}”</blockquote>
                  <figcaption className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                    <span className="text-ink">{story.customerName}</span>
                    <br />
                    {story.occasion ?? story.dress.occasion} ·{' '}
                    <Link href={`/dress/${story.dress.slug}`} className="underline decoration-line-strong underline-offset-4 hover:text-accent">
                      {story.dress.name}
                    </Link>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* membership + newsletter */}
      <section aria-labelledby="club" className="bg-accent text-accent-ink">
        <div className="shell section">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div data-reveal>
              <h2 id="club" className="display-lg max-w-xl text-accent-ink">
                Rent like it is your own.
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ivory/80">
                Three rentals a month, a stylist who knows your measurements, first look at new arrivals and standing credit toward every
                evening out. From ₱4,499 a month.
              </p>
              <Link href="/membership" className="action action--ivory mt-8">
                Explore membership
                <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
              </Link>
            </div>

            <div className="lg:pl-4" data-reveal>
              <h3 className="font-serif text-[26px] leading-none text-accent-ink">Letters from the studio</h3>
              <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-ivory/80">
                New arrivals, private sale days and the occasional dress with a story. Twice a month, never more.
              </p>
              <div className="mt-6">
                <NewsletterForm source="home" dark />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* the plain facts */}
      <section aria-label="What is included" className="shell py-12">
        <p className="text-[16px] leading-relaxed text-ink">
          Free two-way shipping · Cleaned and pressed before every rental · Refundable deposits, never hidden · From {fromPrice} a rental
        </p>
      </section>
    </>
  )
}
