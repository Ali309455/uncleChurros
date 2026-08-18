'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { useStore } from '@/components/StoreProvider'
import { ArrowIcon, SparkleIcon } from '@/components/ui'
import { cartSubtotal } from '@/utils/cart'

const CATEGORIES = [
  { key: 'all', label: 'All Treats' },
  { key: 'churros', label: 'Churros' },
  { key: 'beignets', label: 'Beignets' },
  { key: 'chimichangas', label: 'Chimichangas' },
]

export default function Shop() {
  const router = useRouter()
  const { products, addToCart, cart } = useStore()
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('default')

  const filtered = products
    .filter((p) => category === 'all' || p.category === category)
    .slice()
    .sort((a, b) => {
      const aPrice = a.price ?? Number.POSITIVE_INFINITY
      const bPrice = b.price ?? Number.POSITIVE_INFINITY
      if (sort === 'price-asc') return aPrice - bPrice
      if (sort === 'price-desc') return bPrice - aPrice
      if (category !== 'all') return a.available === b.available ? 0 : (a.available ? -1 : 1)
      return 0
    })

  const cartAmount = cartSubtotal(cart)
  const cartQty = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      {/* ══ Header band ══ */}
      <div className="relative bg-navy-600 py-16 sm:py-20 px-5 sm:px-8 text-center overflow-hidden">
        <SparkleIcon className="absolute top-8 left-[10%] w-4 h-4 text-gold-400/50" />
        <SparkleIcon className="absolute bottom-8 right-[12%] w-5 h-5 text-gold-400/40" />
        <p className="text-gold-400 text-[11px] font-semibold uppercase tracking-[0.24em] mb-3">
          Bring the Magic Home™
        </p>
        <h1
          className="text-white text-4xl sm:text-5xl leading-tight"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
        >
          Pick Your Magic
        </h1>
        <p className="text-white/70 mt-4 max-w-md mx-auto text-[15px] leading-relaxed">
          Your favorite park-inspired treats, ready for your kitchen. Free shipping on
          every order — $65 per dozen for the classic churro.
        </p>
      </div>

      {/* Marketing strip */}
      <div className="bg-gold-100 border-y border-gold-500/20 text-navy-600 text-center text-[13px] font-semibold tracking-wide px-5 py-2.5">
        Save $19.95 per dozen vs. the park · FREE SHIPPING included · Cases (100 pieces) get special pricing
      </div>

      {/* ══ Filters ══ */}
      <div className="sticky top-16 sm:top-[72px] z-30 bg-cream-100/95 backdrop-blur-sm border-b border-navy-600/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter by category">
            {CATEGORIES.map((t) => (
              <button
                key={t.key}
                onClick={() => setCategory(t.key)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  category === t.key
                    ? 'bg-navy-600 text-white'
                    : 'bg-white border border-navy-600/15 text-navy-600 hover:border-navy-600/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-transparent text-sm text-charcoal-700 font-medium border border-navy-600/20 rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:border-navy-600/40 cursor-pointer bg-white"
              aria-label="Sort products"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low ↑</option>
              <option value="price-desc">Price: High ↓</option>
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-700/50" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ══ Grid ══ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10">
        {filtered.length === 0 ? (
          <p className="text-center text-charcoal-700/40 py-20 text-lg">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        )}

        {/* ══ Case & bulk callout ══ */}
        <div className="mt-14 rounded-3xl bg-white border border-navy-600/10 px-7 sm:px-10 py-9 sm:py-11 flex flex-col sm:flex-row items-center gap-7 justify-between shadow-sm">
          <div className="flex items-start gap-5">
            <span className="hidden sm:flex w-14 h-14 rounded-2xl bg-blue-accent-100 text-navy-600 items-center justify-center flex-shrink-0">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 7h18M3 7l1.5 12h15L21 7M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <div>
              <p className="text-gold-700 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">
                Cases &amp; event orders
              </p>
              <h3
                className="text-navy-950 text-2xl mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Need a case (100 pieces) or more?
              </h3>
              <p className="text-charcoal-700/55 text-sm leading-relaxed max-w-md">
                Full cases and large orders receive special pricing. Call or message us for a quote —
                we handle birthdays, corporate events, and park-themed parties. We&apos;ll get back to
                you within one business day.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <a
              href="mailto:events@unclewalts.com"
              className="inline-flex items-center gap-2 bg-navy-600 hover:bg-gold-500 text-white hover:text-navy-950 font-semibold px-6 py-3 rounded-full text-sm transition-all duration-150 whitespace-nowrap"
            >
              Call for Special Pricing <ArrowIcon size={14} />
            </a>
            <a
              href="mailto:events@unclewalts.com"
              className="text-charcoal-700/50 hover:text-navy-950 text-sm font-medium transition-colors whitespace-nowrap"
            >
              events@unclewalts.com
            </a>
          </div>
        </div>
      </div>

      {/* ══ Mobile sticky cart bar ══ */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-navy-600/10 px-4 py-3 shadow-[0_-8px_30px_rgba(11,18,38,0.12)]">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-charcoal-700/45 font-semibold">
                {cartQty} {cartQty === 1 ? 'dozen' : 'dozens'} in cart
              </p>
              <p className="text-navy-950 font-bold text-[15px] leading-tight">
                ${cartAmount.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => router.push('/cart')}
              className="flex-1 h-12 rounded-xl bg-navy-600 text-white font-semibold text-[15px] flex items-center justify-center gap-2"
            >
              View Cart <ArrowIcon size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
