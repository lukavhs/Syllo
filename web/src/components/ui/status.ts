/**
 * How a lesson/attendance looks on screen. This is a UI-only concept, not a copy of a
 * Prisma enum: it is *derived* from several fields. For example "needsMarking" is a
 * PENDING attendance whose lesson is already over, and "changePending" is a lesson with
 * an open ChangeRequest. The mapping from API data lives with the API client.
 */
export type DisplayStatus =
  | 'completed'
  | 'noShow'
  | 'needsMarking'
  | 'changePending'
  | 'scheduled'
  | 'canceled'

interface StatusStyle {
  label: string
  /** Tinted background */
  soft: string
  /** Text color */
  ink: string
  /** Dot / solid fill */
  dot: string
  /** Left border for calendar blocks and lesson rows */
  bar: string
}

// Full class names are written out (never built like `bg-${name}`), because Tailwind
// finds classes by scanning source text and can't see strings assembled at runtime.
export const statusStyles: Record<DisplayStatus, StatusStyle> = {
  completed: {
    label: 'Completed',
    soft: 'bg-completed-soft',
    ink: 'text-completed-ink',
    dot: 'bg-completed',
    bar: 'border-completed',
  },
  noShow: {
    label: 'No-show',
    soft: 'bg-noshow-soft',
    ink: 'text-noshow-ink',
    dot: 'bg-noshow',
    bar: 'border-noshow',
  },
  needsMarking: {
    label: 'Needs marking',
    soft: 'bg-unmarked-soft',
    ink: 'text-unmarked-ink',
    dot: 'bg-unmarked',
    bar: 'border-unmarked',
  },
  changePending: {
    label: 'Change pending',
    soft: 'bg-pending-soft',
    ink: 'text-pending-ink',
    dot: 'bg-pending',
    bar: 'border-pending',
  },
  scheduled: {
    label: 'Scheduled',
    soft: 'bg-scheduled-soft',
    ink: 'text-scheduled-ink',
    dot: 'bg-scheduled',
    bar: 'border-scheduled',
  },
  canceled: {
    label: 'Canceled',
    soft: 'bg-canceled-soft',
    ink: 'text-canceled-ink line-through',
    dot: 'bg-canceled',
    bar: 'border-canceled',
  },
}
