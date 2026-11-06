import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'

export interface SegmentOption<T extends string> {
  value: T
  label: ReactNode
}

interface SegmentedTabsProps<T extends string> {
  options: ReadonlyArray<SegmentOption<T>>
  value: T
  onChange: (value: T) => void
  /** Describes the group for screen readers, e.g. "Request status". */
  label: string
  className?: string
}

/**
 * Pill track with one selected segment (Pending / Approved…, Week / Month, Sep / Oct / Nov).
 * Generic over T so `value` and `onChange` are typed to exactly the options passed in.
 * Controlled: the parent owns the selected value; this component only reports clicks.
 */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cx('inline-flex flex-none gap-1 rounded-full bg-syllo-tint p-[5px]', className)}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              'flex-none rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-colors duration-150',
              active
                ? 'bg-white font-bold shadow-[0_0_0_2px_var(--color-syllo-ink),2px_2px_0_2px_var(--color-syllo-ink)]'
                : 'font-semibold text-syllo-text-2 hover:bg-white/50',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
