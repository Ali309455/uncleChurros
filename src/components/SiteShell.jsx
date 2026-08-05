'use client'

import { usePathname } from 'next/navigation'
import Nav from '@/components/Nav'

const NAV_HIDDEN = new Set(['/admin', '/login', '/signup'])

export default function SiteShell({ children }) {
  const pathname = usePathname()
  const hideNav = NAV_HIDDEN.has(pathname)

  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-sans)' }}>
      {!hideNav && <Nav />}
      {children}
    </div>
  )
}
