'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BUNDLES, CASE_PACK } from '@/data/products'

export default function ProductCard({ product, onAdd, variant = 'light' }) {
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const isAvailable = product.available !== false && product.price != null
  const isChurro = product.category === 'churros'

  const handleAdd = () => {
    onAdd(
      { id: product.id, name: product.name, price: product.price, image: product.image },
      qty
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleCase = () => router.push('/contact')

  const cardBg = variant === 'dark' ? 'bg-cream-100/96' : 'bg-cream-100'
  const borderStyle = variant === 'dark' ? 'border-white/10' : 'border-navy-600/10'

  return (
    <div
      className={`group flex flex-col rounded-2xl overflow-hidden border ${borderStyle} ${cardBg} shadow-sm transition-all duration-150 hover:-translate-y-1 hover:shadow-lg`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-103"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        {isChurro && isAvailable && (
          <div className="absolute top-3 left-3 bg-navy-950/90 text-star-white text-xs font-bold px-2.5 py-1 rounded-full leading-none flex items-center gap-1">
            ≈ 15 in
          </div>
        )}
        {!isAvailable && (
          <div className="absolute bottom-3 left-3 bg-navy-950/90 text-gold-400 text-[11px] font-semibold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full">
            Coming Soon
          </div>
        )}
        {isAvailable && (
          <div className="absolute bottom-3 left-3 bg-gold-500 text-navy-950 text-[11px] font-bold px-2.5 py-1 rounded-full leading-none">
            FREE SHIPPING
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-navy-600/50 mb-1">
            {product.category}
          </p>
          <h3
            className="text-charcoal-700 font-semibold text-base leading-snug"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h3>
          <p className="text-charcoal-700/55 text-[13px] mt-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {isAvailable ? (
          <>
            {/* Price */}
            <div className="flex items-end gap-1.5">
              <span className="text-gold-500 font-bold text-2xl leading-none">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-charcoal-700/45 text-[12px] leading-none mb-0.5">
                / dozen
              </span>
              {product.parkPrice > 0 && (
                <span className="text-charcoal-700/40 text-[12px] line-through leading-none mb-0.5 ml-1">
                  ${product.parkPrice.toFixed(2)}
                </span>
              )}
              <span className="ml-auto text-[11px] font-semibold text-green-700/80 leading-none mb-0.5">
                {product.parkPrice > 0
                  ? `Save $${(product.parkPrice - product.price).toFixed(2)}`
                  : 'Save vs. the park'}
              </span>
            </div>

            {/* Bundles */}
            <div className="pt-1">
              <p className="text-[10px] font-medium uppercase tracking-widest text-navy-600/50 mb-2">
                Available Bundles
              </p>
              <div className="flex gap-1.5">
                {BUNDLES.map((b) => {
                  const active = qty === b.dozens
                  return (
                    <button
                      key={b.dozens}
                      onClick={() => setQty(b.dozens)}
                      className={`flex-1 flex flex-col items-center rounded-xl border px-1.5 py-1.5 transition-all duration-150 ${
                        active
                          ? 'bg-gold-500/10 border-gold-500/50 text-navy-950'
                          : 'border-navy-600/15 text-charcoal-700/70 hover:border-navy-600/35'
                      }`}
                      aria-pressed={active}
                    >
                      <span className="text-[11px] font-semibold leading-tight">
                        {active ? '✓ ' : ''}{b.label}
                      </span>
                      <span className="text-[10px] text-charcoal-700/45">
                        {b.pieces} pieces
                      </span>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={handleCase}
                className="mt-2 w-full text-left text-[11px] text-charcoal-700/55 hover:text-gold-500 transition-colors"
              >
                {CASE_PACK.label} — {CASE_PACK.note} →
              </button>
            </div>

            {/* Add to cart */}
            <button
              className={`w-full h-10 rounded-xl text-sm font-semibold transition-all duration-150 mt-auto ${
                added
                  ? 'bg-navy-600 text-star-white'
                  : 'bg-gold-500 hover:bg-gold-400 text-navy-950'
              }`}
              onClick={handleAdd}
            >
              {added ? '✓ Added' : `Add ${qty} ${qty === 1 ? 'Dozen' : 'Dozens'} · $${(product.price * qty).toFixed(2)}`}
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3 mt-auto">
            <p className="text-[13px] text-charcoal-700/55 leading-relaxed">
              {product.category === 'beignets'
                ? 'Authentic powdered-sugar beignets, flash-frozen and ready to fry.'
                : 'Golden deep-fried chimichangas, flash-frozen and ready to crisp.'}{' '}
              Pricing coming soon — checkout will open when the magic lands.
            </p>
            <button
              disabled
              className="w-full h-10 rounded-xl text-sm font-semibold bg-navy-600/10 text-charcoal-700/60 cursor-not-allowed"
            >
              Coming Soon
            </button>
            <button
              onClick={handleCase}
              className="w-full text-left text-[11px] text-charcoal-700/55 hover:text-gold-500 transition-colors"
            >
              Questions or case pricing? Contact us →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}