import type { LucideIcon } from 'lucide-react'
import {
  ArrowRightLeft,
  CalendarDays,
  ChartColumn,
  Clock,
  GraduationCap,
  LayoutDashboard,
  Settings,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react'
import { Role } from '../generated/prisma/enums'

export const EVERYONE_ROLES: readonly Role[] = [Role.ADMIN, Role.ASSISTANT, Role.TUTOR]
const EVERYONE = EVERYONE_ROLES
const STAFF: readonly Role[] = [Role.ADMIN, Role.ASSISTANT]
const ADMIN_ONLY: readonly Role[] = [Role.ADMIN]
const TUTOR_ONLY: readonly Role[] = [Role.TUTOR]

interface PageDef {
  path: string
  label: string
  icon: LucideIcon
  /** Who may open this page. Drives BOTH the sidebar and the route guard. */
  roles: readonly Role[]
}

/**
 * Single registry of the app's main pages. Order here = order in the sidebar
 * (after filtering by role). Prices, revenue and analytics are ADMIN_ONLY, per CLAUDE.md.
 *
 * Reminder: hiding a page here is only UX. The API must still reject the request
 * (role + center guards); the browser is never the real security boundary.
 */
export const pages = {
  dashboard: { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: EVERYONE },
  requests: { path: '/requests', label: 'Requests', icon: ArrowRightLeft, roles: STAFF },
  students: { path: '/students', label: 'Students', icon: GraduationCap, roles: STAFF },
  tutors: { path: '/tutors', label: 'Tutors', icon: Users, roles: STAFF },
  assign: { path: '/assign', label: 'Assign student', icon: UserPlus, roles: STAFF },
  payments: { path: '/payments', label: 'Payments', icon: Wallet, roles: ADMIN_ONLY },
  analytics: { path: '/analytics', label: 'Analytics', icon: ChartColumn, roles: ADMIN_ONLY },
  settings: { path: '/settings', label: 'Settings', icon: Settings, roles: ADMIN_ONLY },
  calendar: { path: '/calendar', label: 'Calendar', icon: CalendarDays, roles: TUTOR_ONLY },
  availability: { path: '/availability', label: 'Availability', icon: Clock, roles: TUTOR_ONLY },
  earnings: { path: '/earnings', label: 'My earnings', icon: Wallet, roles: TUTOR_ONLY },
} satisfies Record<string, PageDef>

export type PageKey = keyof typeof pages

export const pageKeys = Object.keys(pages) as PageKey[]

export function canAccess(role: Role, key: PageKey): boolean {
  return pages[key].roles.includes(role)
}

export const roleLabels: Record<Role, string> = {
  ADMIN: 'Admin',
  ASSISTANT: 'Assistant',
  TUTOR: 'Tutor',
}
