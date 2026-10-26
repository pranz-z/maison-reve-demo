'use client'

import { useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Heart, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { toggleFavoriteAction } from '@/app/(storefront)/actions'

/** The heart that blooms when saved. Guests are sent to sign in first. */
export function WishlistHeart({
  dressId,
  dressName,
  saved,
  signedIn,
  className,
}: {
  dressId: string
  dressName: string
  saved: boolean
  signedIn: boolean
  className?: string
}) {
  const [isSaved, setIsSaved] = useState(saved)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  function onToggle() {
    if (!signedIn) {
      router.push(`/account/sign-in?next=${encodeURIComponent(pathname)}`)
      return
    }
    startTransition(async () => {
      const result = await toggleFavoriteAction(dressId)
      if (result.requiresSignIn) {
        router.push(`/account/sign-in?next=${encodeURIComponent(pathname)}`)
        return
      }
      setIsSaved(result.saved)
    })
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={pending}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${dressName} from favorites` : `Save ${dressName} to favorites`}
      className={cn(
        'grid size-10 place-items-center text-ink transition-colors duration-200 hover:text-accent disabled:opacity-70',
        isSaved && 'text-accent',
        className,
      )}
    >
      {pending ? (
        <Loader2 className="size-4.5 animate-spin" strokeWidth={1.5} aria-hidden />
      ) : (
        <Heart
          className={cn('size-[18px] transition-transform duration-300', isSaved ? 'scale-110 fill-current' : 'scale-100')}
          strokeWidth={1.5}
          aria-hidden
        />
      )}
    </button>
  )
}
