import { useState } from 'react'
import type { Page, User } from '../App'

type Props = {
  setPage: (p: Page) => void
  login: (user: User) => void
  intendedAdmin?: boolean
}

const BG_STARS = Array.from({ length: 55 }, (_, i) => {
  const r = (n: number) => { const x = Math.sin(i * 13.7 + n) * 10000; return x - Math.floor(x) }
  return { x: r(1) * 100, y: r(2) * 100, size: r(3) > 0.75 ? 2.2 : r(3) > 0.45 ? 1.4 : 0.8, opacity: 0.15 + r(4) * 0.35, gold: i % 11 === 0 }
})

export default function Login({ setPage, login, intendedAdmin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const doLogin = (isAdmin: boolean, name: string, emailAddr: string) => {
    setLoading(true)
    setTimeout(() => login({ name, email: emailAddr, isAdmin }), 700)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.includes('@') || password.length < 6) {
      setError('Valid email and a password of at least 6 characters required.')
      return
    }
    const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('walt')
    doLogin(isAdmin, email.split('@')[0].replace(/[._]/g, ' '), email)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #080f20 0%, #0B1226 55%, #101d38 100%)' }}
    >
      {/* Star field */}
      {BG_STARS.map((s, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, backgroundColor: s.gold ? '#C9962C' : '#F8F7F2', opacity: s.opacity }} />
      ))}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(201,150,44,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <button onClick={() => setPage('home')} className="flex items-center gap-2">
            <span className="text-gold-500 text-2xl select-none" style={{ fontFamily: 'var(--font-display)' }}>✦</span>
            <span className="text-star-white text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Uncle Walt&apos;s</span>
          </button>
          <p className="text-star-white/35 text-[11px] uppercase tracking-[0.22em] mt-2">
            {intendedAdmin ? 'Admin access' : 'The magic awaits'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,150,44,0.12)' }}>

          {/* Gold top bar */}
          <div className="h-1 bg-gold-500 w-full" />

          <div className="bg-navy-800/90 backdrop-blur-xl p-8">
            <h1 className="text-star-white text-2xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {intendedAdmin ? 'Admin sign-in' : 'Welcome back'}
            </h1>
            <p className="text-star-white/40 text-[13px] mb-6">
              {intendedAdmin
                ? 'Sign in with an admin account to open the dashboard.'
                : 'Sign in to your account to continue.'}
            </p>

            {/* ── Demo quick-access buttons ── */}
            <div className="flex flex-col gap-2 mb-5">
              <p className="text-star-white/25 text-[10px] uppercase tracking-widest text-center">Quick demo access</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => doLogin(true, 'Walt Marquez', 'admin@unclewalts.com')}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/30 text-gold-400 font-medium text-[12px] py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Enter as Admin
                </button>
                <button
                  onClick={() => doLogin(false, 'Guest User', 'guest@example.com')}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 bg-star-white/5 hover:bg-star-white/10 border border-star-white/10 text-star-white/60 font-medium text-[12px] py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Enter as User
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-star-white/8" />
              <span className="text-star-white/20 text-[11px] uppercase tracking-wider">or sign in</span>
              <div className="flex-1 h-px bg-star-white/8" />
            </div>

            {/* Google */}
            <button
              onClick={() => doLogin(false, 'Google User', 'user@gmail.com')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium text-[14px] py-3 rounded-xl border border-gray-200 transition-all duration-150 mb-4 disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-1.5">
                <label className="text-star-white/50 text-[11px] font-semibold uppercase tracking-wider">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  className="w-full bg-navy-950/60 border border-star-white/10 rounded-xl px-4 py-3 text-star-white text-[14px] placeholder:text-star-white/20 outline-none focus:border-gold-500/50 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-star-white/50 text-[11px] font-semibold uppercase tracking-wider">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full bg-navy-950/60 border border-star-white/10 rounded-xl px-4 py-3 text-star-white text-[14px] placeholder:text-star-white/20 outline-none focus:border-gold-500/50 transition-colors" />
              </div>
              {error && (
                <p className="text-red-400 text-[12px] bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
              )}
              <button type="submit" disabled={loading}
                className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold py-3 rounded-xl transition-all duration-150">
                {loading ? 'Signing in…' : 'Log in'}
              </button>
            </form>

            <p className="text-star-white/30 text-[12px] text-center mt-5">
              No account?{' '}
              <button onClick={() => setPage('signup')} className="text-gold-500 hover:text-gold-400 font-medium transition-colors">
                Create one →
              </button>
            </p>
          </div>
        </div>

        <button onClick={() => setPage('home')}
          className="mt-6 text-star-white/30 hover:text-star-white/60 text-[13px] transition-colors flex items-center gap-1 mx-auto">
          ← Back to home
        </button>
      </div>
    </div>
  )
}
