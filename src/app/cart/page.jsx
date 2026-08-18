'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/components/StoreProvider'
import { cartSubtotal, cartQuantity, bulkDiscount, cartTotal } from '@/utils/cart'
import { ArrowIcon, SparkleIcon } from '@/components/ui'

export default function Cart() {
  const router = useRouter()
  const { cart, updateQty } = useStore()

  const subtotal = cartSubtotal(cart)
  const totalQty = cartQuantity(cart)
  const bulk = bulkDiscount(cart)
  const total = cartTotal(cart)

  const go = (path) => router.push(path)

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-5 text-center">
        <SparkleIcon size={34} className="text-gold-500 mb-6" />
        <h1
          className="text-navy-950 text-3xl mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Your cart is empty.
        </h1>
        <p className="text-charcoal-700/55 mb-8 max-w-sm">
          The magic hasn&apos;t landed yet. Head to the shop and pick your favourites —
          free shipping on every order.
        </p>
        <button
          onClick={() => go('/shop')}
          className="inline-flex items-center gap-2 bg-navy-600 hover:bg-gold-500 text-white hover:text-navy-950 font-semibold px-7 py-3.5 rounded-full transition-all duration-150 text-[15px]"
        >
          Shop the Churros <ArrowIcon size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      {/* ══ Header ══ */}
      <div className="relative bg-navy-600 py-12 sm:py-14 px-5 sm:px-8 text-center overflow-hidden">
        <SparkleIcon className="absolute top-8 left-[12%] w-4 h-4 text-gold-400/50" />
        <p className="text-gold-400 text-[11px] font-semibold uppercase tracking-[0.24em] mb-3">
          You&apos;re almost there
        </p>
        <h1
          className="text-white text-3xl sm:text-4xl"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
        >
          Your Magic
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10">
        {/* Free shipping banner */}
        <div className="mb-6 rounded-2xl bg-white border border-navy-600/10 px-5 py-3.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[13px] font-semibold text-navy-600">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 7h13v10H1z" />
              <path d="M14 10h4l4 4v3h-8" />
              <circle cx="6" cy="18.5" r="1.8" />
              <circle cx="17" cy="18.5" r="1.8" />
            </svg>
            FREE SHIPPING included
          </span>
          <span>Save $19.95 / dozen</span>
          <span>Approx. 15-in churros</span>
        </div>

        {/* Line items */}
        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-navy-600/10 items-center shadow-sm">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-charcoal-700 font-semibold text-[15px] leading-snug mb-1 truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.name}
                </p>
                <p className="text-navy-950 font-bold text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="text-charcoal-700/40 text-xs">
                  ${item.price.toFixed(2)} / dozen · {item.quantity} {item.quantity === 1 ? 'dozen' : 'dozens'} of 12
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  className="text-charcoal-700/35 hover:text-charcoal-700 transition-colors text-lg leading-none p-1"
                  onClick={() => updateQty(item.id, 0)}
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>
                <div className="flex items-center border border-navy-600/15 rounded-xl overflow-hidden">
                  <button
                    className="w-9 h-9 flex items-center justify-center text-charcoal-700 hover:bg-navy-600/5 transition-colors text-lg font-light"
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-charcoal-700">
                    {item.quantity}
                  </span>
                  <button
                    className="w-9 h-9 flex items-center justify-center text-charcoal-700 hover:bg-navy-600/5 transition-colors text-lg font-light"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upsell nudge */}
        <div className="mt-5 rounded-2xl bg-white border border-gold-500/30 border-dashed px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13.5px] text-charcoal-700/70 font-medium">
            <span className="text-gold-700 font-semibold">Add another dozen</span> and make it a party — or unlock{' '}
            <span className="text-gold-700 font-semibold">10% off your whole order</span> at 6+ dozen.
          </p>
          <button
            onClick={() => go('/shop')}
            className="text-[13px] font-semibold text-navy-600 hover:text-gold-700 transition-colors inline-flex items-center gap-1 flex-shrink-0"
          >
            Shop more <ArrowIcon size={13} />
          </button>
        </div>

        {/* Summary */}
        <div className="mt-5 rounded-2xl bg-white border border-navy-600/10 p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex justify-between text-[15px]">
              <span className="text-charcoal-700/60">Subtotal</span>
              <span className="text-charcoal-700 font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[15px] text-green-700">
              <span className="flex items-center gap-1.5">
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Free</span>
                Free shipping (included)
              </span>
              <span className="font-medium">$0.00</span>
            </div>
            {bulk > 0 && (
              <div className="flex justify-between text-[15px] text-green-700">
                <span className="flex items-center gap-1.5">
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Bulk</span>
                  Bulk discount (6+ dozen)
                </span>
                <span className="font-medium">−${bulk.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-navy-600/10 flex justify-between items-center">
              <span className="text-charcoal-700 font-semibold text-base">Total</span>
              <span className="text-navy-950 font-bold text-2xl">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => go('/checkout')}
            className="w-full bg-navy-600 hover:bg-gold-500 hover:text-navy-950 text-white font-semibold py-4 rounded-xl transition-all duration-150 text-base inline-flex items-center justify-center gap-2"
          >
            Continue to Checkout <ArrowIcon size={15} />
          </button>
          <button
            onClick={() => go('/shop')}
            className="w-full mt-3 text-sm text-charcoal-700/50 hover:text-navy-950 transition-colors font-medium"
          >
            Keep shopping
          </button>

          <p className="mt-4 text-center text-[12px] text-charcoal-700/45">
            Secure checkout · Cash on delivery available · No extra fees
          </p>
        </div>
      </div>
    </div>
  )
}
