import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'

interface FullScreenStatusProps {
  variant: 'loading' | 'error'
  onRetry?: () => void
}

/** Shown while the session is being checked, or if the API can't be reached. */
export function FullScreenStatus({ variant, onRetry }: FullScreenStatusProps) {
  // The free Render API sleeps when idle and takes ~30s to wake. After a few seconds of
  // loading, say so, so a slow first load doesn't look broken.
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    if (variant !== 'loading') return
    const timer = setTimeout(() => setSlow(true), 4000)
    return () => clearTimeout(timer)
  }, [variant])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
      <Logo size={34} />
      {variant === 'loading' ? (
        <p role="status" className="text-syllo-muted">
          {slow ? 'Waking up the server. This can take up to 30 seconds…' : 'Loading your center…'}
        </p>
      ) : (
        <>
          <p role="alert" className="text-syllo-muted">
            We couldn't reach the server. Check your connection and try again.
          </p>
          <Button onClick={onRetry}>Try again</Button>
        </>
      )}
    </div>
  )
}
