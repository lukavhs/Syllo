import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { FullScreenStatus } from '../components/layout/FullScreenStatus'
import { useSession } from '../lib/session'

/** Where to send the user after they sign in: the page they originally asked for. */
export interface SignInRedirectState {
  from?: string
}

/** Gate for every signed-in screen. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, retry } = useSession()
  const location = useLocation()

  if (status === 'loading') return <FullScreenStatus variant="loading" />
  if (status === 'error') return <FullScreenStatus variant="error" onRetry={retry} />
  if (status === 'signedOut') {
    const state: SignInRedirectState = { from: location.pathname + location.search }
    return <Navigate to="/signin" replace state={state} />
  }
  return children
}
