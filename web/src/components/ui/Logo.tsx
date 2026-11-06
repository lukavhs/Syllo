import { Check } from 'lucide-react'

interface LogoProps {
  /** Font size in px: 30 in the sidebar, 34 on sign-up. */
  size?: number
}

/**
 * "Tick-o" wordmark: "syll" + a checked circle standing in for the "o".
 * Everything inside is sized in `em`, so the whole logo scales from one font-size.
 */
export function Logo({ size = 30 }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Syllo"
      className="inline-flex items-baseline font-display font-semibold tracking-[-0.02em] text-syllo-ink"
      style={{ fontSize: size, lineHeight: 1 }}
    >
      <span aria-hidden>syll</span>
      <span
        aria-hidden
        className="ml-[0.03em] inline-flex size-[0.85em] translate-y-[0.12em] items-center justify-center self-center rounded-full border-[3px] border-syllo-ink bg-white"
      >
        <Check strokeWidth={3.5} className="size-[0.5em]" />
      </span>
    </span>
  )
}
