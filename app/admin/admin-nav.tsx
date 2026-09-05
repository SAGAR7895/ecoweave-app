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
        // startsWith se /admin/products/<id> pe bhi "Products" active
        // rehta hai. Sirf === hota to edit page pe koi bhi tab
        // highlight na hoti aur lagta ki aap panel se bahar aa gaye.
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
