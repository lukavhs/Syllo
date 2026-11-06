import { createContext, useContext } from 'react'
import type { AuthSession, PublicUser } from './auth-api'

/** TanStack Query cache key for the signed-in user's profile (GET /auth/me). */
export const ME_QUERY_KEY = ['auth', 'me'] as const

export type SessionStatus = 'loading' | 'signedIn' | 'signedOut' | 'error'

export interface SessionValue {
  status: SessionStatus
  user: PublicUser | null
  /** Call with the API's response after a successful login or sign-up. */
  signIn: (session: AuthSession) => void
  signOut: () => void
  /** After a failed session check (e.g. server unreachable), try again. */
  retry: () => void
}

export const SessionContext = createContext<SessionValue | null>(null)

export function useSession(): SessionValue {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession must be used inside <SessionProvider>')
  return value
}

/** For screens behind <RequireAuth>: the user is guaranteed to exist there. */
export function useCurrentUser(): PublicUser {
  const { user } = useSession()
  if (!user) throw new Error('useCurrentUser used outside a signed-in area')
  return user
}
