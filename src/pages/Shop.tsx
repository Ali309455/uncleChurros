import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import type { Product } from '../data/products'
import type { Page, CartItem } from '../App'

type Props = {
  setPage: (p: Page) => void
  addToCart: (product: Omit<CartItem, 'quantity'>, qty: number) => void
  products: Product[]
}

type Category = 'all' | 'churros' | 'beignets' | 'chimichangas'
type SortKey = 'default' | 'price-asc' | 'price-desc'

export default function Shop({ addToCart, products }: Props) {
  const [category, setCategory] = useState<Category>('all')
  const [sort, setSort] = useState<SortKey>('default')

  const filtered = products
    .filter((p) => category === 'all' || p.category === category)
    .slice()
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return 0
    })

  const tabs: { key: Category; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'churros', label: 'Churros' },
    { key: 'beignets', label: 'Beignets' },
    { key: 'chimichangas', label: 'Chimichangas' },
  ]

  return (
    <div className="min-h-screen bg-cream-100 pb-20">
      {/* Page header */}
      <div className="bg-navy-950 py-16 px-5 sm:px-8 text-center">
        <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.22em] mb-3">
          The full menu
        </p>
        <h1
          className="text-star-white text-3xl sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Shop the Churros
        </h1>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-cream-100/95 backdrop-blur-sm border-b border-navy-600/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {tabs.map((t) => (
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
              onChange={(e) => setSort(e.target.value as SortKey)}
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

        {/* Bulk order callout */}
        <div className="mt-14 rounded-2xl bg-navy-800 px-8 py-10 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div>
            <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">
              Party &amp; event orders
            </p>
            <h3
              className="text-star-white text-2xl mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Need 50+ pieces?
            </h3>
            <p className="text-star-white/55 text-sm leading-relaxed max-w-md">
              We handle full-case and 50-piece orders for birthdays, corporate events, and
              park-themed parties. Custom packaging available. Request a quote and we&apos;ll
              get back to you within one business day.
            </p>
          </div>
          <a
            href="mailto:events@unclewalts.com"
            className="flex-shrink-0 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-6 py-3 rounded-full text-sm transition-all duration-150 whitespace-nowrap"
          >
            Request a Quote →
          </a>
        </div>
      </div>
    </div>
  )
}
