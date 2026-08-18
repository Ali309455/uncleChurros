'use client'

/**
 * Shared UI primitives: Spinner, Shimmer skeletons, conversion components
 */

import { useState } from 'react'

// ── Spinner ────────────────────────────────────────────────────────────────

export function ArrowIcon({ dir = 'right', size = 14, className = '' }) {
  const paths = {
    right: 'M5 12h14M12 5l7 7-7 7',
    left: 'M19 12H5M12 19l-7-7 7-7',
    down: 'M12 5v14M5 12l7 7 7-7',
    upRight: 'M7 17 17 7M7 7h10v10',
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block align-middle flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d={paths[dir] ?? paths.right} />
    </svg>
  )
}

// ── Sparkle (4-point star) ───────────────────────────────────────────────

export function SparkleIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M12 1.8c.8 5.5 3.9 8.8 9.7 9.9-5.8 1.1-8.9 4.4-9.7 9.9-.8-5.5-3.9-8.8-9.7-9.9 5.8-1.1 8.9-4.4 9.7-9.9z" />
    </svg>
  )
}

// ── Star rating row ───────────────────────────────────────────────────────

export function Stars({ rating = 5, size = 14, className = '' }) {
  const filled = Math.round(rating)
  return (
    <span className={`inline-flex items-center gap-0.5 text-gold-500 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

// ── Section header (eyebrow + Fraunces heading + sub) ────────────────────

export function SectionHeader({ eyebrow, title, sub, align = 'left', dark = false }) {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  return (
    <div className={`flex flex-col ${alignCls} gap-3`}>
      {eyebrow && (
        <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${dark ? 'text-gold-400' : 'text-navy-600'}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.12] tracking-tight text-balance ${dark ? 'text-white' : 'text-navy-950'}`}
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.015em' }}
      >
        {title}
      </h2>
      {sub && (
        <p className={`text-[15px] leading-relaxed max-w-xl text-pretty ${dark ? 'text-white/65' : 'text-charcoal-700/60'}`}>
          {sub}
        </p>
      )}
    </div>
  )
}

// ── FAQ accordion ─────────────────────────────────────────────────────────

export function FAQAccordion({ items, className = '' }) {
  const [open, setOpen] = useState(-1)
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            className={`rounded-2xl bg-white border transition-all duration-200 ${
              isOpen ? 'border-gold-500/40 shadow-sm' : 'border-navy-600/10 hover:border-navy-600/25'
            }`}
          >
            <button
              className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4.5 sm:py-5"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              <span className="text-charcoal-700 font-medium text-[15px] leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                {item.q}
              </span>
              <span
                className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isOpen ? 'bg-gold-500 border-gold-500 text-navy-950 rotate-45' : 'border-navy-600/20 text-navy-600'
                }`}
                aria-hidden="true"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <p className="px-5 sm:px-6 pb-5 text-[14px] leading-relaxed text-charcoal-700/65 -mt-1">
                {item.a}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Magical divider (dashed gold line with sparkle) ──────────────────────

export function MagicalDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-gold-500/50" />
      <SparkleIcon size={12} className="text-gold-500" />
      <span className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-gold-500/50" />
    </div>
  )
}

// ── Spinner ────────────────────────────────────────────────────────────────

export function Spinner({ size = 16, color = 'currentColor', className = '' }) {
  return (
    <svg
      className={`animate-spin flex-shrink-0 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.18" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  )
}

// ── Shimmer base ────────────────────────────────────────────────────────────

export function Shimmer({ className = '', rounded = 'rounded-lg' }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/5 ${rounded} ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(248,247,242,0.06) 50%, transparent 100%)',
          animation: 'shimmer-slide 1.6s ease-in-out infinite',
        }}
      />
    </div>
  )
}

// ── Composed skeletons ──────────────────────────────────────────────────────

