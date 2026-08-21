import Link from 'next/link'
import type { Metadata } from 'next'
import SignupForm from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Up — EcoWeave®',
}

export default function SignupPage() {
  return (
    <main className="auth-wrap woven">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          Eco<em>Weave</em>
          <sup>®</sup>
        </Link>

        <div className="auth-tag">Join EcoWeave</div>
        <h1>
          One account,
          <br />
          <em>entire platform.</em>
        </h1>
        <p className="auth-sub">
          Shop for products, or join the artisan platform as a weaver —
          both with a single account.
        </p>

        <SignupForm />

        <Link href="/" className="auth-back">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
