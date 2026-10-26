/**
 * Shop filters — plain links, so every state is a real URL, shareable and
 * keyboard-navigable. The mobile drawer renders the same groups.
 */
import Link from 'next/link'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { PRICE_BANDS, shopHref } from '@/lib/storefront/shop-params'
import type { ShopFacets, ShopFilters } from '@/lib/storefront/catalog'

type Group = {
  key: 'occasion' | 'size' | 'color' | 'length' | 'price'
  label: string
  options: Array<{ value: string; label: string; count?: number; swatch?: string }>
}

const COLOR_SWATCHES: Record<string, string> = {
  Champagne: '#e8d9b8',
  'Midnight blue': '#2f3540',
  Blush: '#f0d4d4',
  Emerald: '#33544a',
  'Soft white': '#f7f3ef',
  'Dusty rose': '#d8a7a7',
  Terracotta: '#c47a5a',
  Noir: '#2b2628',
  'Pearl grey': '#d9d6d1',
  Ivory: '#f4ede7',
  'Antique gold': '#c9a96e',
  'Blush pink': '#f3d9d9',
  Burgundy: '#6d2f3c',
}

function groupList(facets: ShopFacets): Group[] {
  return [
    {
      key: 'occasion',
      label: 'Occasion',
      options: facets.occasions.map((entry) => ({ value: entry.value, label: entry.value, count: entry.count })),
    },
    { key: 'size', label: 'Size', options: facets.sizes.map((size) => ({ value: size, label: size })) },
    {
      key: 'color',
      label: 'Colour',
      options: facets.colors.map((entry) => ({ value: entry.value, label: entry.value, count: entry.count, swatch: COLOR_SWATCHES[entry.value] })),
    },
    {
      key: 'length',
      label: 'Length',
      options: facets.lengths.map((entry) => ({ value: entry.value, label: entry.value, count: entry.count })),
    },
    { key: 'price', label: 'Rental price', options: PRICE_BANDS.map((band) => ({ value: band.value, label: band.label })) },
  ]
}

export function ShopFilters({ facets, filters, resultCount }: { facets: ShopFacets; filters: ShopFilters; resultCount: number }) {
  const groups = groupList(facets)
  const activeCount = [filters.occasion, filters.size, filters.color, filters.length, filters.price].filter(Boolean).length

  function toggle(key: Group['key'], value: string): string {
    const current = filters[key]
    return shopHref(filters, { [key]: current === value ? undefined : value, page: 1 } as Partial<ShopFilters>)
  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-[13px] font-medium text-ink">Refine</p>
        {activeCount > 0 ? (
          <Link
            href={shopHref(filters, { occasion: undefined, size: undefined, color: undefined, length: undefined, price: undefined, page: 1 })}
            className="text-[13px] text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent"
          >
            Clear all
          </Link>
        ) : null}
      </div>

      <div className="mt-6 space-y-8">
        {groups.map((group) => (
          <fieldset key={group.key} className="border-0 p-0">
            <legend className="mb-3 w-full text-[13px] font-medium text-ink">{group.label}</legend>
            <ul className="space-y-0.5">
              {group.options.map((option) => {
                const active = filters[group.key] === option.value
                return (
                  <li key={option.value}>
                    <Link
                      href={toggle(group.key, option.value)}
                      aria-pressed={active}
                      className={cn(
                        'flex items-center justify-between gap-3 py-1.5 text-[15px] transition-colors',
                        active ? 'font-medium text-accent' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {option.swatch ? (
                          <span aria-hidden className="size-3 border border-charcoal/10" style={{ background: option.swatch }} />
                        ) : null}
                        {option.label}
                      </span>
                      {option.count !== undefined ? <span className="tnum text-[13px] text-ink-muted/80">{option.count}</span> : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        ))}
      </div>

      <p className="mt-8 text-[13px] text-ink-muted">
        {resultCount} {resultCount === 1 ? 'dress' : 'dresses'} in the collection
        {filters.event ? ' for this date' : ''}
      </p>
    </div>
  )
}

/** Active filter chips above the grid, each one removable. */
export function ActiveFilterChips({ facets, filters }: { facets: ShopFacets; filters: ShopFilters }) {
  const chips: Array<{ key: Group['key']; label: string; value: string }> = []
  if (filters.occasion) chips.push({ key: 'occasion', label: filters.occasion, value: filters.occasion })
  if (filters.size) chips.push({ key: 'size', label: `Size ${filters.size}`, value: filters.size })
  if (filters.color) chips.push({ key: 'color', label: filters.color, value: filters.color })
  if (filters.length) chips.push({ key: 'length', label: filters.length, value: filters.length })
  if (filters.price) chips.push({ key: 'price', label: PRICE_BANDS.find((band) => band.value === filters.price)?.label ?? filters.price, value: filters.price })
  void facets

  if (chips.length === 0 && !filters.event) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.event ? (
        <span className="inline-flex items-center gap-2 border border-line bg-surface-muted px-3 py-1.5 text-[13px] text-ink">
          For your event on {filters.event}
          <Link href={shopHref(filters, { event: undefined, page: 1 })} aria-label="Remove date filter" className="text-ink-muted hover:text-accent">
            <X className="size-3.5" strokeWidth={1.75} aria-hidden />
          </Link>
        </span>
      ) : null}
      {chips.map((chip) => (
        <span key={`${chip.key}-${chip.value}`} className="inline-flex items-center gap-2 border border-line bg-surface-muted px-3 py-1.5 text-[13px] text-ink">
          {chip.label}
          <Link
            href={shopHref(filters, { [chip.key]: undefined, page: 1 } as Partial<ShopFilters>)}
            aria-label={`Remove ${chip.label} filter`}
            className="text-ink-muted hover:text-accent"
          >
            <X className="size-3.5" strokeWidth={1.75} aria-hidden />
          </Link>
        </span>
      ))}
    </div>
  )
}
