import { useId, type InputHTMLAttributes } from 'react'
import { cx } from '../../lib/cx'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/** Labelled pill input. The focused field gets a brand-blue border; errors turn it coral. */
export function TextField({ label, error, className, ...input }: TextFieldProps) {
  // useId gives a unique, stable id so <label htmlFor> and aria-describedby point at the right element.
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[13px] font-bold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(
          'h-12 w-full rounded-full border-[1.5px] bg-white px-5 text-[15px] text-syllo-ink',
          'placeholder:text-syllo-faint transition-[border-color,box-shadow] duration-150',
          'focus:outline-none focus-visible:outline-none',
          error
            ? 'border-noshow focus:ring-2 focus:ring-noshow/40'
            : 'border-syllo-border-soft focus:border-syllo-brand focus:ring-2 focus:ring-syllo-brand',
        )}
        {...input}
      />
      {error && (
        <p id={errorId} className="pl-5 text-[13px] font-semibold text-noshow-ink">
          {error}
        </p>
      )}
    </div>
  )
}
