'use client'

import Link from 'next/link'
import { useState } from 'react'

const LINKS = [
  ['#crisis', 'The Crisis'],
  ['#solution', 'CiCLO®'],
  ['#products', 'Shop'],
  ['#platform', 'Artisans'],
  ['#impact', 'Impact'],
  ['#sutradhar', 'Sutradhar'],
  ['#duo', 'The Duo'],
  ['#founder', 'Founder'],
  ['#jiwarajka', 'Jiwarajka'],
] as const

export default function SiteNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <nav>
      <Link href="/" className="nl" onClick={close}>
        Eco<em>Weave</em>
        <sup>®</sup>
      </Link>

      <ul className={open ? 'nav-open' : undefined}>
        {LINKS.map(([href, label]) => (
          <li key={href}>
            <a href={href} onClick={close}>
              {label}
            </a>
          </li>
        ))}
        <li>
          <Link
            href={isLoggedIn ? '/dashboard' : '/login'}
            style={{ color: 'var(--terra)' }}
            onClick={close}
          >
            {isLoggedIn ? 'My Account ↗' : 'Log In ↗'}
          </Link>
        </li>
      </ul>

      <div className="nav-right">
        <Link href={isLoggedIn ? '/dashboard' : '/join'} className="nc">
          {isLoggedIn ? 'Dashboard' : 'Join Platform'}
        </Link>

        {/* Mobile hamburger — 900px se neeche dikhta hai */}
        <button
          type="button"
          className="nav-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={open ? 'burger-x' : undefined} />
          <span className={open ? 'burger-x' : undefined} />
          <span className={open ? 'burger-x' : undefined} />
        </button>
      </div>
    </nav>
  )
}
