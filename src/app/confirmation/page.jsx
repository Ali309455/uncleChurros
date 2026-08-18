'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/components/StoreProvider'
import CookingGuide from '@/components/cooking/CookingGuide'
import { getCategoriesFromOrder } from '@/lib/cooking'
import { IconBook } from '@/components/cooking/CookingIcons'
import { ArrowIcon, SparkleIcon } from '@/components/ui'

export default function OrderConfirmation() {
  const router = useRouter()
  const { lastOrderId, orders } = useStore()

  const order = useMemo(
    () => orders.find((o) => o.id === lastOrderId),
    [orders, lastOrderId]
  )

  const categories = useMemo(
    () => getCategoriesFromOrder(order?.items ?? []),
    [order]
  )

  const totalQty = order?.items?.reduce((s, i) => s + i.qty, 0) ?? 0

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center px-5 py-14 text-center">
      {/* Sparkle burst */}
      <div className="relative mb-7" aria-hidden="true">
        <span className="absolute inset-0 -m-5 rounded-full bg-gold-500/10 blur-xl" />
        <div className="relative w-16 h-16 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-[0_14px_36px_-12px_rgba(201,150,44,0.7)]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <SparkleIcon className="absolute -top-2 -right-7 w-4 h-4 text-gold-500 hero-sparkle" />
        <SparkleIcon className="absolute -bottom-3 -left-8 w-3 h-3 text-gold-400 hero-sparkle" />
      </div>

      <div className="max-w-lg w-full">
        <h1
          className="text-navy-950 text-4xl sm:text-[2.6rem] leading-tight"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
        >
          The magic is on its way!
        </h1>
        <p className="text-charcoal-700/60 mt-4 leading-relaxed text-[15px]">
          Your frozen treats are being packed for free shipping. Keep them frozen until
          you&apos;re ready, then follow the Cooking Instructions to bring the magic back to
          life — 3\u20134 minutes from frozen to golden.
        </p>
      </div>

      {/* Order card */}
      <div className="max-w-lg w-full bg-white rounded-3xl border border-navy-600/10 p-6 sm:p-7 mt-9 shadow-sm text-left">
        <div className="flex items-center justify-between gap-4 border-b border-navy-600/10 pb-4 mb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-700/40 mb-1">
              Order number
            </p>
            <p className="text-navy-950 text-xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
              {order?.id || '—'}
            </p>
          </div>
          {order?.payment === 'COD' && (
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] bg-gold-100 text-gold-700 border border-gold-500/30 px-3 py-1.5 rounded-full whitespace-nowrap">
              Pay on delivery
            </span>
          )}
        </div>

        {/* Items */}
        <div className="flex flex-col gap-3">
          {(order?.items ?? []).map((item, i) => (
            <div key={`${item.productId}-${i}`} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                <Image src={item.image} alt={item.name} width={44} height={44} className="w-full h-full object-cover" sizes="44px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-charcoal-700 text-[13.5px] font-medium truncate">{item.name}</p>
                <p className="text-charcoal-700/40 text-[12px]">× {item.qty} {item.qty === 1 ? 'dozen' : 'dozens'}</p>
              </div>
              <p className="text-charcoal-700 font-medium text-[14px] flex-shrink-0">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-navy-600/10 mt-4 pt-4 flex flex-col gap-2">
          <div className="flex justify-between text-[14px]">
            <span className="text-charcoal-700/60">Free shipping</span>
            <span className="text-green-700 font-medium">Included</span>
          </div>
          {order?.discount > 0 && (
            <div className="flex justify-between text-[14px]">
              <span className="text-charcoal-700/60">Bulk discount (6+ dozen)</span>
              <span className="text-green-700 font-medium">−${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-navy-600/10">
            <span className="text-charcoal-700 font-semibold">Total</span>
            <span className="text-navy-950 font-bold text-xl">${(order?.total ?? 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Status steps */}
      <div className="max-w-lg w-full flex items-center gap-2 mt-8">
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-navy-600 text-white flex items-center justify-center text-sm font-bold">✓</div>
          <p className="text-[11px] font-semibold text-navy-600">Placed</p>
        </div>
        <div className="flex-1 h-0.5 bg-navy-600/15 relative -mt-4" />
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-white border border-navy-600/15 text-charcoal-700/40 flex items-center justify-center text-sm font-medium">2</div>
          <p className="text-[11px] font-medium text-charcoal-700/40">Dispatched</p>
        </div>
        <div className="flex-1 h-0.5 bg-navy-600/15 relative -mt-4" />
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-white border border-navy-600/15 text-charcoal-700/40 flex items-center justify-center text-sm font-medium">3</div>
          <p className="text-[11px] font-medium text-charcoal-700/40">Delivered</p>
        </div>
      </div>

      {/* Next steps */}
      <div className="max-w-lg w-full bg-white rounded-2xl border border-navy-600/10 p-5 mt-7 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-600 mb-3">What happens next</p>
        <ul className="flex flex-col gap-2.5">
          {[
            'We pack your order in an insulated box, frozen at peak freshness',
            'It ships free, with tracking once dispatched',
            'Keep frozen until you\u2019re ready — up to 12 months',
            order?.payment === 'COD' ? 'Pay the driver in cash when your box arrives' : 'Payment is processed securely',
          ].map((step) => (
            <li key={step} className="flex items-start gap-2.5 text-[13.5px] text-charcoal-700/65 leading-snug">
              <span className="text-gold-600 text-sm leading-snug mt-px" aria-hidden="true">✓</span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div className="max-w-lg w-full flex flex-col gap-3 mt-8">
        <button
          onClick={() => router.push('/shop')}
          className="w-full bg-navy-600 hover:bg-gold-500 hover:text-navy-950 text-white font-semibold py-3.5 rounded-xl transition-all duration-150 inline-flex items-center justify-center gap-2 text-[15px]"
        >
          Back to Shop <ArrowIcon size={15} />
        </button>
        <button
          onClick={() => router.push('/cooking')}
          className="w-full border-2 border-navy-600/15 text-navy-600 hover:border-gold-500 hover:text-gold-700 font-semibold py-3 rounded-xl transition-all duration-150 text-[14.5px]"
        >
          How to Prepare Your Churros
        </button>
      </div>

      {categories.length > 0 && (
        <section className="w-full max-w-3xl mt-14 text-left" aria-labelledby="cooking-guide-heading">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-navy-600 text-gold-400 flex items-center justify-center flex-shrink-0">
              <IconBook size={20} />
            </span>
            <div>
              <h2
                id="cooking-guide-heading"
                className="text-navy-950 text-2xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Your Cooking Instructions
              </h2>
              <p className="text-charcoal-700/55 text-[13px] leading-relaxed">
                Prep tips for everything in your order.
              </p>
            </div>
          </div>
          <CookingGuide categories={categories} compact />
        </section>
      )}
    </div>
  )
}
