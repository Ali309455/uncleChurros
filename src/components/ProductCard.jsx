'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { BUNDLES, CASE_PACK } from '@/data/products'
import { ArrowIcon } from '@/components/ui'

const formatPrice = (value) => (value % 1 === 0 ? String(value) : value.toFixed(2))

export default function ProductCard({ product, onAdd }) {
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const isAvailable = product.available !== false && product.price != null
  const isChurro = product.category === 'churros'
  const bestSeller = product.bestSeller ?? product.id === 1
  const savings = product.parkPrice > 0 ? product.parkPrice - product.price : 0

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

  const qtyWord = qty === 1 ? 'One' : qty === 2 ? 'Two' : 'Three'
  const dozenWord = qty === 1 ? 'Dozen' : 'Dozens'

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-navy-600/10 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-16px_rgba(11,18,38,0.25)]">
      {/* Image */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-cream-200 cursor-pointer"
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
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
          {bestSeller && isAvailable && (
            <span className="bg-gold-500 text-navy-950 text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1.5 rounded-full leading-none flex items-center gap-1 shadow-sm">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Best Seller
            </span>
          )}
          {isChurro && isAvailable && (
            <span className="bg-white/90 backdrop-blur-sm text-navy-600 text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-full leading-none border border-navy-600/10">
              ≈ 15 in
            </span>
          )}
        </div>

        {isAvailable && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="bg-navy-600 text-white text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-full leading-none">
              Free Shipping
            </span>
            {savings > 0 && (
              <span className="bg-white/90 backdrop-blur-sm text-green-700 text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-full leading-none border border-green-600/20">
                Save ${savings.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 min-w-0 p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-navy-600 mb-1.5">
          {product.category}
        </p>
        <h3
          className="text-lg font-semibold leading-snug text-navy-950 cursor-pointer transition-colors hover:text-navy-600"
          style={{ fontFamily: 'var(--font-display)' }}
          onClick={openProduct}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openProduct()}
        >
          {product.name}
        </h3>
        <p className="text-[13px] leading-relaxed mt-1.5 text-charcoal-700/55 line-clamp-2">
          {product.description}
        </p>

        {isAvailable ? (
          <>
            {/* Price */}
            <div className="mt-5 flex items-end gap-2">
              <span className="text-navy-950 font-bold leading-none text-[1.9rem]">
                ${formatPrice(product.price)}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal-700/45 mb-0.5">
                per dozen
              </span>
              {product.parkPrice > 0 && (
                <span className="text-[12.5px] text-charcoal-700/35 line-through mb-0.5 ml-auto">
                  ${formatPrice(product.parkPrice)}
                </span>
              )}
            </div>

            {/* Bundle selector */}
            <div className="mt-4">
              <div className="flex rounded-xl bg-blue-accent-100 p-1 gap-1" role="group" aria-label="Quantity in dozens">
                {BUNDLES.map((b) => {
                  const active = qty === b.dozens
                  return (
                    <button
                      key={b.dozens}
                      onClick={() => setQty(b.dozens)}
                      aria-pressed={active}
                      className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition-all duration-150 ${
                        active
                          ? 'bg-navy-600 text-white shadow-sm'
                          : 'text-navy-600/60 hover:text-navy-600'
                      }`}
                    >
                      {active ? '✓ ' : ''}
                      {b.dozens} dz
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-[11.5px] text-charcoal-700/45">
                {qty * 12} pieces ·{' '}
                <span className="font-semibold text-green-700/80">
                  ${formatPrice(product.price * qty)}
                </span>{' '}
                {qty > 1 && `(${formatPrice(product.price)}/dz)`}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-4">
              <button
                onClick={handleAdd}
                className={`w-full h-12 rounded-xl text-[15px] font-semibold transition-all duration-150 ${
                  added
                    ? 'bg-navy-950 text-white'
                    : 'bg-navy-600 hover:bg-gold-500 hover:text-navy-950 text-white'
                }`}
              >
                {added
                  ? '✓ Added to cart'
                  : `Add ${qtyWord} ${dozenWord} — $${formatPrice(product.price * qty)}`}
              </button>
              <button
                onClick={handleCase}
                className="mt-3 w-full text-center text-[11px] font-medium text-charcoal-700/45 hover:text-gold-700 transition-colors"
              >
                {CASE_PACK.label} · {CASE_PACK.note} <ArrowIcon size={11} className="ml-0.5" />
              </button>
            </div>
          </>
        ) : (
          /* Coming soon */
          <div className="mt-auto pt-5 flex flex-col">
            <p className="text-[12px] leading-relaxed text-charcoal-700/50">
              Pricing coming soon — checkout opens when the magic lands.
            </p>
            <button
              disabled
              className="mt-4 w-full h-12 rounded-xl text-[15px] font-semibold cursor-not-allowed bg-navy-600/8 text-charcoal-700/50"
            >
              Coming Soon
            </button>
            <button
              onClick={handleCase}
              className="mt-3 w-full text-center text-[11px] font-medium text-charcoal-700/45 hover:text-gold-700 transition-colors"
            >
              Questions or case pricing? Contact us <ArrowIcon size={11} className="ml-0.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
