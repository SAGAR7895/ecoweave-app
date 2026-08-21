import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import JoinForm from './join-form'

export const metadata: Metadata = {
  title: 'Join the Artisan Platform — EcoWeave®',
}

export default async function JoinPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // middleware already guard karta hai, ye double safety hai
  if (!user) redirect('/login?next=/join')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', user.id)
    .single()

  // Pehle se application di hui hai to dashboard bhej do
  const { data: existing } = await supabase
    .from('artisan_applications')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) redirect('/dashboard')

  return (
    <main className="auth-wrap woven">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <Link href="/" className="auth-logo">
          Eco<em>Weave</em>
          <sup>®</sup>
        </Link>

        <div className="auth-tag">The Artisan Platform</div>
        <h1>
          Your craft,
          <br />
          <em>a better price.</em>
        </h1>
        <p className="auth-sub">
          Weavers working on CiCLO® certified fabric earn more than they do on
          commodity polyester. Fill in the form and we&apos;ll get in touch.
        </p>

        <JoinForm
          defaultName={profile?.full_name ?? ''}
          defaultPhone={profile?.phone ?? ''}
        />

        <Link href="/dashboard" className="auth-back">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  )
}
