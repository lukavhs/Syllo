import { cx } from '../../lib/cx'
import { statusStyles, type DisplayStatus } from './status'

interface StatusChipProps {
  status: DisplayStatus
  className?: string
}

/** Pill with a 7px colored dot + label, e.g. "● Completed". */
export function StatusChip({ status, className }: StatusChipProps) {
  const s = statusStyles[status]
  return (
    <span
      className={cx(
        'inline-flex flex-none items-center gap-1.5 rounded-full px-2.5 py-1',
        'text-[13px] font-semibold whitespace-nowrap',
        s.soft,
        s.ink,
        className,
      )}
    >
      <span className={cx('size-[7px] flex-none rounded-full', s.dot)} aria-hidden />
      {s.label}
    </span>
  )
}
