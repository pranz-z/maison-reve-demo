'use client'

import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { SORT_LABELS } from '@/lib/storefront/shop-params'

/** Sort changes navigate straight to the new URL — no submit button needed. */
export function SortSelect({ value }: { value: string }) {
  const router = useRouter()

  function onSort(next: string) {
    const url = new URL(window.location.href)
    if (next === 'recommended') url.searchParams.delete('sort')
    else url.searchParams.set('sort', next)
    url.searchParams.delete('page')
    router.push(`${url.pathname}?${url.searchParams.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="shop-sort" className="text-[13px] text-ink-muted">
        Sort
      </label>
      <span className="relative inline-flex items-center">
        <select
          id="shop-sort"
          defaultValue={value}
          onChange={(event) => onSort(event.target.value)}
          className="h-9 appearance-none border-0 border-b border-line-strong bg-transparent pr-6 pl-0 text-[13px] text-ink focus:border-accent focus-visible:outline-none"
        >
          {SORT_LABELS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 size-3.5 text-ink-muted" strokeWidth={1.5} aria-hidden />
      </span>
    </div>
  )
}
