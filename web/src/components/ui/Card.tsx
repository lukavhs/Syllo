import type { HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

type CardVariant = 'default' | 'dark' | 'tint'

const variants: Record<CardVariant, string> = {
  // White "sticker" card: navy border + hard navy shadow.
  default: 'bg-white border-2 border-syllo-ink shadow-sticker',
  // Dark feature card (revenue, pay totals): no border, pink shadow.
  dark: 'bg-syllo-ink text-white shadow-sticker-pink',
  // Tinted panel for secondary info: border, no shadow.
  tint: 'bg-syllo-tint border-2 border-syllo-ink',
}

interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant
  /** KPI tiles use the slightly smaller 24px radius. */
  shape?: 'card' | 'tile'
}

export function Card({ variant = 'default', shape = 'card', className, ...rest }: CardProps) {
  return (
    <section
      className={cx(
        'p-6',
        shape === 'card' ? 'rounded-card' : 'rounded-tile',
        variants[variant],
        className,
      )}
      {...rest}
    />
  )
}
