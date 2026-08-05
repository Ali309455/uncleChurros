'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/components/StoreProvider'

const BG_STARS = Array.from({ length: 55 }, (_, i) => {
  const s = (n) => {
    const x = Math.sin(i * 11.3 + n) * 10000
    return x - Math.floor(x)
  }
  return { x: s(1) * 100, y: s(2) * 100, size: s(3) > 0.75 ? 2.2 : s(3) > 0.45 ? 1.4 : 0.8, opacity: 0.12 + s(4) * 0.32, gold: i % 13 === 0 }
})

export default function Signup() {
  const router = useRouter()
  const { login } = useStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setLoading(true)
    setTimeout(() => {
      login({ name: form.name, email: form.email, isAdmin: false })
      router.push('/')
    }, 800)
  }

  const handleGoogle = () => {
    setLoading(true)
    setTimeout(() => {
      login({ name: 'Google User', email: 'user@gmail.com', isAdmin: false })
      router.push('/')
    }, 700)
  }

  const f = (key, label, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-1.5">
      <label className="text-star-white/60 text-[12px] font-medium uppercase tracking-wider">{label}</label>
      <input type={type} value={form[key]} placeholder={placeholder} autoComplete={type === 'password' ? 'new-password' : key}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        className={`w-full bg-navy-950/60 border rounded-xl px-4 py-3 text-star-white text-[14px] placeholder:text-star-white/20 outline-none focus:border-gold-500/50 transition-colors ${errors[key] ? 'border-red-400/50' : 'border-star-white/10'}`} />
      {errors[key] && <p className="text-red-400 text-[11px]">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #080f20 0%, #0B1226 55%, #101d38 100%)' }}>

      {BG_STARS.map((s, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, backgroundColor: s.gold ? '#C9962C' : '#F8F7F2', opacity: s.opacity }} />
      ))}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(201,150,44,0.06) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <button onClick={() => router.push('/')} className="flex items-center gap-2">
            <span className="text-gold-500 text-2xl select-none" style={{ fontFamily: 'var(--font-display)' }}>✦</span>
            <span className="text-star-white text-xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Uncle Walt&apos;s</span>
          </button>
          <p className="text-star-white/35 text-[11px] uppercase tracking-[0.22em] mt-2">Join the magic</p>
        </div>

        <div className="bg-navy-800/80 backdrop-blur-xl border border-star-white/8 rounded-2xl p-8 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,150,44,0.08)' }}>
          <div className="border-t-2 border-gold-500 -mt-8 mb-6" style={{ marginLeft: '-2rem', marginRight: '-2rem' }} />

          <h1 className="text-star-white text-2xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>Create account</h1>
          <p className="text-star-white/40 text-[13px] mb-6">Get fresh churros delivered to your door.</p>

          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium text-[14px] py-3 rounded-xl border border-gray-200 transition-all duration-150 mb-4 disabled:opacity-60">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-star-white/10" />
            <span className="text-star-white/25 text-[11px] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-star-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            {f('name', 'Full name', 'text', 'Jane Smith')}
            {f('email', 'Email', 'email', 'jane@example.com')}
            {f('password', 'Password', 'password', '••••••••')}
            {f('confirm', 'Confirm password', 'password', '••••••••')}
            <button type="submit" disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold py-3 rounded-xl transition-all duration-150 mt-2">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-star-white/30 text-[12px] text-center mt-5">
            Already have an account?{' '}
            <button onClick={() => router.push('/login')} className="text-gold-500 hover:text-gold-400 font-medium transition-colors">
              Log in →
            </button>
          </p>
        </div>

        <button onClick={() => router.push('/')} className="mt-6 text-star-white/30 hover:text-star-white/60 text-[13px] transition-colors flex items-center gap-1 mx-auto">
          ← Back to home
        </button>
      </div>
    </div>
  )
}