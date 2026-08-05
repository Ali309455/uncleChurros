'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useStore } from '@/components/StoreProvider'
import ReviewSection from '@/components/reviews/ReviewSection'
import { BUNDLES } from '@/data/products'

function Stars({ rating }) {
  const filled = Math.floor(rating)
  return (
    <span className="inline-flex items-center gap-0.5 text-gold-500" aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

export default function ProductPage() {
  const params = useParams()
  const { products, addToCart } = useStore()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => String(p.id) === String(params.id))

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-6 py-32 text-center">
        <h1
          className="text-charcoal-700 text-3xl mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Product not found
        </h1>
        <p className="text-charcoal-700/55 text-sm mb-8">
          The churro you&apos;re looking for has left the stand. Back to the magic?
        </p>
        <Link
          href="/shop"
          className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-6 py-3 rounded-full text-sm transition-all duration-150"
        >
          <svg className="inline-block w-4 h-4 mr-1.5 -translate-y-px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 18l-6-6 6-6"/>
          </svg>
          Back to Shop
        </Link>
      </div>
    )
  }

  const isAvailable = product.available !== false && product.price != null
  const isChurro = product.category === 'churros'
  const savings = product.parkPrice > 0 ? product.parkPrice - product.price : 0
  const rating = product.rating ?? 4.9
  const reviewCount = product.reviewCount ?? 124

  const handleAdd = () => {
    addToCart(
      { id: product.id, name: product.name, price: product.price, image: product.image },
      qty
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      {/* Breadcrumb band */}
      <div className="bg-navy-950 px-5 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/shop"
            className="group inline-flex items-center text-star-white/50 hover:text-star-white text-[12px] font-medium tracking-wide transition-colors"
          >
            <svg className="w-3.5 h-3.5 mr-1 transition-transform duration-200 group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6"/>
            </svg>
            Shop
          </Link>
          <h1
            className="text-star-white text-2xl sm:text-3xl mt-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden bg-cream-200 shadow-sm lg:sticky lg:top-24">
            <div className="relative aspect-[4/3]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {isChurro && isAvailable && (
                <div className="absolute top-4 left-4 bg-navy-950/90 text-star-white text-xs font-bold px-3 py-1.5 rounded-full leading-none flex items-center gap-1">
                  ≈ 15 in
                </div>
              )}
              {isAvailable ? (
                <div className="absolute bottom-4 left-4 bg-gold-500 text-navy-950 text-[11px] font-bold px-3 py-1.5 rounded-full leading-none">
                  FREE SHIPPING
                </div>
              ) : (
                <div className="absolute bottom-4 left-4 bg-navy-950/90 text-gold-400 text-[11px] font-semibold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full">
                  Coming Soon
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-500 mb-2">
              {product.category}
            </p>
            <h2
              className="text-charcoal-700 text-3xl sm:text-4xl leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mt-2.5">
              <Stars rating={rating} />
              <span className="text-[13px] text-charcoal-700/60 font-medium">
                {rating.toFixed(1)} <span className="text-charcoal-700/40">({reviewCount} Reviews)</span>
              </span>
            </div>

            {isAvailable ? (
              <>
                <p className="text-charcoal-700/65 text-[15px] leading-relaxed mt-4">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mt-6 rounded-2xl bg-gold-100 border border-gold-500/30 px-6 py-5">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="text-gold-500 font-bold text-3xl leading-none">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-charcoal-700/55 text-[12px] font-semibold uppercase tracking-[0.14em]">
                      per dozen
                    </span>
                    {product.parkPrice > 0 && (
                      <span className="text-charcoal-700/40 text-[13px] line-through">
                        ${product.parkPrice.toFixed(2)}
                      </span>
                    )}
                    {savings > 0 && (
                      <span className="ml-auto text-[13px] font-bold text-green-700/80">
                        Save ${savings.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] font-semibold text-charcoal-700/60 mt-2 flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                    FREE SHIPPING INCLUDED
                  </p>
                </div>

                {/* Bundles */}
                <div className="mt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-navy-600/50 mb-2.5">
                    Available Bundles
                  </p>
                  <div className="flex gap-2">
                    {BUNDLES.map((b) => {
                      const active = qty === b.dozens
                      return (
                        <button
                          key={b.dozens}
                          onClick={() => setQty(b.dozens)}
                          aria-pressed={active}
                          className={`flex-1 flex flex-col items-center gap-0.5 rounded-xl border px-3 py-3 text-center transition-all duration-150 ${
                            active
                              ? 'bg-gold-500/10 border-gold-500/60 shadow-sm'
                              : 'border-navy-600/15 hover:border-navy-600/35'
                          }`}
                        >
                          <span className="text-[14px] leading-none text-gold-500" aria-hidden="true">
                            {active ? '◉' : '○'}
                          </span>
                          <span className={`text-[13px] font-semibold leading-tight ${active ? 'text-navy-950' : 'text-charcoal-700/70'}`}>
                            {b.label}
                          </span>
                          <span className="text-[11px] text-charcoal-700/45">
                            {b.pieces} pieces
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <Link
                    href="/contact"
                    className="mt-3.5 inline-block text-[13px] text-charcoal-700/55 hover:text-gold-500 transition-colors"
                  >
                    Need 100 pieces? Call for Special Pricing →
                  </Link>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAdd}
                  className={`w-full h-12 rounded-xl text-[15px] font-semibold transition-all duration-150 mt-7 ${
                    added
                      ? 'bg-navy-600 text-star-white'
                      : 'bg-gold-500 hover:bg-gold-400 text-navy-950'
                  }`}
                >
                  {added
                    ? '✓ Added to cart'
                    : `Add ${qty === 1 ? 'One' : qty === 2 ? 'Two' : 'Three'} ${qty === 1 ? 'Dozen' : 'Dozens'} — $${(product.price * qty).toFixed(2)}`}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 mt-4">
                <p className="text-charcoal-700/55 text-[15px] leading-relaxed">
                  {product.description}
                </p>
                <div className="rounded-2xl bg-gold-100 border border-gold-500/30 px-6 py-5 text-[14px] text-charcoal-700/70">
                  Pricing coming soon — checkout will open when the magic lands.
                </div>
                <button
                  disabled
                  className="w-full h-12 rounded-xl text-[15px] font-semibold bg-navy-600/10 text-charcoal-700/60 cursor-not-allowed"
                >
                  Coming Soon
                </button>
                <Link
                  href="/contact"
                  className="text-[13px] text-charcoal-700/55 hover:text-gold-500 transition-colors"
                >
                  Questions or case pricing? Contact us →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ══ REVIEWS ══ */}
        <section aria-labelledby="reviews-heading" className="mt-16 sm:mt-20 border-t border-navy-600/10 pt-12 sm:pt-16">
          <div className="mb-8">
            <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">
              Trusted by verified customers
            </p>
            <h2
              id="reviews-heading"
              className="text-charcoal-700 text-2xl sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Reviews
            </h2>
          </div>
          <ReviewSection productId={product.id} />
        </section>
      </div>
    </div>
  )
}
