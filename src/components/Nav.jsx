'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/components/StoreProvider'
import { ArrowIcon } from '@/components/ui'

const LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Story', path: '/#story' },
  { label: 'How to Prepare', path: '/cooking' },
  { label: 'Contact', path: '/contact' },
]

export default function Nav() {
  const router = useRouter()
  const pathname = usePathname()
  const { cartCount, user, logout } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (path) => {
    setMenuOpen(false)
    if (path.startsWith('/#')) {
      if (pathname !== '/') {
        router.push('/')
        setTimeout(() => {
          document.getElementById(path.slice(2))?.scrollIntoView({ behavior: 'smooth' })
        }, 350)
      } else {
        document.getElementById(path.slice(2))?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    router.push(path)
  }

  const linkCls = (path) =>
    `relative text-sm font-medium transition-colors duration-150 after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-gold-500 after:transition-transform after:duration-200 ${
      pathname === path
        ? 'text-navy-600 after:scale-x-100'
        : 'text-charcoal-700/60 hover:text-navy-950 hover:after:scale-x-100'
    }`

  return (
    <nav
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-shadow duration-200 ${
        scrolled ? 'border-navy-600/10 shadow-[0_2px_16px_rgba(11,18,38,0.07)]' : 'border-navy-600/10'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-[72px]">

        {/* Logo */}
        <button
          onClick={() => go('/')}
          className="flex items-center gap-2 hover:opacity-85 transition-opacity"
          aria-label="Uncle Walt's Churros — home"
        >
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="font-bold text-lg tracking-tight text-navy-950">
            Uncle <span className="text-gold-600">Walt&apos;s</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <button key={link.path} className={linkCls(link.path)} onClick={() => go(link.path)}>
              {link.label}
            </button>
          ))}
        </div>

        {/* Right cluster */}
        <div className="hidden md:flex items-center gap-3.5">
          {user ? (
            <div className="flex items-center gap-3">
              {user.isAdmin && (
                <button
                  onClick={() => go('/admin')}
                  className="text-[12px] font-semibold uppercase tracking-wider text-navy-600/70 hover:text-gold-600 transition-colors"
                >
                  Admin <ArrowIcon dir="upRight" size={11} className="ml-0.5" />
                </button>
              )}
              <div className="flex items-center gap-2.5 pl-3.5 border-l border-navy-600/10">
                <button
                  onClick={logout}
                  className="text-[12px] font-medium text-charcoal-700/45 hover:text-charcoal-700 transition-colors"
                >
                  Log out
                </button>
                <div className="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center text-[12px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => go('/login')}
              className="text-sm font-medium text-charcoal-700/60 hover:text-navy-950 transition-colors"
            >
              Account
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => go('/cart')}
            aria-label={`Cart, ${cartCount} items`}
            className="relative inline-flex items-center gap-2 bg-navy-600 hover:bg-navy-950 text-white text-sm font-semibold pl-4 pr-4 h-10 rounded-full transition-colors duration-150"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-navy-950 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center leading-none ring-2 ring-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => go('/cart')}
            className="relative w-10 h-10 rounded-full bg-navy-600 text-white flex items-center justify-center"
            aria-label={`Cart, ${cartCount} items`}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-navy-950 text-[10px] font-bold rounded-full min-w-[17px] h-[17px] px-1 flex items-center justify-center leading-none ring-2 ring-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="w-10 h-10 rounded-full border border-navy-600/15 text-navy-600 flex items-center justify-center hover:bg-navy-600/5 transition-colors"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {menuOpen
                ? (<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>)
                : (<><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>)
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-navy-600/10 px-5 pb-6 pt-3 flex flex-col gap-1">
          {LINKS.map((link) => (
            <button
              key={link.path}
              className={`text-left text-[15px] py-3 border-b border-navy-600/5 transition-colors ${
                pathname === link.path ? 'text-navy-600 font-semibold' : 'text-charcoal-700/70 hover:text-navy-950'
              }`}
              onClick={() => go(link.path)}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 flex flex-col gap-2.5">
            {user ? (
              <>
                {user.isAdmin && (
                  <button className="text-left text-sm font-semibold text-navy-600 flex items-center" onClick={() => go('/admin')}>
                    Admin Dashboard <ArrowIcon dir="upRight" size={13} className="ml-1" />
                  </button>
                )}
                <button className="text-left text-sm font-medium text-charcoal-700/45 hover:text-charcoal-700" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <button className="text-left text-sm font-medium text-charcoal-700/70 hover:text-navy-950" onClick={() => go('/login')}>
                Account · Log in / Sign up
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
