'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { signup, verifySignupOtp, type AuthState } from '@/app/auth/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Creating Account…' : 'Create Account'}
    </button>
  )
}

function VerifyButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Verifying…' : 'Verify OTP'}
    </button>
  )
}

export default function SignupForm() {
  const [signupState, signupAction] = useActionState<AuthState, FormData>(signup, null)
  const [otpState, otpAction] = useActionState<AuthState, FormData>(verifySignupOtp, null)

  // Is we are in OTP step? (Either signup succeeded OR we attempted OTP and got an error)
  const isOtpStep = signupState?.success || otpState?.error || otpState?.success

  // We need the email to verify the OTP
  const email = otpState?.values?.email || signupState?.values?.email || ''

  if (isOtpStep) {
    return (
      <form action={otpAction} noValidate>
        {signupState?.success && !otpState?.error && (
          <div className="msg msg-ok">{signupState.success}</div>
        )}
        {otpState?.error && (
          <div className="msg msg-error">{otpState.error}</div>
        )}

        <input type="hidden" name="email" value={email} />

        <div className="field">
          <label htmlFor="otp">Enter 6-digit OTP</label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="123456"
            autoComplete="one-time-code"
            required
          />
        </div>

        <VerifyButton />

        <p className="auth-alt" style={{ marginTop: '1rem' }}>
          <Link href="/login">Cancel & go to Login</Link>
        </p>
      </form>
    )
  }

  return (
    <form action={signupAction} noValidate>
      {signupState?.error && <div className="msg msg-error">{signupState.error}</div>}

      <div className="field">
        <label htmlFor="full_name">Full Name</label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          defaultValue={signupState?.values?.full_name ?? ''}
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
          defaultValue={signupState?.values?.email ?? ''}
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
          defaultValue={signupState?.values?.phone ?? ''}
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
