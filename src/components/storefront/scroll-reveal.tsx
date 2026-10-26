'use client'

/**
 * Scroll reveal — one IntersectionObserver for every [data-reveal] block.
 * The hiding class is only added once this script runs, so a page that
 * never hydrates still shows its content. Re-arms after client navigation.
 */
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const root = document.documentElement
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -4% 0px', threshold: 0.02 },
    )

    // Wait one frame so server-rendered markup is in the DOM before we hide it.
    frame = requestAnimationFrame(() => {
      const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')
      if (targets.length === 0) return
      root.classList.add('has-reveal')
      targets.forEach((target) => {
        if (target.getBoundingClientRect().top < window.innerHeight * 0.95) {
          target.classList.add('is-in')
          return
        }
        observer.observe(target)
      })
    })

    // Safety net: nothing stays hidden because an observer missed it.
    const safety = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((target) => target.classList.add('is-in'))
    }, 2500)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(safety)
      observer.disconnect()
      root.classList.remove('has-reveal')
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((target) => target.classList.remove('is-in'))
    }
  }, [pathname])

  return null
}
