/**
 * Date-first search: the home page's one job. Event date, occasion and
 * size go straight into the shop with the filters applied. It sits on
 * paper under the hero, so it is drawn as a written form — labels above
 * ruled fields — rather than a floating card.
 */
import { ArrowRight } from 'lucide-react'
import { isoDay } from '@/lib/dates'
import { addDays, todayUtc } from '@/lib/dates'
import { STOREFRONT_BOOKING_HORIZON_DAYS } from '@/lib/storefront/shop-params'

export function DateSearch({ occasions, sizes }: { occasions: string[]; sizes: string[] }) {
  const today = todayUtc()
  const min = isoDay(addDays(today, 2))
  const max = isoDay(addDays(today, STOREFRONT_BOOKING_HORIZON_DAYS))

  return (
    <form method="GET" action="/shop" role="search" aria-label="Find a dress for your date" className="grid gap-x-8 gap-y-6 md:grid-cols-[1.1fr_0.9fr_0.7fr_auto] md:items-end">
      <div>
        <label htmlFor="hero-date" className="mb-2 block text-[13px] font-medium text-ink-muted">
          Your event date
        </label>
        <input id="hero-date" type="date" name="event" min={min} max={max} className="line-field" />
      </div>
      <div>
        <label htmlFor="hero-occasion" className="mb-2 block text-[13px] font-medium text-ink-muted">
          Occasion
        </label>
        <select id="hero-occasion" name="occasion" defaultValue="" className="line-field appearance-none">
          <option value="">Any occasion</option>
          {occasions.map((occasion) => (
            <option key={occasion} value={occasion}>
              {occasion}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="hero-size" className="mb-2 block text-[13px] font-medium text-ink-muted">
          Size
        </label>
        <select id="hero-size" name="size" defaultValue="" className="line-field appearance-none">
          <option value="">Any size</option>
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button type="submit" className="action h-11 w-full px-6 md:w-auto">
          Find dresses
          <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </form>
  )
}