/** One skeleton row for the orders table */
export function OrderRowSkeleton() {
  return (
    <div className="border-b border-star-white/5 last:border-0">
      {/* Mobile */}
      <div className="lg:hidden px-4 py-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <Shimmer className="h-3.5 w-24" />
            <Shimmer className="h-2.5 w-16" />
          </div>
          <Shimmer className="h-5 w-20" rounded="rounded-full" />
        </div>
        <Shimmer className="h-3 w-40" />
        <Shimmer className="h-3 w-28" />
        <div className="flex gap-2 pt-2 border-t border-star-white/5">
          <Shimmer className="h-8 flex-1" rounded="rounded-lg" />
          <Shimmer className="h-8 w-8" rounded="rounded-lg" />
          <Shimmer className="h-8 w-8" rounded="rounded-lg" />
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-[20px_1fr_1.2fr_68px_84px_126px_106px] gap-3 px-5 py-4 items-center">
        <Shimmer className="h-4 w-4" rounded="rounded" />
        <div className="flex flex-col gap-1.5">
          <Shimmer className="h-3.5 w-24" />
          <Shimmer className="h-2.5 w-16" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Shimmer className="h-3.5 w-32" />
          <Shimmer className="h-2.5 w-40" />
        </div>
        <Shimmer className="h-3.5 w-12" />
        <Shimmer className="h-4 w-14" />
        <Shimmer className="h-5 w-20" rounded="rounded-full" />
        <div className="flex gap-1.5">
          <Shimmer className="h-7 w-20" rounded="rounded-lg" />
          <Shimmer className="h-7 w-7" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  )
}

/** One skeleton row for the products table */
export function ProductRowSkeleton() {
  return (
    <div className="border-b border-star-white/5 last:border-0">
      {/* Mobile */}
      <div className="md:hidden flex items-center gap-3 px-4 py-4">
        <Shimmer className="w-12 h-12 flex-shrink-0" rounded="rounded-xl" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Shimmer className="h-3.5 w-36" />
          <Shimmer className="h-2.5 w-24" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Shimmer className="h-5 w-10" rounded="rounded-full" />
          <Shimmer className="h-6 w-14" rounded="rounded-lg" />
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-[52px_1fr_100px_80px_85px_72px_88px] gap-3 px-5 py-4 items-center">
        <Shimmer className="w-10 h-10" rounded="rounded-lg" />
        <div className="flex flex-col gap-1.5">
          <Shimmer className="h-3.5 w-40" />
          <Shimmer className="h-2.5 w-24" />
        </div>
        <Shimmer className="h-5 w-20" rounded="rounded-full" />
        <Shimmer className="h-4 w-12" />
        <Shimmer className="h-4 w-12" />
        <Shimmer className="h-5 w-10" rounded="rounded-full" />
        <Shimmer className="h-7 w-14" rounded="rounded-lg" />
      </div>
    </div>
  )
}

/** Full-page loading screen used while navigating */
export function PageLoadingSkeleton({ rows = 5, dark = true }) {
  const bg = dark ? 'bg-[#0D1828]' : 'bg-cream-100'
  return (
    <div className={`min-h-screen ${bg} flex flex-col`}>
      {/* Fake header */}
      <div className={`h-14 border-b ${dark ? 'border-star-white/5 bg-navy-950' : 'border-navy-600/10 bg-white'} flex items-center px-6 gap-3`}>
        <Shimmer className="h-4 w-24" />
        <div className="flex-1" />
        <Shimmer className="h-7 w-7" rounded="rounded-full" />
        <Shimmer className="h-7 w-16" rounded="rounded-lg" />
      </div>
      <div className="flex flex-1">
        {dark && (
          <div className="w-12 sm:w-52 border-r border-star-white/5 flex flex-col gap-2 p-3">
            {[1, 2, 3].map((i) => <Shimmer key={i} className="h-9 w-full" rounded="rounded-lg" />)}
          </div>
        )}
        <div className="flex-1 p-6 flex flex-col gap-4">
          <Shimmer className="h-6 w-40 mb-2" rounded="rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[1, 2, 3, 4].map((i) => <Shimmer key={i} className="h-16" rounded="rounded-xl" />)}
          </div>
          <div className="rounded-2xl border border-star-white/6 overflow-hidden">
            {Array.from({ length: rows }).map((_, i) => (
              <OrderRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Simple card skeleton for the shop grid */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/5">
      <Shimmer className="aspect-[4/5] w-full" rounded="rounded-none" />
      <div className="p-4 flex flex-col gap-2">
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
        <div className="flex justify-between pt-1">
          <Shimmer className="h-5 w-14" />
          <Shimmer className="h-8 w-20" rounded="rounded-full" />
        </div>
      </div>
    </div>
  )
}
