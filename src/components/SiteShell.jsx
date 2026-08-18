'use client'

import { usePathname } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const NAV_HIDDEN = new Set(['/admin', '/login', '/signup'])

export default function SiteShell({ children }) {
  const pathname = usePathname()
  const hideNav = NAV_HIDDEN.has(pathname)

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-sans)' }}>
      {!hideNav && <Nav />}
      <main className="flex-1">{children}</main>
      {!hideNav && <Footer />}
    </div>
  )
}
