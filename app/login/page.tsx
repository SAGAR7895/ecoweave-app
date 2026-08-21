import Link from 'next/link'
import type { Metadata } from 'next'
import LoginForm from './login-form'

export const metadata: Metadata = {
  title: 'Log In — EcoWeave®',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return (
    <main className="auth-wrap woven">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          Eco<em>Weave</em>
          <sup>®</sup>
        </Link>

        <div className="auth-tag">Welcome Back</div>
        <h1>
          Welcome back to
          <br />
          <em>your account.</em>
        </h1>
        <p className="auth-sub">
          Track your orders, explore the artisan platform, or check the status
          of your application.
        </p>

        <LoginForm next={next ?? '/dashboard'} />

        <Link href="/" className="auth-back">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
