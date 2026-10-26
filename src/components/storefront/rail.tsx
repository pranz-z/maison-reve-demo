'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

/** A horizontal editorial rail with quiet arrow controls. */
export function Rail({ ariaLabel, children, className }: { ariaLabel: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  function scrollBy(direction: 1 | -1) {
    const node = ref.current
    if (!node) return
    node.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll backward"
          className="grid size-11 place-items-center border border-line-strong text-ink transition-colors hover:bg-ink hover:text-page"
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll forward"
          className="grid size-11 place-items-center border border-line-strong text-ink transition-colors hover:bg-ink hover:text-page"
        >
          <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </div>
  )
}
