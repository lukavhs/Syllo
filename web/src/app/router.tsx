import type { ReactNode } from 'react'
import { Navigate, createBrowserRouter, type RouteObject } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout'
import { EVERYONE_ROLES, pageKeys, pages, type PageKey } from './pages'
import { RequireAuth } from './RequireAuth'
import { RequireRole } from './RequireRole'
import { AuthPage } from '../pages/auth/AuthPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { UiKitPage } from '../pages/dev/UiKitPage'

/**
 * The screen for each registry page. Typed as Record<PageKey, …>, so adding a page to
 * `pages.ts` without giving it a screen here is a compile error.
 * Placeholders get swapped for real screens as each one is built.
 */
const screens: Record<PageKey, ReactNode> = {
  dashboard: <PlaceholderPage title="Dashboard" />,
  requests: <PlaceholderPage title="Change requests" />,
  students: <PlaceholderPage title="Students" />,
  tutors: <PlaceholderPage title="Tutors" />,
  assign: <PlaceholderPage title="Assign a student" />,
  payments: <PlaceholderPage title="Payments" />,
  analytics: <PlaceholderPage title="Analytics" />,
  settings: <PlaceholderPage title="Settings" />,
  calendar: <PlaceholderPage title="Calendar" />,
  availability: <PlaceholderPage title="My availability" />,
  earnings: <PlaceholderPage title="My earnings" />,
}

// One guarded route per registry page: the same `roles` list that hides the nav item
// also blocks typing the URL directly.
const pageRoutes: RouteObject[] = pageKeys.map((key) => ({
  path: pages[key].path,
  element: <RequireRole roles={pages[key].roles}>{screens[key]}</RequireRole>,
}))

const routes: RouteObject[] = [
  {
    // Layout route: no path of its own; renders the sidebar frame around its children.
    // RequireAuth wraps it, so every page inside needs a signed-in user.
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      ...pageRoutes,
      {
        path: '/lessons/:lessonId',
        element: (
          <RequireRole roles={EVERYONE_ROLES}>
            <PlaceholderPage title="Lesson detail" />
          </RequireRole>
        ),
      },
    ],
  },
  // Outside the layout: no sidebar.
  { path: '/signin', element: <AuthPage mode="signin" /> },
  { path: '/register', element: <AuthPage mode="register" /> },
  ...(import.meta.env.DEV ? [{ path: '/dev/ui', element: <UiKitPage /> }] : []),
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]

export const router = createBrowserRouter(routes)
