import { cx } from '../../lib/cx'

const palette = [
  'bg-avatar-1',
  'bg-avatar-2',
  'bg-avatar-3',
  'bg-avatar-4',
  'bg-avatar-5',
  'bg-avatar-6',
  'bg-avatar-7',
  'bg-avatar-8',
]

/** Same name → same color every time, on every screen (a tiny string hash). */
function colorFor(seed: string): string {
  let hash = 0
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return palette[hash % palette.length]
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

interface AvatarProps {
  name: string
  size?: number
  className?: string
}

export function Avatar({ name, size = 36, className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cx(
        'inline-flex flex-none items-center justify-center rounded-full font-bold text-white',
        colorFor(name),
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials(name)}
    </span>
  )
}
