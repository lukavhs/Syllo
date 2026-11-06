import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: ReactNode
  eyebrow?: ReactNode
  subtitle?: ReactNode
  /** Buttons on the right, e.g. "Open calendar" + "Assign a student". */
  actions?: ReactNode
}

export function PageHeader({ title, eyebrow, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="flex items-end justify-between gap-6">
      <div className="min-w-0">
        {eyebrow && <p className="text-sm font-semibold text-syllo-muted">{eyebrow}</p>}
        <h1 className="font-display text-[40px] leading-[1.1] font-medium">{title}</h1>
        {subtitle && <p className="mt-1 text-syllo-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-none gap-3">{actions}</div>}
    </header>
  )
}
