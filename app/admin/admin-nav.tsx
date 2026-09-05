'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  ['/admin/products', 'Products'],
  ['/admin/users', 'Users'],
  ['/admin/artisans', 'Artisans'],
] as const

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="adm-tabs">
      {TABS.map(([href, label]) => {
        // startsWith keeps "Products" lit on /admin/products/<id> too.
        // With === alone, no tab would be highlighted on an edit page
        // and it would feel like you had left the panel.
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href} className={active ? 'adm-tab active' : 'adm-tab'}>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
