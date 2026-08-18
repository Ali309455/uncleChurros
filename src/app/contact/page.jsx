'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowIcon, SparkleIcon } from '@/components/ui'

export default function Contact() {
  const router = useRouter()
  const [isBulk, setIsBulk] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', orderSize: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 900)
  }

  const field = (key, label, type = 'text', placeholder = '', optional = false) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-charcoal-700/65">
        {label}{optional && <span className="text-charcoal-700/30 font-normal ml-1">(optional)</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className={`w-full border rounded-xl px-4 py-3 text-[15px] text-charcoal-700 bg-white outline-none transition-colors placeholder:text-charcoal-700/25 focus:border-navy-600 ${errors[key] ? 'border-red-400' : 'border-navy-600/15'}`}
      />
      {errors[key] && <p className="text-red-500 text-[12px]">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      {/* ══ Header ══ */}
      <div className="relative bg-navy-600 py-16 sm:py-20 px-5 sm:px-8 text-center overflow-hidden">
        <SparkleIcon className="absolute top-8 left-[14%] w-4 h-4 text-gold-400/50" />
        <SparkleIcon className="absolute bottom-10 right-[16%] w-5 h-5 text-gold-400/40" />
        <p className="text-gold-400 text-[11px] font-semibold uppercase tracking-[0.24em] mb-3 relative z-10">
          Get in touch
        </p>
        <h1 className="text-white text-4xl sm:text-5xl relative z-10" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
          We&apos;re here to help.
        </h1>
        <p className="text-white/70 mt-4 max-w-md mx-auto text-[15px] leading-relaxed">
          Real people, quick answers — questions, orders, or cases for your next
          big event.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-12">

        {/* ══ Form ══ */}
        <div>
          {submitted ? (
            <div className="flex flex-col items-center text-center py-16 bg-white rounded-3xl border border-navy-600/10 p-8">
              <div className="w-16 h-16 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-600 text-2xl mb-5">✓</div>
              <h2 className="text-navy-950 text-2xl mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Message received.
              </h2>
              <p className="text-charcoal-700/55 leading-relaxed max-w-sm mb-6">
                We read every message personally and aim to reply within one business day.
                {isBulk && ' For bulk orders, expect a detailed quote with pricing and logistics.'}
              </p>
              <button onClick={() => router.push('/')}
                className="bg-navy-600 hover:bg-gold-500 hover:text-navy-950 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all duration-150">
                Back to home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              {/* Bulk toggle */}
              <div className="flex items-start gap-3 bg-white border border-navy-600/10 rounded-2xl p-4 cursor-pointer select-none shadow-sm"
                onClick={() => setIsBulk((v) => !v)}>
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${isBulk ? 'bg-navy-600 border-navy-600' : 'border-navy-600/25'}`}>
                  {isBulk && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-charcoal-700 font-medium text-[14px] leading-snug">I&apos;m asking about a case / event order</p>
                  <p className="text-charcoal-700/45 text-[12px] mt-0.5">Cases (100 pieces) and event packages — call for special pricing</p>
                </div>
              </div>

              {isBulk && (
                <div className="bg-gold-100 border border-gold-500/25 rounded-xl px-4 py-3 text-[13px] text-charcoal-700/65 leading-relaxed">
                  <span className="font-semibold text-charcoal-700">Cases &amp; events:</span> Full cases (100 pieces) and event orders receive special pricing. Fill in the form below and tell us your event date and approximate quantity — we&apos;ll come back with a quote within one business day.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {field('name', 'Full name', 'text', 'Jane Smith')}
                {field('email', 'Email address', 'email', 'jane@example.com')}
              </div>

              {isBulk && field('orderSize', 'Approximate order size', 'text', 'e.g. 200 churros for a wedding on Aug 15', true)}

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-charcoal-700/65">
                  Message
                </label>
                <textarea
                  value={form.message}
                  rows={5}
                  placeholder={isBulk ? 'Tell us about your event — date, location, headcount, and anything else we should know…' : 'Hi Walt, I had a question about…'}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className={`w-full border rounded-xl px-4 py-3 text-[15px] text-charcoal-700 bg-white outline-none transition-colors placeholder:text-charcoal-700/25 focus:border-navy-600 resize-none ${errors.message ? 'border-red-400' : 'border-navy-600/15'}`}
                />
                {errors.message && <p className="text-red-500 text-[12px]">{errors.message}</p>}
              </div>

              <button type="submit" disabled={sending}
                className="bg-navy-600 hover:bg-gold-500 hover:text-navy-950 disabled:opacity-60 disabled:hover:bg-navy-600 disabled:hover:text-white text-white font-semibold py-3.5 rounded-xl transition-all duration-150 text-[15px] flex items-center justify-center gap-2">
                {sending ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                    Sending…
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    {isBulk ? 'Request a Quote' : 'Send message'} <ArrowIcon size={15} />
                  </span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* ══ Info panel ══ */}
        <div className="flex flex-col gap-5 lg:pt-1">
          {/* Direct contact */}
          <div className="bg-white border border-navy-600/10 rounded-2xl p-6 shadow-sm">
            <p className="text-navy-600 text-[11px] font-semibold uppercase tracking-[0.22em] mb-4">Direct line</p>
            <div className="flex flex-col gap-4">
              <a href="mailto:hello@unclewalts.com" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-blue-accent-100 text-navy-600 flex items-center justify-center flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p className="text-charcoal-700/40 text-[11px] uppercase tracking-wider">Email</p>
                  <p className="text-charcoal-700 group-hover:text-gold-700 transition-colors text-[14px] font-medium">hello@unclewalts.com</p>
                </div>
              </a>
              <a href="tel:+15550001234" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-blue-accent-100 text-navy-600 flex items-center justify-center flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.07 6.07l1.27-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <p className="text-charcoal-700/40 text-[11px] uppercase tracking-wider">Phone</p>
                  <p className="text-charcoal-700 group-hover:text-gold-700 transition-colors text-[14px] font-medium">+1 (555) 000-1234</p>
                </div>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white border border-navy-600/10 rounded-2xl p-6 shadow-sm">
            <p className="text-navy-600/60 text-[11px] font-semibold uppercase tracking-[0.22em] mb-4">Response hours</p>
            <div className="flex flex-col gap-2 text-[14px]">
              {[
                { day: 'Mon – Fri', time: '9 am – 6 pm PT' },
                { day: 'Saturday', time: '10 am – 3 pm PT' },
                { day: 'Sunday', time: 'Closed' },
              ].map((r) => (
                <div key={r.day} className="flex justify-between">
                  <span className="text-charcoal-700/60">{r.day}</span>
                  <span className={`font-medium ${r.time === 'Closed' ? 'text-charcoal-700/30' : 'text-charcoal-700'}`}>{r.time}</span>
                </div>
              ))}
            </div>
            <p className="text-charcoal-700/35 text-[12px] mt-4 leading-relaxed">
              Bulk order quotes typically returned within 1 business day. General messages usually same-day.
            </p>
          </div>

          {/* Bulk CTA */}
          <div className="relative bg-navy-600 rounded-2xl p-6 overflow-hidden">
            <SparkleIcon className="absolute top-4 right-4 w-3.5 h-3.5 text-gold-400/50" />
            <p className="text-gold-400 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">Party &amp; events</p>
            <p className="text-white text-[15px] leading-snug mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Feeding a crowd?
            </p>
            <p className="text-white/60 text-[13px] leading-relaxed mb-4">
              Cases (100 pieces), custom packaging, and white-glove delivery for events.
              Call for special pricing. Anaheim delivery is on us.
            </p>
            <button
              onClick={() => setIsBulk(true)}
              className="text-gold-400 text-[13px] font-medium hover:text-gold-300 transition-colors flex items-center gap-1">
              Start a bulk request <ArrowIcon size={12} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
