'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useStore } from '@/components/StoreProvider'
import ReviewSection from '@/components/reviews/ReviewSection'
import { BUNDLES } from '@/data/products'
import { ArrowIcon, Stars, SparkleIcon } from '@/components/ui'

const formatPrice = (value) => (value % 1 === 0 ? String(value) : value.toFixed(2))

export default function ProductPage() {
  const params = useParams()
  const { products, addToCart } = useStore()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => String(p.id) === String(params.id))

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-6 py-32 text-center">
        <SparkleIcon size={28} className="text-gold-500 mb-5" />
        <h1
          className="text-navy-950 text-3xl mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Product not found
        </h1>
        <p className="text-charcoal-700/55 text-sm mb-8">
          The churro you&apos;re looking for has left the stand. Back to the magic?
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-navy-600 hover:bg-gold-500 text-white hover:text-navy-950 font-semibold px-6 py-3 rounded-full text-sm transition-all duration-150"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      {/* ══ Header band ══ */}
      <div className="relative bg-navy-600 px-5 sm:px-8 py-9 sm:py-10 overflow-hidden">
        <SparkleIcon className="absolute top-6 right-[12%] w-4 h-4 text-gold-400/40" />
        <div className="max-w-6xl mx-auto">
          <Link
            href="/shop"
            className="group inline-flex items-center text-white/60 hover:text-white text-[12px] font-medium tracking-wide transition-colors"
          >
            <svg className="w-3.5 h-3.5 mr-1 transition-transform duration-200 group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6"/>
            </svg>
            Shop
          </Link>
          <p className="text-gold-400 text-[10px] font-semibold uppercase tracking-[0.24em] mt-3 mb-1.5">
            {product.category}
          </p>
          <h1
            className="text-white text-2xl sm:text-3xl"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.015em' }}
          >
            {product.name}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-[0_20px_50px_-24px_rgba(11,18,38,0.3)] border border-navy-600/10 lg:sticky lg:top-24">
            <div className="relative aspect-[4/3]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />

              <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                {isChurro && isAvailable && (
                  <span className="bg-white/92 backdrop-blur-sm text-navy-600 text-xs font-bold px-3 py-1.5 rounded-full leading-none border border-navy-600/10">
                    ≈ 15 in
                  </span>
                )}
                {isAvailable && (
                  <span className="bg-navy-600 text-white text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full leading-none">
                    Free Shipping
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <Stars rating={rating} size={14} />
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
                <div className="mt-6 rounded-2xl bg-white border border-navy-600/10 p-6">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="text-navy-950 font-bold text-3xl leading-none">
                      ${formatPrice(product.price)}
                    </span>
                    <span className="text-charcoal-700/55 text-[12px] font-semibold uppercase tracking-[0.14em]">
                      per dozen
                    </span>
                    {product.parkPrice > 0 && (
                      <span className="text-charcoal-700/35 text-[13px] line-through">
                        ${formatPrice(product.parkPrice)}
                      </span>
                    )}
                    {savings > 0 && (
                      <span className="ml-auto bg-gold-500 text-navy-950 text-[11px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full">
                        Save ${savings.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] font-semibold text-navy-600 mt-3 flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                    FREE SHIPPING INCLUDED
                  </p>
                </div>

                {/* Bundles */}
                <div className="mt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-charcoal-700/50 mb-2.5">
                    Available Bundles
                  </p>
                  <div className="flex gap-2.5">
                    {BUNDLES.map((b) => {
                      const active = qty === b.dozens
                      return (
                        <button
                          key={b.dozens}
                          onClick={() => setQty(b.dozens)}
                          aria-pressed={active}
                          className={`relative flex-1 flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3.5 text-center transition-all duration-150 ${
                            active
                              ? 'border-navy-600 bg-blue-accent-100 shadow-sm'
                              : 'border-navy-600/12 bg-white hover:border-navy-600/35'
                          }`}
                        >
                          {b.dozens === 2 && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gold-500 text-navy-950 text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full whitespace-nowrap">
                              Most Popular
                            </span>
                          )}
                          <span className={`text-[14px] font-semibold leading-tight ${active ? 'text-navy-950' : 'text-charcoal-700/70'}`}>
                            {b.label}
                          </span>
                          <span className={`text-[11px] ${active ? 'text-navy-600/70' : 'text-charcoal-700/45'}`}>
                            {b.pieces} pieces
                          </span>
                          {active && (
                            <span className="text-[11px] font-bold text-navy-600">
                              ${(product.price * b.dozens).toFixed(0)} total
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <Link
                    href="/contact"
                    className="mt-3.5 inline-block text-[13px] text-charcoal-700/55 hover:text-gold-700 transition-colors font-medium"
                  >
                    Need 100 pieces? Call for Special Pricing <ArrowIcon size={13} className="ml-0.5" />
                  </Link>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAdd}
                  className={`w-full h-13 rounded-xl text-[15px] font-semibold transition-all duration-150 mt-7 ${
                    added
                      ? 'bg-navy-950 text-white'
                      : 'bg-navy-600 hover:bg-gold-500 hover:text-navy-950 text-white'
                  }`}
                >
                  {added
                    ? '✓ Added to cart'
                    : `Add ${qty === 1 ? 'One' : qty === 2 ? 'Two' : 'Three'} ${qty === 1 ? 'Dozen' : 'Dozens'} — $${(product.price * qty).toFixed(2)}`}
                </button>

                {/* Reassurance */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { label: 'Frozen at peak freshness', icon: 'snowflake' },
                    { label: 'Cash on delivery available', icon: 'cash' },
                    { label: 'Ready from frozen in minutes', icon: 'clock' },
                  ].map((r) => (
                    <div key={r.label} className="rounded-xl bg-white border border-navy-600/10 px-3.5 py-3 flex items-center gap-2.5">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-navy-600 flex-shrink-0" aria-hidden="true">
                        {r.icon === 'snowflake' && (
                          <>
                            <path d="M12 2v20M4 6l16 12M20 6L4 18" />
                            <path d="M12 6v4M12 14v4" />
                          </>
                        )}
                        {r.icon === 'cash' && (
                          <>
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="12" cy="12" r="2.5" />
                            <path d="M6 12h.01M18 12h.01" />
                          </>
                        )}
                        {r.icon === 'clock' && (
                          <>
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                          </>
                        )}
                      </svg>
                      <span className="text-[11.5px] font-medium text-charcoal-700/60 leading-tight">{r.label}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4 mt-4">
                <p className="text-charcoal-700/55 text-[15px] leading-relaxed">
                  {product.description}
                </p>
                <div className="rounded-2xl bg-gold-100 border border-gold-500/25 px-6 py-5 text-[14px] text-charcoal-700/70">
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
                  className="text-[13px] text-charcoal-700/55 hover:text-gold-700 transition-colors font-medium"
                >
                  Questions or case pricing? Contact us <ArrowIcon size={13} className="ml-0.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ══ REVIEWS ══ */}
        <section aria-labelledby="reviews-heading" className="mt-16 sm:mt-20 border-t border-navy-600/10 pt-12 sm:pt-16">
          <div className="mb-8">
            <p className="text-navy-600 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">
              Trusted by verified customers
            </p>
            <h2
              id="reviews-heading"
              className="text-navy-950 text-2xl sm:text-3xl"
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
