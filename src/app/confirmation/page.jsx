'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/components/StoreProvider'
import CookingGuide from '@/components/cooking/CookingGuide'
import { getCategoriesFromOrder } from '@/lib/cooking'
import { IconBook } from '@/components/cooking/CookingIcons'
import { ArrowIcon } from '@/components/ui'

export default function OrderConfirmation() {
  const router = useRouter()
  const { lastOrderId, orders } = useStore()

  const categories = useMemo(() => {
    const order = orders.find((o) => o.id === lastOrderId)
    return getCategoriesFromOrder(order?.items ?? [])
  }, [orders, lastOrderId])

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center px-5 py-12 text-center">
      {/* Star burst decoration */}
      <div
        className="text-gold-500 text-5xl mb-6 select-none"
        aria-hidden="true"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.3em' }}
      >
        ✦ ✦ ✦
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl border border-navy-600/10 p-8 shadow-sm">
        <h1
          className="text-navy-950 text-3xl sm:text-4xl mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Order Placed!
        </h1>
        <p className="text-charcoal-700/55 mb-6 leading-relaxed">
          Your frozen churros are on their way. Keep them frozen until you&apos;re ready, then
          follow your Cooking Instructions to bring the magic back to life — free shipping included.
        </p>

        <div className="bg-cream-100 rounded-xl p-4 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-700/40 mb-1">
            Order number
          </p>
          <p
            className="text-navy-950 text-xl font-bold tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {lastOrderId || '—'}
          </p>
        </div>

        {/* Status steps */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center text-sm font-bold">✓</div>
            <p className="text-[11px] font-medium text-gold-500">Placed</p>
          </div>
          <div className="flex-1 h-0.5 bg-navy-600/10 relative -mt-4" />
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-navy-600/10 text-charcoal-700/30 flex items-center justify-center text-sm font-medium">2</div>
            <p className="text-[11px] font-medium text-charcoal-700/30">Dispatched</p>
          </div>
          <div className="flex-1 h-0.5 bg-navy-600/10 relative -mt-4" />
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-navy-600/10 text-charcoal-700/30 flex items-center justify-center text-sm font-medium">3</div>
            <p className="text-[11px] font-medium text-charcoal-700/30">Delivered</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/shop')}
            className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold py-3 rounded-xl transition-all duration-150"
          >
            Shop Again <ArrowIcon size={14} className="ml-1" />
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-charcoal-700/50 hover:text-charcoal-700 transition-colors"
          >
            <span className="inline-flex items-center gap-1"><ArrowIcon dir="left" size={14} /> Back to home</span>
          </button>
        </div>
      </div>

      {categories.length > 0 && (
        <section className="w-full max-w-3xl mt-14 text-left" aria-labelledby="cooking-guide-heading">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center flex-shrink-0">
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