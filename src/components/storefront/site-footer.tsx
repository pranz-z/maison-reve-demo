import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { NewsletterForm } from './newsletter-form'

const COLUMNS: Array<{ heading: string; links: Array<{ href: string; label: string }> }> = [
  {
    heading: 'Shop',
    links: [
      { href: '/shop?occasion=Wedding+guest', label: 'Wedding guest' },
      { href: '/shop?occasion=Gala', label: 'Gala' },
      { href: '/shop?occasion=Black+tie', label: 'Black tie' },
      { href: '/shop?sort=newest', label: 'New arrivals' },
    ],
  },
  {
    heading: 'The house',
    links: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/size-guide', label: 'Size and fit guide' },
      { href: '/membership', label: 'Membership' },
      { href: '/contact', label: 'Contact the studio' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { href: '/help', label: 'Help center' },
      { href: '/policies/rental-terms', label: 'Rental terms' },
      { href: '/policies/returns', label: 'Returns and care' },
      { href: '/policies/privacy', label: 'Privacy' },
    ],
  },
]

export function SiteFooter({
  studioAddress,
  studioPhone,
  studioEmail,
  hoursSummary,
}: {
  studioAddress?: string
  studioPhone?: string
  studioEmail?: string
  hoursSummary?: string
}) {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="shell pt-16 pb-10 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1.7fr]">
          <div>
            <p className="font-serif text-[clamp(2.4rem,5vw,3.6rem)] leading-none tracking-[-0.02em] text-ivory">Maison Rêve</p>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ivory/65">
              Designer dresses, rented. Delivered pressed, returned free — and someone on the other end of the line if the fit needs a
              second look.
            </p>
            <p className="mt-8 text-[13px] leading-relaxed text-ivory/60">
              {studioAddress ?? '418 Legazpi Street, Floor 3 · Makati City 02115'}
              <br />
              {studioEmail ?? 'studio@maisonreve.ph'} · {studioPhone ?? '+63 917 555 0148'}
              {hoursSummary ? (
                <>
                  <br />
                  {hoursSummary}
                </>
              ) : null}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <p className="text-[13px] font-medium text-ivory/60">{column.heading}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="text-[14px] text-ivory/85 transition-colors hover:text-ivory">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-2">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-sm">
              <p className="font-serif text-[20px] leading-none text-ivory">Letters from the studio</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ivory/60">New arrivals, twice a month.</p>
              <div className="mt-4">
                <NewsletterForm source="footer" dark />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-[13px] leading-relaxed text-ivory/55 sm:items-end">
              <Link href="/contact" className="text-link text-ivory/80">
                Visit the studio
                <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden />
              </Link>
              <p>© {new Date().getFullYear()} Maison Rêve.</p>
              <p>One-of-a-kind, worn beautifully.</p>
              <div className="flex flex-wrap gap-x-2 sm:justify-end">
                <span>Ayala Avenue photograph: Patrick Roque, CC BY-SA 4.0.</span>
                <span>Archive gowns and plates: Rijksmuseum, CC0.</span>
                <span>Via Wikimedia Commons.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
