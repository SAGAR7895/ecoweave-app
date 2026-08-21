import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/auth/actions'

export const metadata: Metadata = {
  title: 'Dashboard — EcoWeave®',
}

const STATUS_TEXT: Record<string, { cls: string; label: string }> = {
  pending: {
    cls: 'msg-info',
    label: '⏳ Your application is under review. We’ll be in touch soon.',
  },
  approved: {
    cls: 'msg-ok',
    label: '✓ Application approved! You are now an EcoWeave artisan partner.',
  },
  rejected: {
    cls: 'msg-error',
    label: 'This application did not move forward. You may reapply later.',
  },
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ applied?: string }>
}) {
  const { applied } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, role')
    .eq('id', user.id)
    .single()

  const { data: application } = await supabase
    .from('artisan_applications')
    .select('status, cluster, craft_type, created_at')
    .eq('user_id', user.id)
    .maybeSingle()

  const role = profile?.role ?? 'customer'
  const status = application ? STATUS_TEXT[application.status] : null

  return (
    <main className="auth-wrap woven">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <Link href="/" className="auth-logo">
          Eco<em>Weave</em>
          <sup>®</sup>
        </Link>

        <div className="auth-tag">
          {role === 'admin'
            ? 'Admin'
            : role === 'artisan'
              ? 'Artisan Partner'
              : 'My Account'}
        </div>
        <h1>
          Welcome,
          <br />
          <em>{profile?.full_name || user.email}</em>
        </h1>
        <p className="auth-sub">{user.email}</p>

        {applied === '1' && (
          <div className="msg msg-ok">
            Application received. You can track its status below.
          </div>
        )}

        {/* ── Artisan application status ── */}
        {application && status ? (
          <div className={`msg ${status.cls}`}>
            <strong>Artisan Application</strong>
            <br />
            {status.label}
            <br />
            <span style={{ fontSize: '.75rem', opacity: 0.85 }}>
              {application.cluster} · {application.craft_type}
            </span>
          </div>
        ) : (
          role !== 'admin' && (
            <div className="msg msg-info">
              <strong>Are you a weaver?</strong>
              <br />
              Join the artisan platform to receive CiCLO® certified orders.
            </div>
          )
        )}

        {/* ── Actions ── */}
        <div style={{ display: 'grid', gap: '.7rem', marginTop: '1.5rem' }}>
          {!application && role !== 'admin' && (
            <Link href="/join" className="btn btn-sage">
              Join the Artisan Platform
            </Link>
          )}

          {role === 'admin' && (
            <Link href="/admin" className="btn btn-primary">
              Admin Panel
            </Link>
          )}

          <Link href="/" className="btn btn-ghost">
            Browse the Shop
          </Link>

          <form action={logout}>
            <button type="submit" className="btn btn-ghost">
              Log Out
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
