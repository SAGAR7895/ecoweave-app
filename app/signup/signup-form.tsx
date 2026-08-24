'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { signup, type AuthState } from '@/app/auth/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Creating Account…' : 'Create Account'}
    </button>
  )
}

export default function SignupForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(signup, null)

  // Signup ho gaya — ab email confirm karna hai
  if (state?.success) {
    return (
      <>
        <div className="msg msg-ok">{state.success}</div>
        <p className="auth-sub">
          Didn&apos;t receive the email? Check your spam folder. The link is
          valid for 24 hours.
        </p>
        <Link href="/login" className="btn btn-ghost">
          Go to Login page
        </Link>
      </>
    )
  }

  return (
    <form action={formAction} noValidate>
      {state?.error && <div className="msg msg-error">{state.error}</div>}

      <div className="field">
        <label htmlFor="full_name">Full Name</label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          defaultValue={state?.values?.full_name ?? ''}
          placeholder="Aarav Sharma"
          required
        />
      </div>

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
        <label htmlFor="phone">Phone (optional)</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          defaultValue={state?.values?.phone ?? ''}
          placeholder="9876543210"
        />
        <p className="field-hint">
          For order updates. 10 digits, without +91.
        </p>
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="confirm_password">Confirm Password</label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
        />
      </div>

      <SubmitButton />

      <p className="auth-alt">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </form>
  )
}
