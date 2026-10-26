'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Menu, ShoppingBag, UserRound, X } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/size-guide', label: 'Size & fit' },
  { href: '/membership', label: 'Membership' },
  { href: '/help', label: 'Help' },
]

export function SiteHeader({
  cartCount,
  customerName,
  signedIn,
  studioAddress,
  studioPhone,
}: {
  cartCount: number
  customerName?: string | null
  signedIn: boolean
  studioAddress?: string
  studioPhone?: string
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const firstName = customerName?.trim().split(/\s+/)[0]
  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <header className="sticky top-0 z-40 bg-page">
      <div className="shell flex h-[72px] items-center gap-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="grid size-10 place-items-center text-ink transition-opacity hover:opacity-60 lg:hidden"
        >
          <Menu className="size-5" strokeWidth={1.5} aria-hidden />
        </button>

        <Link href="/" className="whitespace-nowrap font-serif text-[30px] leading-none tracking-[-0.015em] text-ink">
          Maison Rêve
        </Link>

        <nav aria-label="Storefront" className="ml-4 hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2 py-2 text-[14px] font-medium text-ink-muted transition-colors hover:text-ink',
                isActive(item.href) && 'text-accent',
              )}
            >
              {isActive(item.href) ? <span aria-hidden className="size-1.5 bg-accent" /> : null}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href={signedIn ? '/account#favorites' : '/account/sign-in?next=%2Faccount%23favorites'}
            aria-label="Saved dresses"
            className="hidden size-10 place-items-center text-ink-muted transition-colors hover:text-ink sm:grid"
          >
            <Heart className="size-[18px]" strokeWidth={1.5} aria-hidden />
          </Link>
          <Link
            href="/account"
            aria-label={signedIn ? 'Your account' : 'Sign in'}
            className="flex h-10 items-center gap-2 px-2.5 text-[14px] font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <UserRound className="size-[18px]" strokeWidth={1.5} aria-hidden />
            <span className="hidden sm:inline">{signedIn ? (firstName ?? 'Account') : 'Sign in'}</span>
          </Link>
          <Link
            href="/cart"
            aria-label={`Your bag, ${cartCount} ${cartCount === 1 ? 'piece' : 'pieces'}`}
            className="relative flex h-10 items-center gap-2 px-2.5 text-[14px] font-medium text-ink-muted transition-colors hover:text-ink"
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} aria-hidden />
            <span className="tnum hidden sm:inline">{cartCount}</span>
            {cartCount > 0 ? <span className="absolute top-2 right-1 size-1.5 rounded-full bg-accent sm:hidden" aria-hidden /> : null}
          </Link>
          <Link href="/shop" className="action ml-3 hidden h-11 px-5 text-[13px] xl:inline-flex">
            Find your dress
          </Link>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col bg-page">
            <div className="shell flex h-[72px] items-center justify-between">
              <p className="font-serif text-[30px] leading-none text-ink">Maison Rêve</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid size-10 place-items-center text-ink"
              >
                <X className="size-5" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <nav aria-label="Storefront" className="shell flex-1 overflow-y-auto pt-6">
              <ul>
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block py-5 font-serif text-[clamp(2rem,8vw,2.75rem)] leading-none text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/account" className="block py-5 font-serif text-[clamp(2rem,8vw,2.75rem)] leading-none text-ink">
                    {signedIn ? 'Your account' : 'Sign in'}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="block py-5 font-serif text-[clamp(2rem,8vw,2.75rem)] leading-none text-ink">
                    Contact the studio
                  </Link>
                </li>
              </ul>
              <p className="mt-10 text-[13px] leading-relaxed text-ink-muted">
                {studioAddress ?? '418 Legazpi Street, Floor 3, Legazpi Village, Makati City 1229'}
                <br />
                {studioPhone ?? '+63 917 555 0148'}
              </p>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  )
}
