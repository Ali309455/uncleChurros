import type { Page, CartItem } from '../App'

type Props = {
  cart: CartItem[]
  updateQty: (id: number, qty: number) => void
  setPage: (p: Page) => void
}

export default function Cart({ cart, updateQty, setPage }: Props) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)

  const bulkDiscount = totalQty >= 6 ? subtotal * 0.1 : 0
  const total = subtotal - bulkDiscount

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
          onClick={() => setPage('shop')}
          className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-6 py-3 rounded-full transition-all duration-150"
        >
          Shop the Churros →
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
        {/* Line items */}
        <div className="flex flex-col divide-y divide-navy-600/10">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 py-5 items-start">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
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
                  ${item.price.toFixed(2)} each
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
            {bulkDiscount > 0 && (
              <div className="flex justify-between text-[15px] text-green-600">
                <span className="flex items-center gap-1.5">
                  <span className="bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Bulk</span>
                  Bulk discount (6+ items)
                </span>
                <span className="font-medium">−${bulkDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-navy-600/10 flex justify-between">
              <span className="text-charcoal-700 font-semibold text-base">Total</span>
              <span className="text-navy-950 font-bold text-xl">${total.toFixed(2)}</span>
            </div>
          </div>

          {totalQty < 6 && (
            <p className="text-[12px] text-charcoal-700/40 mb-4 text-center">
              Add {6 - totalQty} more item{6 - totalQty !== 1 ? 's' : ''} to unlock your 10% bulk discount
            </p>
          )}

          <button
            onClick={() => setPage('checkout')}
            className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold py-3.5 rounded-xl transition-all duration-150 text-base"
          >
            Checkout →
          </button>
          <button
            onClick={() => setPage('shop')}
            className="w-full mt-3 text-sm text-charcoal-700/50 hover:text-charcoal-700 transition-colors"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  )
}
