'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/components/StoreProvider'
import { ArrowIcon, SparkleIcon } from '@/components/ui'

export default function Signup() {
  const router = useRouter()
  const { register, loginWithGoogle } = useStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      router.push('/')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      router.push('/')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const f = (key, label, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-1.5">
      <label className="text-charcoal-700/60 text-[11px] font-semibold uppercase tracking-wider">{label}</label>
      <input type={type} value={form[key]} placeholder={placeholder} autoComplete={type === 'password' ? 'new-password' : key}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        className={`w-full border rounded-xl px-4 py-3 text-charcoal-700 text-[14px] placeholder:text-charcoal-700/25 outline-none focus:border-navy-600 transition-colors bg-white ${errors[key] ? 'border-red-400' : 'border-navy-600/15'}`} />
      {errors[key] && <p className="text-red-500 text-[11px]">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-100 flex items-stretch">
      {/* ══ Brand panel ══ */}
      <div className="hidden lg:flex relative flex-col justify-between w-[44%] bg-navy-600 overflow-hidden p-12">
        {/* Castle backdrop */}
        <Image
          src="/castle.png"
          alt=""
          fill
          priority
          sizes="44vw"
          className="object-cover object-top select-none"
          aria-hidden="true"
        />
        {/* Readability overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(11,18,38,0.85) 0%, rgba(11,18,38,0.72) 45%, rgba(11,18,38,0.88) 100%)' }}
          aria-hidden="true"
        />
        <SparkleIcon className="absolute top-10 right-12 w-6 h-6 text-gold-400/50" />
        <SparkleIcon className="absolute bottom-32 left-10 w-4 h-4 text-gold-400/40" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 70% 20%, rgba(201,150,44,0.12) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        <button onClick={() => router.push('/')} className="relative flex items-center gap-2 text-left hover:opacity-85 transition-opacity" aria-label="Uncle Walt's Churros — home">
          <Image src="/logo.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
          <span className="font-bold text-lg tracking-tight text-white">
            Uncle <span className="text-gold-400">Walt&apos;s</span>
          </span>
        </button>

        <div className="relative">
          <div className="relative mb-8">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] aspect-square rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 48%, rgba(201,150,44,0.22) 0%, rgba(201,150,44,0.06) 48%, transparent 70%)' }}
              aria-hidden="true"
            />
            <Image
              src="/churro2.png"
              alt="Golden cinnamon churro"
              width={512}
              height={768}
              priority
              className="relative h-[300px] w-auto mx-auto object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.35)]"
            />
          </div>
          <h1 className="text-white text-3xl leading-[1.15]" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.015em' }}>
            Join the magic.
          </h1>
          <p className="text-white/60 text-[14px] leading-relaxed mt-3 max-w-sm">
            Create an account to track orders, leave reviews, and get fresh
            park-style churros delivered to your door.
          </p>
        </div>

        <p className="relative text-white/35 text-[12px] italic" style={{ fontFamily: 'var(--font-display)' }}>
          Bring the Magic Home™
        </p>
      </div>

      {/* ══ Form panel ══ */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="relative z-10 w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden flex-col items-center mb-8">
            <button onClick={() => router.push('/')} className="flex items-center gap-2 hover:opacity-85 transition-opacity" aria-label="Uncle Walt's Churros — home">
              <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="font-bold text-lg tracking-tight text-navy-950">
                Uncle <span className="text-gold-600">Walt&apos;s</span>
              </span>
            </button>
            <p className="text-charcoal-700/40 text-[11px] uppercase tracking-[0.22em] mt-2">Join the magic</p>
          </div>

          <div className="bg-white rounded-3xl border border-navy-600/10 shadow-[0_20px_50px_-24px_rgba(11,18,38,0.25)] overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-gold-500 via-gold-400 to-navy-600" />
            <div className="p-8">
              <h1 className="text-navy-950 text-2xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                Create account
              </h1>
              <p className="text-charcoal-700/50 text-[13px] mb-6">Get fresh churros delivered to your door.</p>

              <button onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-cream-100 text-charcoal-700 font-medium text-[14px] py-3 rounded-xl border border-navy-600/15 transition-all duration-150 mb-4 disabled:opacity-60">
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-navy-600/10" />
                <span className="text-charcoal-700/35 text-[11px] uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-navy-600/10" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                {f('name', 'Full name', 'text', 'Jane Smith')}
                {f('email', 'Email', 'email', 'jane@example.com')}
                {f('password', 'Password', 'password', '••••••••')}
                {f('confirm', 'Confirm password', 'password', '••••••••')}
                {error && (
                  <p className="text-red-500 text-[12px] bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                )}
                <button type="submit" disabled={loading}
                  className="w-full bg-navy-600 hover:bg-gold-500 hover:text-navy-950 disabled:opacity-60 disabled:hover:bg-navy-600 disabled:hover:text-white text-white font-semibold py-3 rounded-xl transition-all duration-150 mt-2">
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <p className="text-charcoal-700/40 text-[12px] text-center mt-5">
                Already have an account?{' '}
                <button onClick={() => router.push('/login')} className="text-navy-600 hover:text-gold-700 font-semibold transition-colors">
                  Log in <ArrowIcon size={13} dir="right" className="ml-0.5" />
                </button>
              </p>
            </div>
          </div>

          <button onClick={() => router.push('/')} className="mt-6 text-charcoal-700/40 hover:text-navy-950 text-[13px] transition-colors flex items-center gap-1 mx-auto">
            <ArrowIcon dir="left" size={14} /> Back to home
          </button>
        </div>
      </div>
    </div>
  )
}
