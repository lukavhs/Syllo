import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router'
import { canAccess, pageKeys, pages, roleLabels, type PageKey } from '../../app/pages'
import { cx } from '../../lib/cx'
import { useCurrentUser, useSession } from '../../lib/session'
import { Avatar } from '../ui/Avatar'
import { Logo } from '../ui/Logo'

interface SidebarProps {
  /** Count badges next to nav items, e.g. { requests: 4 }. */
  badges?: Partial<Record<PageKey, number>>
}

export function Sidebar({ badges = {} }: SidebarProps) {
  const user = useCurrentUser()
  const { signOut } = useSession()
  const visible = pageKeys.filter((key) => canAccess(user.role, key))

  return (
    <aside className="flex w-[232px] flex-none flex-col border-r-2 border-syllo-ink bg-syllo-brand px-[14px] pt-[26px] pb-[18px]">
      <div className="px-2">
        <Logo size={30} />
        <p className="mt-1 text-xs text-syllo-ink-on-brand-muted">{user.center.name}</p>
      </div>

      <nav aria-label="Main" className="mt-6 flex flex-col gap-1">
        {visible.map((key) => {
          const { path, label, icon: Icon } = pages[key]
          const badge = badges[key]
          return (
            <NavLink
              key={key}
              to={path}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm transition-colors duration-150',
                  isActive
                    ? 'bg-white font-bold shadow-[0_0_0_2px_var(--color-syllo-ink),3px_3px_0_2px_var(--color-syllo-ink)]'
                    : 'font-medium hover:bg-white/40',
                )
              }
            >
              <Icon size={18} aria-hidden />
              <span className="flex-1 whitespace-nowrap">{label}</span>
              {badge ? (
                <span className="flex h-6 min-w-6 flex-none items-center justify-center rounded-full border-2 border-syllo-ink bg-syllo-pink px-1.5 text-xs font-bold">
                  {badge}
                </span>
              ) : null}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-[20px] border-2 border-syllo-ink bg-white p-2.5 shadow-sticker-sm">
        <Avatar name={user.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-syllo-muted">{roleLabels[user.role]}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          title="Sign out"
          className="flex size-8 flex-none items-center justify-center rounded-full text-syllo-muted transition-colors hover:bg-syllo-canvas hover:text-syllo-ink"
        >
          <LogOut size={16} aria-hidden />
        </button>
      </div>
    </aside>
  )
}
