import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { ContentHeader, Faq } from '@/components/storefront/content-page'

export const metadata: Metadata = {
  title: 'Membership — the Paris Club',
  description:
    'Rent like it is your own wardrobe. Membership from ₱2,499 a month, the Paris Club from ₱4,499 — rentals, credits, priority dates and a stylist who knows your measurements.',
}

const TIERS = [
  {
    name: 'Member',
    price: '₱2,499',
    cadence: 'a month',
    summary: 'For the calendar with a few good evenings on it.',
    features: [
      'One rental credit each month (unused credits roll for 60 days)',
      'Free express courier on every rental',
      '24-hour early access to new arrivals',
      '50% off backup sizes',
    ],
    featured: false,
  },
  {
    name: 'Paris Club',
    price: '₱4,499',
    cadence: 'a month',
    summary: 'For the invitation that says black tie, and the one next month too.',
    features: [
      'Three rental credits each month, rolling for 90 days',
      'A stylist who knows your measurements on call by email',
      'First look at every new arrival, a week early',
      'Same-day courier in Metro Manila, both directions',
      'Backup sizes and insurance included on every reservation',
      'Two guest passes a year for someone you love',
    ],
    featured: true,
  },
]

export default function MembershipPage() {
  return (
    <div className="shell py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <ContentHeader
          eyebrow="The Paris Club"
          title="Rent like it is your own wardrobe."
          lede="A membership turns the collection into a closet: standing credits toward every evening out, priority on the dresses everyone wants, and a stylist who already knows what fits you."
        />
        <figure className="relative" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
            <Image
              src="/images/hero/hero-runway.webp"
              alt="A model in a strapless ivory gown under the chandelier in the salon."
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover object-[50%_26%]"
            />
          </div>
          <figcaption className="mt-3 text-[13px] text-ink-muted">The salon, by appointment</figcaption>
        </figure>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {TIERS.map((tier) => (
          <section
            key={tier.name}
            aria-label={`${tier.name} membership`}
            className={tier.featured ? 'bg-accent p-7 text-accent-ink sm:p-9' : 'bg-surface-muted p-7 sm:p-9'}
            data-reveal
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className={`font-serif text-[30px] leading-none ${tier.featured ? 'text-accent-ink' : 'text-ink'}`}>{tier.name}</h2>
            </div>
            <p className={`mt-2 text-[16px] leading-relaxed ${tier.featured ? 'text-ivory/80' : 'text-ink-muted'}`}>{tier.summary}</p>
            <p className={`mt-7 font-serif text-[52px] leading-none ${tier.featured ? 'text-accent-ink' : 'text-ink'}`}>
              {tier.price}
              <span className={`ml-2 font-sans text-[15px] ${tier.featured ? 'text-ivory/70' : 'text-ink-muted'}`}>{tier.cadence}</span>
            </p>
            {tier.featured ? <p className="mt-2 text-[15px] text-ivory/75">The one most members choose.</p> : null}
            <ul className={`mt-7 space-y-3 text-[16px] leading-relaxed ${tier.featured ? 'text-ivory/90' : 'text-ink'}`}>
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-2.5">
                  <Check className={`mt-1 size-4 shrink-0 ${tier.featured ? 'text-ivory' : 'text-accent'}`} strokeWidth={2} aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={`/contact?about=${encodeURIComponent(`${tier.name} membership`)}`}
              className={
                tier.featured
                  ? 'action action--ivory mt-8'
                  : 'mt-8 inline-flex h-13 items-center justify-center rounded-[2px] bg-accent px-7 text-[15px] text-accent-ink transition-colors hover:bg-accent-hover'
              }
            >
              Ask to join
            </Link>
          </section>
        ))}
      </div>

      <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
        Memberships are arranged by hand while the studio gets to know you — a stylist writes back within a couple of hours and sets up your
        first month. Credits apply to any dress; a ₱30,000 gown simply uses two credits instead of one.
      </p>

      <section aria-labelledby="club-faq" className="mt-20" data-reveal>
        <h2 id="club-faq" className="display-md text-ink">
          The fine print, unshrunk
        </h2>
        <div className="mt-6">
          <Faq
            items={[
              {
                q: 'How do rental credits work?',
                a: 'Each credit covers a standard four-day rental of any dress up to ₱30,000 retail value. Above that, a rental uses two credits. Eight-day windows count as one credit plus a small extension.',
              },
              {
                q: 'Can I pause my membership?',
                a: 'Yes. Write to the studio and it pauses from the next renewal, keeping your credits and your measurements. You can pause twice a year.',
              },
              {
                q: 'What happens if I cancel?',
                a: 'Credits already earned stay valid for 60 days after your final month, and everything you have rented returns to the collection as usual.',
              },
              {
                q: 'Is membership worth it if I only rent twice a year?',
                a: 'Probably not, and we will say so. The open cupboard is always there at list price. Membership is built for people with four or more evenings on the calendar.',
              },
            ]}
          />
        </div>
      </section>

      <section aria-label="The street and the archive" className="mt-24" data-reveal>
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
            <figure key={picture.src} data-reveal>
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
