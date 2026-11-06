import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'

/**
 * Page frame for every signed-in screen: fixed sidebar + a main area that scrolls on its own.
 * The outer box is exactly the viewport height with overflow hidden, so only <main> scrolls
 * and the sidebar never moves. <Outlet /> is where React Router renders the matched child page.
 */
export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* TODO: real count from the change-requests API */}
      <Sidebar badges={{ requests: 4 }} />
      <main className="min-w-0 flex-1 overflow-y-auto px-10 py-9">
        <Outlet />
      </main>
    </div>
  )
}
