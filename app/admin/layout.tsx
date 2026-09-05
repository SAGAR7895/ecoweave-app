import type { Metadata } from 'next'
import Link from 'next/link'

import { requireAdmin } from '@/lib/admin'
import { logout } from '@/app/auth/actions'
import AdminNav from './admin-nav'

export const metadata: Metadata = {
  title: 'Admin — EcoWeave®',
}

/**
 * Guarding in the layout means every page under /admin is covered by
 * default, so a page added later cannot be the one where somebody
 * forgot to add the check.
 *
 * The actions check again on their own. Rendering a layout is not a
 * boundary that stops a request.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await requireAdmin()

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-side-head">
          <Link href="/" className="adm-logo">
            Eco<em>Weave</em>
            <sup>®</sup>
          </Link>
          <span className="adm-badge">Admin Portal</span>
        </div>

        <AdminNav />

        <div className="adm-side-foot">
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
      </aside>

      <main className="adm-main">{children}</main>
    </div>
  )
}
