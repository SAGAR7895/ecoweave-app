import type { Metadata } from 'next'
import Link from 'next/link'

import { requireAdmin } from '@/lib/admin'
import { logout } from '@/app/auth/actions'
import AdminNav from './admin-nav'

export const metadata: Metadata = {
  title: 'Admin — EcoWeave®',
}

/**
 * Layout mein guard lagane ka matlab: /admin ke neeche har page
 * apne aap suraksha ke andar hai. Naya page banate waqt check
 * lagana bhool jana mumkin nahi rehta.
 *
 * Actions apna check khud bhi karti hain — layout render karna
 * request rokne ka boundary nahi hai.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await requireAdmin()

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-top-left">
          <Link href="/" className="adm-logo">
            Eco<em>Weave</em>
            <sup>®</sup>
          </Link>
          <span className="adm-badge">Admin Portal</span>
        </div>

        <AdminNav />

        <div className="adm-top-right">
          <span className="adm-who">{admin.fullName || admin.email}</span>
          <Link href="/" className="adm-link">
            View site ↗
          </Link>
          <form action={logout}>
            <button type="submit" className="adm-link adm-link-btn">
              Log out
            </button>
          </form>
        </div>
      </header>

      <main className="adm-main">{children}</main>
    </div>
  )
}
