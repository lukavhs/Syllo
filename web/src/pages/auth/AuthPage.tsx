import { useMutation } from '@tanstack/react-query'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import type { SignInRedirectState } from '../../app/RequireAuth'
import { FullScreenStatus } from '../../components/layout/FullScreenStatus'
import { Button } from '../../components/ui/Button'
import { Logo } from '../../components/ui/Logo'
import { SegmentedTabs } from '../../components/ui/SegmentedTabs'
import { TextField } from '../../components/ui/TextField'
import { ApiError } from '../../lib/api'
import { authApi, type AuthSession } from '../../lib/auth-api'
import { useSession } from '../../lib/session'

type Mode = 'signin' | 'register'

const modePaths: Record<Mode, string> = { signin: '/signin', register: '/register' }

/** Screen 12: split layout. Brand panel on the left, Sign in / Register a center on the right. */
export function AuthPage({ mode }: { mode: Mode }) {
  const { status, signIn } = useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as SignInRedirectState | null)?.from ?? '/dashboard'

  // Already signed in (or just finished signing in): go where the user was heading.
  if (status === 'signedIn') return <Navigate to={redirectTo} replace />
  if (status === 'loading') return <FullScreenStatus variant="loading" />

  return (
    <div className="flex min-h-screen">
      <BrandPanel />

      <div className="flex w-full flex-none flex-col bg-syllo-canvas px-4 py-12 sm:px-[72px] lg:w-[600px] lg:pt-[108px]">
        <div className="mx-auto w-full max-w-[456px]">
          <div className="mb-8 lg:hidden">
            <Logo size={34} />
          </div>

          <SegmentedTabs
            label="Sign in or register"
            value={mode}
            // Keep location.state so "return to the page you asked for" survives switching tabs.
            onChange={(next) => navigate(modePaths[next], { replace: true, state: location.state })}
            options={[
              { value: 'signin', label: 'Sign in' },
              { value: 'register', label: 'Register a center' },
            ]}
          />

          {mode === 'signin' ? <SignInForm onSuccess={signIn} /> : <RegisterForm onSuccess={signIn} />}
        </div>
      </div>
    </div>
  )
}

function BrandPanel() {
  return (
    <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-syllo-brand p-16 lg:flex">
      {/* Decorative circles */}
      <div aria-hidden className="absolute top-20 right-10 size-[300px] rounded-full bg-syllo-pink-soft" />
      <div aria-hidden className="absolute top-[120px] right-[90px] size-[120px] rounded-full bg-syllo-canvas" />
      <div aria-hidden className="absolute top-[500px] -right-[380px] size-[760px] rounded-full bg-syllo-brand-deep" />

      <div className="relative">
        <Logo size={34} />
      </div>
      <div className="relative max-w-[540px]">
        <h1 className="font-display text-[60px] leading-[1.05] font-medium">
          Every lesson marked. Every payment counted.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-syllo-ink-on-brand-muted">
          Schedules, attendance, change requests and monthly pay for your tutoring center.
        </p>
      </div>
    </div>
  )
}

// ───────────── Forms ─────────────

interface FormProps {
  onSuccess: (session: AuthSession) => void
}

/** Reads a text field from a submitted form (uncontrolled inputs: the DOM holds the values). */
function text(form: FormData, name: string): string {
  const value = form.get(name)
  return typeof value === 'string' ? value : ''
}

function SignInForm({ onSuccess }: FormProps) {
  const login = useMutation({ mutationFn: authApi.login, onSuccess })
  const error = login.error instanceof ApiError ? login.error : null

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    login.mutate({ email: text(form, 'email'), password: text(form, 'password') })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
      <FormHeading title="Welcome back" subtitle="Sign in to your center." />
      <TextField label="Email" name="email" type="email" autoComplete="email" required error={error?.fieldErrors.email} />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={error?.fieldErrors.password}
      />
      <FormError error={error} />
      <SubmitButton pending={login.isPending} label="Sign in" pendingLabel="Signing in…" />
    </form>
  )
}

function RegisterForm({ onSuccess }: FormProps) {
  const register = useMutation({ mutationFn: authApi.registerCenter, onSuccess })
  const error = register.error instanceof ApiError ? register.error : null

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    register.mutate({
      centerName: text(form, 'centerName'),
      name: text(form, 'name'),
      email: text(form, 'email'),
      phone: text(form, 'phone') || undefined, // optional: send nothing rather than ""
      password: text(form, 'password'),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
      <FormHeading
        title="Set up your center"
        subtitle="You'll be its admin. Invite tutors and assistants once you're in."
      />
      <TextField
        label="Center name"
        name="centerName"
        autoComplete="organization"
        required
        maxLength={100}
        error={error?.fieldErrors.centerName}
      />
      <TextField label="Your name" name="name" autoComplete="name" required maxLength={100} error={error?.fieldErrors.name} />
      <TextField label="Email" name="email" type="email" autoComplete="email" required error={error?.fieldErrors.email} />
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+20 100 555 0192"
        maxLength={30}
        error={error?.fieldErrors.phone}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={72}
        placeholder="At least 8 characters"
        error={error?.fieldErrors.password}
      />
      <FormError error={error} />
      <SubmitButton pending={register.isPending} label="Create center" pendingLabel="Creating your center…" />
    </form>
  )
}

function FormHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-1">
      <h2 className="font-display text-[34px] leading-tight font-medium">{title}</h2>
      <p className="mt-1 text-sm text-syllo-muted">{subtitle}</p>
    </div>
  )
}

/** Errors that don't belong to one field: wrong password, email taken, server unreachable. */
function FormError({ error }: { error: ApiError | null }) {
  if (!error) return null
  return (
    <p role="alert" className="rounded-2xl bg-noshow-soft px-4 py-3 text-sm font-semibold text-noshow-ink">
      {error.message}
    </p>
  )
}

function SubmitButton({ pending, label, pendingLabel }: { pending: boolean; label: string; pendingLabel: string }) {
  return (
    <Button type="submit" disabled={pending} className="mt-2 w-full justify-center py-3.5 text-[15px]">
      {pending ? pendingLabel : label}
    </Button>
  )
}
