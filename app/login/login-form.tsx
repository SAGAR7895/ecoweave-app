'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { login, type AuthState } from '@/app/auth/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Logging in…' : 'Log In'}
    </button>
  )
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<AuthState, FormData>(login, null)

  return (
    <form action={formAction} noValidate>
      {state?.error && <div className="msg msg-error">{state.error}</div>}

      <input type="hidden" name="next" value={next} />

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state?.values?.email ?? ''}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      <SubmitButton />

      <p className="auth-alt">
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </form>
  )
}
