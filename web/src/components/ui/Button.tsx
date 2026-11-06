import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../../lib/cx'

type ButtonVariant = 'primary' | 'secondary'

const variants: Record<ButtonVariant, string> = {
  // Pressing slides the button 2px toward its shadow while the shadow shrinks,
  // so it looks physically pushed into the page.
  primary: cx(
    'bg-syllo-brand text-syllo-ink-on-brand shadow-sticker-sm',
    'hover:bg-syllo-brand-deep',
    'active:translate-x-0.5 active:translate-y-0.5 active:shadow-sticker-xs',
  ),
  secondary: 'bg-white text-syllo-ink hover:bg-syllo-canvas',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: LucideIcon
}

export function Button({
  variant = 'primary',
  icon: Icon,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex flex-none items-center gap-2 rounded-full border-2 border-syllo-ink',
        'px-5 py-2.5 text-sm font-bold whitespace-nowrap',
        'transition-[background-color,translate,box-shadow] duration-150',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {Icon && <Icon size={16} strokeWidth={2.25} aria-hidden />}
      {children}
    </button>
  )
}
