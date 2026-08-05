'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { useStore } from '@/components/StoreProvider'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'churros', label: 'Churros' },
  { key: 'beignets', label: 'Beignets' },
  { key: 'chimichangas', label: 'Chimichangas' },
]

export default function Shop() {
  const { products, addToCart } = useStore()
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

  return (
    <div className="min-h-screen bg-cream-100 pb-20">
      {/* Page header */}
      <div className="bg-navy-950 py-16 px-5 sm:px-8 text-center">
        <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.22em] mb-3">
          Bring the Magic Home™
        </p>
        <h1
          className="text-star-white text-3xl sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Shop Authentic Churros
        </h1>
        <p className="text-star-white/60 mt-4 max-w-md mx-auto text-[15px] leading-relaxed">
          $65 per dozen · Free shipping · Approx. 15-inch churros — the same ones served at
          Disneyland, frozen fresh for less than park pricing.
        </p>
      </div>

      {/* Marketing strip */}
      <div className="bg-gold-500 text-navy-950 text-center text-[13px] font-semibold tracking-wide px-5 py-2.5">
        Save $19.95 per dozen · FREE SHIPPING included · Cases (100 pieces) get special pricing
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-cream-100/95 backdrop-blur-sm border-b border-navy-600/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((t) => (
              <button
                key={t.key}
                onClick={() => setCategory(t.key)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  category === t.key
                    ? 'bg-navy-950 text-star-white'
                    : 'bg-navy-600/8 text-navy-600 hover:bg-navy-600/15'
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
              className="appearance-none bg-transparent text-sm text-charcoal-700 font-medium border border-navy-600/20 rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:border-navy-600/40 cursor-pointer"
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

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10">
        {filtered.length === 0 ? (
          <p className="text-center text-charcoal-700/40 py-20 text-lg">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} variant="light" />
            ))}
          </div>
        )}

        {/* Case & bulk callout */}
        <div className="mt-14 rounded-2xl bg-navy-800 px-8 py-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div>
            <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">
              Cases &amp; event orders
            </p>
            <h3
              className="text-star-white text-2xl mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Need a case (100 pieces) or more?
            </h3>
            <p className="text-star-white/55 text-sm leading-relaxed max-w-md">
              Full cases and large orders receive special pricing. Call or message us for a quote —
              we handle birthdays, corporate events, and park-themed parties. We&apos;ll get back to
              you within one business day.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <a
              href="mailto:events@unclewalts.com"
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-6 py-3 rounded-full text-sm transition-all duration-150 whitespace-nowrap"
            >
              Call for Special Pricing →
            </a>
            <a
              href="mailto:events@unclewalts.com"
              className="text-star-white/50 hover:text-star-white text-sm font-medium transition-colors whitespace-nowrap"
            >
              events@unclewalts.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}