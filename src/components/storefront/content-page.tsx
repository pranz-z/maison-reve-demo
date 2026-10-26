import type { ReactNode } from 'react'

/** Shared mastheads and FAQ accordions for the storefront's editorial pages. */
export function ContentHeader({ eyebrow, title, lede }: { eyebrow?: string; title: string; lede: string }) {
  return (
    <header className="max-w-4xl">
      <h1 className="display-lg text-ink">{title}</h1>
      <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-muted">{lede}</p>
      {eyebrow ? <span className="sr-only">{eyebrow}</span> : null}
    </header>
  )
}

export function Faq({ items }: { items: Array<{ q: string; a: ReactNode }> }) {
  return (
    <div>
      {items.map((item) => (
        <details key={item.q} className="group py-1" data-reveal>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[15px] text-ink [&::-webkit-details-marker]:hidden">
            {item.q}
            <span aria-hidden className="text-lg text-ink-muted transition-transform group-open:rotate-45">
              ＋
            </span>
          </summary>
          <div className="max-w-2xl pb-5 text-[15px] leading-relaxed text-ink-muted">{item.a}</div>
        </details>
      ))}
    </div>
  )
}
