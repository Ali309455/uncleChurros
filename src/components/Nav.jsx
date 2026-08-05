'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useStore } from '@/components/StoreProvider'

export default function Nav() {
  const router = useRouter()
  const pathname = usePathname()
  const { cartCount, user, logout } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const go = (path) => {
    setMenuOpen(false)
    router.push(path)
  }

  const linkCls = (path) =>
    `text-sm font-medium transition-colors duration-150 ${pathname === path ? 'text-gold-400' : 'text-star-white/60 hover:text-star-white'}`

  return (
    <nav className="sticky top-0 z-50 bg-navy-950/96 backdrop-blur-md border-b border-star-white/5">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <button
          onClick={() => go('/')}
          className="flex items-center gap-2 text-star-white hover:opacity-85 transition-opacity"
          aria-label="Uncle Walt's Churros — home"
        >
          <img
            src="/logo.png"
            alt="Uncle Walt's Churros"
            className="h-9 w-9 object-contain"
          />
          <span className="font-bold text-lg tracking-tight">Uncle <span className="text-gold-400">Walt's</span></span>
        </button>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-7">
          <button className={linkCls('/shop')} onClick={() => go('/shop')}>Shop</button>
          <button className={linkCls('/cooking')} onClick={() => go('/cooking')}>Instructions</button>
          <button className={linkCls('/contact')} onClick={() => go('/contact')}>Contact</button>

          {/* Cart */}
          <button
            className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 ${pathname === '/cart' ? 'text-gold-400' : 'text-star-white/60 hover:text-star-white'}`}
            onClick={() => go('/cart')}
            aria-label={`Cart, ${cartCount} items`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-gold-500 text-navy-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Auth / User */}
          {user ? (
            <div className="flex items-center gap-3">
              {user.isAdmin && (
                <button
                  onClick={() => go('/admin')}
                  className="text-sm font-medium text-gold-400/80 hover:text-gold-400 transition-colors"
                >
                  Admin ↗
                </button>
              )}
              <div className="flex items-center gap-2 border-l border-star-white/10 pl-3">
                <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-[11px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button onClick={logout} className="text-[12px] text-star-white/40 hover:text-star-white/70 transition-colors">
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => go('/login')}
                className="text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-gold-500/25 text-gold-500/60 hover:text-gold-400 hover:border-gold-500/55 transition-all duration-150"
              >
                Admin
              </button>
              <button onClick={() => go('/login')} className="text-sm font-medium text-star-white/60 hover:text-star-white transition-colors">
                Log in
              </button>
              <button
                onClick={() => go('/signup')}
                className="text-sm font-semibold px-4 py-1.5 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 transition-all duration-150"
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex sm:hidden items-center gap-4">
          <button
            className="relative text-star-white/70"
            onClick={() => go('/cart')}
            aria-label={`Cart, ${cartCount} items`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gold-500 text-navy-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="text-star-white/70 hover:text-star-white transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
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
        <div className="sm:hidden bg-navy-950 border-t border-star-white/5 px-5 pb-6 pt-3 flex flex-col gap-4">
          <button className="text-left text-sm font-medium text-star-white/70 hover:text-star-white" onClick={() => go('/shop')}>Shop</button>
          <button className="text-left text-sm font-medium text-star-white/70 hover:text-star-white" onClick={() => go('/cart')}>
            Cart {cartCount > 0 && <span className="ml-1 bg-gold-500 text-navy-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
          </button>
          <button className="text-left text-sm font-medium text-star-white/70 hover:text-star-white" onClick={() => go('/contact')}>Contact</button>
          <button className="text-left text-sm font-medium text-star-white/70 hover:text-star-white" onClick={() => go('/cooking')}>Cooking Instructions</button>
          <div className="border-t border-star-white/8 pt-3 flex flex-col gap-3">
            {user ? (
              <>
                {user.isAdmin && (
                  <button className="text-left text-sm font-medium text-gold-400" onClick={() => go('/admin')}>Admin Dashboard ↗</button>
                )}
                <button className="text-left text-sm font-medium text-star-white/40 hover:text-star-white/70" onClick={logout}>Log out</button>
              </>
            ) : (
              <>
                <button className="text-left text-[11px] font-semibold uppercase tracking-widest text-gold-500/70" onClick={() => go('/login')}>Admin Panel</button>
                <button className="text-left text-sm font-medium text-star-white/70 hover:text-star-white" onClick={() => go('/login')}>Log in</button>
                <button className="text-left text-sm font-semibold text-gold-400" onClick={() => go('/signup')}>Sign up</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
