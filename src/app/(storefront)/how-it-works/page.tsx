import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Package, Sparkles, Truck } from 'lucide-react'
import { ContentHeader, Faq } from '@/components/storefront/content-page'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'How renting works',
  description:
    'Reserve your dates, the studio confirms by hand, your dress arrives pressed with a prepaid return label. Cleaning and two-way shipping included.',
}

const TIMELINE = [
  {
    title: 'Reserve',
    copy: 'Choose the dress, pick your size — add a backup size if you are between two — and drop your event date on the live calendar. Only dates the studio can truly promise appear in the window.',
  },
  {
    title: 'The studio confirms',
    copy: 'A stylist checks the calendar, the dress and the fit notes from your account, then confirms your reservation by hand. Nothing is captured before then.',
  },
  {
    title: 'It ships',
    copy: 'Your dress leaves Legazpi Street steamed, on the padded hanger, boxed with a prepaid LBC label. Tracking lands in your account the moment it is scanned.',
  },
  {
    title: 'You wear it',
    copy: 'Standard rentals are four days from the day before your event; eight-day rentals ride through a longer weekend of celebrations. The dress is yours for the whole window.',
  },
  {
    title: 'Return it',
    copy: 'Fold it back into the same box with the prepaid label and hand it to any LBC branch by your return date. Cleaning and inspection are on us — and your deposit is released.',
  },
]

export default async function HowItWorksPage() {
  const settings = await prisma.studioSettings.findUniqueOrThrow({ where: { id: 'studio' } })
  const windowDays = settings.cancellationWindowDays
  const replyTarget = settings.replyTargetHours === 1 ? 'an hour' : `${settings.replyTargetHours} studio hours`

  return (
    <div className="shell py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <ContentHeader
          eyebrow="The rhythm of a rental"
          title="Beautifully simple, on purpose."
          lede="Five steps between finding the dress and dancing in it. The studio handles everything with a hanger on it, so all you handle is the evening."
        />
        <figure className="relative" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
            <Image
              src="/images/hero/hero-runway.webp"
              alt="A model in a strapless ivory gown in the salon, under the chandelier."
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <figcaption className="mt-3 text-[13px] text-ink-muted">The salon, 418 Legazpi Street</figcaption>
        </figure>
      </div>

      <ol className="mt-16">
        {TIMELINE.map((item) => (
          <li key={item.title} className="grid gap-4 py-8 md:grid-cols-[0.8fr_1.2fr] md:gap-12" data-reveal>
            <h2 className="font-serif text-[clamp(1.8rem,2.8vw,2.4rem)] leading-none text-ink">{item.title}</h2>
            <p className="max-w-xl text-[16px] leading-relaxed text-ink">
              {item.title === 'The studio confirms'
                ? `A stylist checks the calendar, the dress and the fit notes from your account, then confirms your reservation by hand — usually within ${replyTarget}. Nothing is captured before then.`
                : item.copy}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap items-center gap-6" data-reveal>
        <Link href="/shop" className="action">
          Browse the collection
          <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
        </Link>
        <Link href="/size-guide" className="text-link text-ink">
          Check your fit first
        </Link>
      </div>

      <section aria-labelledby="included" className="mt-24" data-reveal>
        <h2 id="included" className="display-md text-ink">
          In every box
        </h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: 'Two-way shipping', copy: 'Insured, tracked, and free in both directions within Metro Manila and Luzon.' },
            { icon: Sparkles, title: 'Cleaning and pressing', copy: 'Professionally cleaned and steamed between every rental — never your to-do.' },
            {
              icon: BadgeCheck,
              title: 'Fit support',
              copy: 'A stylist checks your measurements against each dress before it is packed, and after you return it we check the dress.',
            },
            { icon: Package, title: 'The little things', copy: 'Padded hanger, garment bag, prepaid return label, and a spare button and thread.' },
          ].map((item) => (
            <li key={item.title}>
              <item.icon className="size-5 text-ink" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-3 text-[16px] text-ink">{item.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{item.copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="dates" className="mt-24" data-reveal>
        <h2 id="dates" className="display-md text-ink">
          Dates, honestly
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
          The calendar you see is the studio's own — the same one the office works from. It accounts for every held reservation, the day a
          dress needs after it returns, the cleaning queue, and the quiet days a stylist has blocked for mending or fittings. What it offers
          is what can genuinely arrive in time.
        </p>
        <div className="mt-8">
          <Faq
            items={[
              {
                q: 'What happens right after I reserve?',
                a: 'Your card is authorized, never charged. A stylist reviews the reservation by hand — usually within a couple of hours — and confirms it. That is the moment the authorization is captured, and your confirmation email with delivery details goes out.',
              },
              {
                q: 'Can I change my dates later?',
                a: `Yes, if the calendar allows. Write to the studio or reply to your confirmation email with the new date; moving a reservation as far out as ${windowDays} ${windowDays === 1 ? 'day' : 'days'} before the event is free.`,
              },
              {
                q: 'What if my size is between two?',
                a: 'Choose a backup size for ₱1,400 and both sizes travel in the box. Slip on both as soon as the box arrives and return whichever fits least well — exchanges on the spot are free.',
              },
              {
                q: 'How late can I book?',
                a: 'The calendar opens dates from two days out. If you need something sooner, contact the studio — a stylist may be able to make it happen.',
              },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="care" className="mt-24 bg-surface-muted px-6 py-12 sm:px-10" data-reveal>
        <h2 id="care" className="display-md max-w-xl text-ink">
          Wearing a dress that is not yours
        </h2>
        <div className="mt-5 max-w-[60ch] space-y-4 text-[16px] leading-relaxed text-ink">
          <p>
            Rentals stay beautiful because of small care taken by the people wearing them. Keep a glass of red at arm's length, let a
            tailor-free fix be the tape measure you use, and tell the studio about any accident immediately. Most can be repaired quietly,
            and honesty almost always keeps a repair out of your hands financially.
          </p>
          <p>
            Normal wear (a settling hem, a loosened bead, a breeze carrying the train through something rustic) is part of a dress's life and
            the studio's maintenance. The{' '}
            <Link href="/policies/returns" className="text-ink underline decoration-line-strong underline-offset-4 hover:text-accent">
              returns and care page
            </Link>{' '}
            spells out exactly what is and is not covered.
          </p>
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
