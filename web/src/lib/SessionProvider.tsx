import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { setUnauthorizedHandler, tokenStore } from './api'
import { authApi, type AuthSession } from './auth-api'
import { ME_QUERY_KEY, SessionContext, type SessionStatus, type SessionValue } from './session'

/**
 * Who's signed in, for the whole app.
 *
 * On load: if a token is stored, ask GET /auth/me whether it's still good. The answer is
 * cached by TanStack Query under ME_QUERY_KEY. The token itself is only "probably valid"
 * until the server confirms it, hence the 'loading' state.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState(() => tokenStore.get())

  const me = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: authApi.me,
    enabled: token !== null,
    staleTime: Infinity, // our own profile doesn't change behind our back
  })

  const signOut = useCallback(() => {
    tokenStore.clear()
    queryClient.clear() // drop every cached response; the next user must not see them
    setToken(null)
  }, [queryClient])

  const signIn = useCallback(
    (session: AuthSession) => {
      tokenStore.set(session.accessToken)
      // Login already returned the user, so prime the cache instead of refetching /auth/me.
      queryClient.setQueryData(ME_QUERY_KEY, session.user)
      setToken(session.accessToken)
    },
    [queryClient],
  )

  // Any API call that gets a 401 with our token signs us out.
  useEffect(() => {
    setUnauthorizedHandler(signOut)
    return () => setUnauthorizedHandler(null)
  }, [signOut])

  const status: SessionStatus =
    token === null ? 'signedOut' : me.data ? 'signedIn' : me.isError ? 'error' : 'loading'

  const value = useMemo<SessionValue>(
    () => ({
      status,
      user: status === 'signedIn' ? (me.data ?? null) : null,
      signIn,
      signOut,
      retry: () => void me.refetch(),
    }),
    [status, me, signIn, signOut],
  )

  return <SessionContext value={value}>{children}</SessionContext>
}
