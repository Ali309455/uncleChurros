'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BUNDLES, CASE_PACK } from '@/data/products'

const formatPrice = (value) => (value % 1 === 0 ? String(value) : value.toFixed(2))

export default function ProductCard({ product, onAdd, variant = 'light' }) {
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const isAvailable = product.available !== false && product.price != null
  const isChurro = product.category === 'churros'
  const dark = variant === 'dark'

  const handleAdd = () => {
    onAdd(
      { id: product.id, name: product.name, price: product.price, image: product.image },
      qty
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleCase = () => router.push('/contact')

  const openProduct = () => router.push(`/shop/${product.id}`)

  const savings = product.parkPrice > 0 ? product.parkPrice - product.price : 0
  const qtyWord = qty === 1 ? 'One' : qty === 2 ? 'Two' : 'Three'
  const dozenWord = qty === 1 ? 'Dozen' : 'Dozens'

  return (
    <div
      className={`group flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-sm transition-all duration-150 hover:-translate-y-1 hover:shadow-lg ${
        dark ? 'bg-navy-800' : 'bg-white'
      }`}
    >
      {/* Image */}
      <div
        className="relative aspect-[4/3] md:aspect-auto md:w-[38%] md:shrink-0 overflow-hidden bg-cream-200 cursor-pointer"
        onClick={openProduct}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openProduct()}
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 28vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-103"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {isChurro && isAvailable && (
          <div className="absolute top-3 left-3 bg-navy-950/90 text-star-white text-xs font-bold px-2.5 py-1 rounded-full leading-none flex items-center gap-1">
            ≈ 15 in
          </div>
        )}
        {isAvailable ? (
          <div className="absolute bottom-3 left-3 bg-gold-500 text-navy-950 text-[11px] font-bold px-2.5 py-1 rounded-full leading-none">
            FREE SHIPPING
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 bg-navy-950/90 text-gold-400 text-[11px] font-semibold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full">
            Coming Soon
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 min-w-0 p-5 sm:p-6 md:p-7">
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.22em] mb-1.5 ${
            dark ? 'text-gold-400/70' : 'text-charcoal-700/40'
          }`}
        >
          {product.category}
        </p>
        <h3
          className={`text-lg font-semibold leading-snug cursor-pointer transition-colors ${
            dark ? 'text-star-white hover:text-gold-400' : 'text-charcoal-700 hover:text-gold-500'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
          onClick={openProduct}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openProduct()}
        >
          {product.name}
        </h3>
        <p
          className={`text-[13px] leading-relaxed mt-1.5 line-clamp-2 ${
            dark ? 'text-star-white/55' : 'text-charcoal-700/55'
          }`}
        >
          {product.description}
        </p>

        {isAvailable ? (
          <>
            {/* Price */}
            <div className="mt-6">
              <div className="flex items-end gap-2.5">
                <span className="text-gold-500 font-bold leading-none text-4xl">
                  ${formatPrice(product.price)}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] mb-1 ${
                    dark ? 'text-star-white/40' : 'text-charcoal-700/45'
                  }`}
                >
                  per dozen
                </span>
              </div>
              <p className="mt-2 text-[12px] text-charcoal-700/50">
                <span className="font-semibold text-green-700/80">Free shipping included</span>
                {savings > 0 && (
                  <span className={dark ? 'text-star-white/40' : 'text-charcoal-700/45'}>
                    {' '}
                    · Save ${savings.toFixed(2)}
                  </span>
                )}
              </p>
            </div>

            {/* Bundles */}
            <div className="mt-5">
              <div className="flex rounded-xl bg-navy-600/8 p-1 gap-1">
                {BUNDLES.map((b) => {
                  const active = qty === b.dozens
                  return (
                    <button
                      key={b.dozens}
                      onClick={() => setQty(b.dozens)}
                      aria-pressed={active}
                      className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition-all duration-150 ${
                        active
                          ? dark
                            ? 'bg-navy-950 text-star-white shadow-sm'
                            : 'bg-white text-charcoal-700 shadow-sm'
                          : dark
                            ? 'text-star-white/45 hover:text-star-white'
                            : 'text-charcoal-700/55 hover:text-charcoal-700'
                      }`}
                    >
                      {active ? '✓ ' : ''}
                      {b.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-5">
              <button
                onClick={handleAdd}
                className={`w-full h-12 rounded-xl text-[15px] font-semibold transition-all duration-150 ${
                  added
                    ? 'bg-navy-600 text-star-white'
                    : 'bg-gold-500 hover:bg-gold-400 text-navy-950'
                }`}
              >
                {added
                  ? '✓ Added to cart'
                  : `Add ${qtyWord} ${dozenWord} — $${formatPrice(product.price * qty)}`}
              </button>
              <button
                onClick={handleCase}
                className={`mt-3.5 w-full text-center text-[11px] font-medium transition-colors ${
                  dark
                    ? 'text-star-white/35 hover:text-gold-400'
                    : 'text-charcoal-700/45 hover:text-gold-500'
                }`}
              >
                {CASE_PACK.label} — {CASE_PACK.note} →
              </button>
            </div>
          </>
        ) : (
          /* Coming soon */
          <div className="mt-auto pt-5 flex flex-col">
            <p
              className={`text-[12px] leading-relaxed ${
                dark ? 'text-star-white/50' : 'text-charcoal-700/50'
              }`}
            >
              Pricing coming soon — checkout opens when the magic lands.
            </p>
            <button
              disabled
              className={`mt-4 w-full h-12 rounded-xl text-[15px] font-semibold cursor-not-allowed ${
                dark ? 'bg-star-white/10 text-star-white/40' : 'bg-navy-600/10 text-charcoal-700/55'
              }`}
            >
              Coming Soon
            </button>
            <button
              onClick={handleCase}
              className={`mt-3.5 w-full text-center text-[11px] font-medium transition-colors ${
                dark
                  ? 'text-star-white/35 hover:text-gold-400'
                  : 'text-charcoal-700/45 hover:text-gold-500'
              }`}
            >
              Questions or case pricing? Contact us →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
