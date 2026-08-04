import type { Page } from '../App'

type Props = {
  orderNumber: string
  setPage: (p: Page) => void
}

export default function OrderConfirmation({ orderNumber, setPage }: Props) {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-5 text-center">
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
          Your churros are heading to the fryer. We&apos;ll send a confirmation to your email once
          your order is on its way.
        </p>

        <div className="bg-cream-100 rounded-xl p-4 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-700/40 mb-1">
            Order number
          </p>
          <p
            className="text-navy-950 text-xl font-bold tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {orderNumber}
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
            onClick={() => setPage('shop')}
            className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold py-3 rounded-xl transition-all duration-150"
          >
            Shop Again →
          </button>
          <button
            onClick={() => setPage('home')}
            className="text-sm text-charcoal-700/50 hover:text-charcoal-700 transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  )
}
