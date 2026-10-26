'use client'

/**
 * The dress gallery: one archival photograph, one full-screen zoom.
 * Real product photography lands with the next collection drop; until then the
 * photograph is an honest archive gown and the caption says so.
 */
import { useEffect, useRef, useState } from 'react'
import { X, ZoomIn } from 'lucide-react'
import { DressPhoto } from './dress-photo'

export function DressGallery({ slug, name, artTone }: { slug: string; name: string; artTone: string }) {
  const [zoomed, setZoomed] = useState(false)
  const zoomTriggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!zoomed) return
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomed(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      zoomTriggerRef.current?.focus()
    }
  }, [zoomed])

  return (
    <div className="min-w-0">
      <div className="relative">
        <DressPhoto slug={slug} name={name} artTone={artTone} focus="34%" className="aspect-[3/4] w-full" priority />
        <button
          ref={zoomTriggerRef}
          type="button"
          onClick={() => setZoomed(true)}
          className="absolute right-3 bottom-3 inline-flex h-10 items-center gap-2 bg-page/95 px-4 text-[13px] text-ink transition-colors hover:bg-page"
        >
          <ZoomIn className="size-4" strokeWidth={1.5} aria-hidden />
          Zoom
        </button>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
        Archive gown photograph, standing in until the studio shoot for this piece lands.
      </p>

      {zoomed ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — enlarged view`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4 sm:p-10"
          onClick={(event) => {
            if (event.target === event.currentTarget) setZoomed(false)
          }}
        >
          <div className="relative w-full max-w-2xl">
            <DressPhoto slug={slug} name={name} artTone={artTone} focus="34%" className="aspect-[3/4] max-h-[82dvh] w-full" />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setZoomed(false)}
              aria-label="Close enlarged view"
              className="absolute top-3 right-3 grid size-10 place-items-center bg-page/95 text-ink transition-colors hover:text-accent"
            >
              <X className="size-5" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
