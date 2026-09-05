import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'
import { CATEGORY_LABELS, CATEGORIES } from '@/lib/products'

export default async function AdminHome() {
  const supabase = await createClient()

  const [{ count: productCount }, { count: draftCount }, { count: userCount }, { count: pendingCount }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', false),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase
        .from('artisan_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ])

  const { data: byCategory } = await supabase
    .from('products')
    .select('category')
    .eq('is_published', true)

  const counts = new Map<string, number>()
  for (const row of byCategory ?? []) {
    counts.set(row.category, (counts.get(row.category) ?? 0) + 1)
  }

  return (
    <>
      <div className="adm-head">
        <h1>Overview</h1>
      </div>

      <div className="adm-stats">
        <Link href="/admin/products" className="adm-stat">
          <span className="adm-stat-n">{productCount ?? 0}</span>
          <span className="adm-stat-l">Products</span>
        </Link>
        <Link href="/admin/products" className="adm-stat">
          <span className="adm-stat-n">{draftCount ?? 0}</span>
          <span className="adm-stat-l">Draft (shop pe nahi)</span>
        </Link>
        <Link href="/admin/users" className="adm-stat">
          <span className="adm-stat-n">{userCount ?? 0}</span>
          <span className="adm-stat-l">Users</span>
        </Link>
        <Link href="/admin/artisans" className="adm-stat">
          <span className="adm-stat-n">{pendingCount ?? 0}</span>
          <span className="adm-stat-l">Applications pending</span>
        </Link>
      </div>

      <div className="adm-card">
        <h2>Shop mein abhi</h2>
        <table className="adm-table">
          <tbody>
            {CATEGORIES.map((cat) => (
              <tr key={cat}>
                <td>{CATEGORY_LABELS[cat]}</td>
                <td className="adm-num">{counts.get(cat) ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="adm-hint">
          Sirf published products gine gaye hain — jo customer ko dikhte hain.
        </p>
      </div>
    </>
  )
}
