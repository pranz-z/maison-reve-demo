'use client'

import { useActionState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { subscribeAction } from '@/app/(storefront)/actions'
import { IDLE_FORM } from '@/app/(storefront)/form-state'

/** Newsletter signup — one field, one confirmation line. */
export function NewsletterForm({ source = 'home', dark = false }: { source?: string; dark?: boolean }) {
  const [state, formAction, pending] = useActionState(subscribeAction, IDLE_FORM)

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name="source" value={source} />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <label htmlFor={`newsletter-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-${source}`}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={
            dark
              ? 'h-11 w-full min-w-0 border-0 border-b border-ivory/40 bg-transparent px-0 text-[15px] text-ivory placeholder:text-ivory/45 focus:border-ivory focus-visible:outline-none'
              : 'h-11 w-full min-w-0 border-0 border-b border-line-strong bg-transparent px-0 text-[15px] text-ink placeholder:text-ink-muted focus:border-accent focus-visible:outline-none'
          }
        />
        <button
          type="submit"
          disabled={pending}
          className={
            dark
              ? 'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[2px] bg-ivory px-5 text-[13px] font-medium text-ink transition-colors hover:bg-blush disabled:opacity-60'
              : 'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[2px] bg-accent px-5 text-[13px] font-medium text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60'
          }
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />}
          Join the list
        </button>
      </form>
      {state.status === 'ok' ? (
        <p role="status" className={dark ? 'mt-3 text-[13px] leading-relaxed text-ivory/70' : 'mt-3 text-[13px] leading-relaxed text-ink-muted'}>
          {state.message}
        </p>
      ) : null}
      {state.status === 'error' ? (
        <p role="alert" className={dark ? 'mt-3 text-[13px] font-medium text-rose' : 'mt-3 text-[13px] font-medium text-danger-ink'}>
          {state.message}
        </p>
      ) : null}
    </div>
  )
}
