import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import type { Role } from '../generated/prisma/enums'
import { useCurrentUser } from '../lib/session'

interface RequireRoleProps {
  roles: readonly Role[]
  children: ReactNode
}

/** Renders the page only for allowed roles; anyone else is sent back to their dashboard. */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const user = useCurrentUser()
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}
