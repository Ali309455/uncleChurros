'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/components/StoreProvider'
import { cartSubtotal, cartQuantity, bulkDiscount, cartTotal } from '@/utils/cart'
import { ArrowIcon } from '@/components/ui'

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
        <div className="text-6xl mb-6 select-none" aria-hidden="true">🫙</div>
        <h2
          className="text-navy-950 text-3xl mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Your cart is empty.
        </h2>
        <p className="text-charcoal-700/55 mb-8 max-w-sm">
          The magic hasn&apos;t landed yet. Head to the shop and pick your favourites.
        </p>
        <button
          onClick={() => go('/shop')}
          className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-6 py-3 rounded-full transition-all duration-150"
        >
          Shop the Churros <ArrowIcon size={14} className="ml-1" />
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 pb-20">
      <div className="bg-navy-950 py-12 px-5 sm:px-8 text-center">
        <h1
          className="text-star-white text-3xl sm:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Your Cart
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10">
        {/* Free shipping banner */}
        <div className="mb-6 rounded-xl bg-gold-100 border border-gold-500/30 px-4 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[13px] font-semibold text-navy-950">
          <span>✦ Save $19.95 / dozen</span>
          <span>FREE SHIPPING included</span>
          <span>Approx. 15-in churros</span>
        </div>

        {/* Line items */}
        <div className="flex flex-col divide-y divide-navy-600/10">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 py-5 items-start">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-charcoal-700 font-medium text-[15px] leading-snug mb-1 truncate">
                  {item.name}
                </p>
                <p className="text-gold-500 font-bold text-base">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="text-charcoal-700/40 text-xs">
                  ${item.price.toFixed(2)} / dozen · {item.quantity} {item.quantity === 1 ? 'dozen' : 'dozens'} of 12
                </p>
              </div>
              <div className="flex items-center border border-navy-600/15 rounded-xl overflow-hidden flex-shrink-0">
                <button
                  className="w-9 h-9 flex items-center justify-center text-charcoal-700 hover:bg-navy-600/5 transition-colors text-lg font-light"
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium text-charcoal-700">
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
              <button
                className="text-charcoal-700/30 hover:text-charcoal-700/60 transition-colors text-xl leading-none flex-shrink-0 mt-1"
                onClick={() => updateQty(item.id, 0)}
                aria-label={`Remove ${item.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-2xl bg-white border border-navy-600/10 p-6">
          <div className="flex flex-col gap-3 mb-5">
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
              <div className="flex justify-between text-[15px] text-green-600">
                <span className="flex items-center gap-1.5">
                  <span className="bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Bulk</span>
                  Bulk discount (6+ dozen)
                </span>
                <span className="font-medium">−${bulk.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-navy-600/10 flex justify-between">
              <span className="text-charcoal-700 font-semibold text-base">Total</span>
              <span className="text-navy-950 font-bold text-xl">${total.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-[12px] text-charcoal-700/45 mb-4 text-center">
            Save $19.95 on every dozen compared to park pricing — and shipping is on us.
            {totalQty < 6 && (
              <> Add {6 - totalQty} more dozen to unlock an extra 10% off.</>
            )}
          </p>

          <button
            onClick={() => go('/checkout')}
            className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold py-3.5 rounded-xl transition-all duration-150 text-base"
          >
            Checkout <ArrowIcon size={14} className="ml-1" />
          </button>
          <button
            onClick={() => go('/shop')}
            className="w-full mt-3 text-sm text-charcoal-700/50 hover:text-charcoal-700 transition-colors"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  )
}