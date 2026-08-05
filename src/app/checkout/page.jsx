'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useStore } from '@/components/StoreProvider'
import { cartSubtotal, cartQuantity, bulkDiscount, cartTotal } from '@/utils/cart'

const PAYMENT_METHODS = ['COD', 'Stripe']

export default function Checkout() {
  const router = useRouter()
  const { cart, placeOrder } = useStore()

  const [payment, setPayment] = useState('COD')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const subtotal = cartSubtotal(cart)
  const totalQty = cartQuantity(cart)
  const bulk = bulkDiscount(cart)
  const total = cartTotal(cart)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.zip.trim()) e.zip = 'Required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      placeOrder({ ...form, payment })
      router.push('/confirmation')
    }, 1000)
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-charcoal-700/70">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-3 text-[15px] text-charcoal-700 bg-white outline-none transition-colors placeholder:text-charcoal-700/30 focus:border-navy-600/40 ${errors[key] ? 'border-red-400' : 'border-navy-600/15'}`}
      />
      {errors[key] && <p className="text-red-500 text-[12px]">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-100 pb-20">
      <div className="bg-navy-950 py-12 px-5 sm:px-8 text-center">
        <h1 className="text-star-white text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>Checkout</h1>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
          <div className="bg-white rounded-2xl border border-navy-600/10 p-6">
            <h2 className="text-navy-950 text-xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>Delivery details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('name', 'Full name', 'text', 'Jane Smith')}
              {field('email', 'Email address', 'email', 'jane@example.com')}
              {field('phone', 'Phone (optional)', 'tel', '+1 555 000 0000')}
              <div className="sm:col-span-2">{field('address', 'Street address', 'text', '123 Magic Kingdom Blvd')}</div>
              {field('city', 'City', 'text', 'Anaheim')}
              {field('zip', 'ZIP code', 'text', '92802')}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-navy-600/10 p-6">
            <h2 className="text-navy-950 text-xl mb-6" style={{ fontFamily: 'var(--font-display)' }}>Payment method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((pm) => (
                <button key={pm} type="button" onClick={() => setPayment(pm)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${payment === pm ? 'border-gold-500 bg-gold-100' : 'border-navy-600/15 hover:border-navy-600/30 bg-white'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${payment === pm ? 'border-gold-500' : 'border-navy-600/30'}`}>
                    {payment === pm && <div className="w-2 h-2 rounded-full bg-gold-500" />}
                  </div>
                  <div>
                    <p className="text-charcoal-700 font-semibold text-[15px]">{pm === 'COD' ? 'Cash on Delivery' : 'Pay by Card'}</p>
                    <p className="text-charcoal-700/50 text-[12px]">{pm === 'COD' ? 'Pay when your box arrives' : 'Powered by Stripe · Secure'}</p>
                  </div>
                </button>
              ))}
            </div>
            {payment === 'Stripe' && (
              <div className="mt-4 p-4 bg-cream-200 rounded-xl text-center text-charcoal-700/60 text-[13px]">
                Card fields appear here via Stripe Elements in production.
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button type="submit" disabled={submitting}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-navy-950 font-semibold py-4 rounded-xl transition-all duration-150 text-base">
              {submitting ? 'Placing your order…' : `Place Order · $${total.toFixed(2)}`}
            </button>
            <div className="flex items-center justify-center gap-2 text-charcoal-700/40 text-[12px]">
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true"><rect x="1" y="5" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 5V3.5a3 3 0 0 1 6 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Secure checkout · Your data is never shared
            </div>
            <button type="button" onClick={() => router.push('/cart')} className="text-sm text-charcoal-700/50 hover:text-charcoal-700 transition-colors text-center">← Back to cart</button>
          </div>
        </form>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-2xl border border-navy-600/10 p-6">
            <h2 className="text-navy-950 text-xl mb-5" style={{ fontFamily: 'var(--font-display)' }}>Order summary</h2>
            <div className="flex flex-col gap-3 mb-5">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                    <Image src={item.image} alt={item.name} width={40} height={40} className="w-full h-full object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-charcoal-700 text-[13px] font-medium truncate">{item.name}</p>
                    <p className="text-charcoal-700/40 text-[12px]">× {item.quantity} {item.quantity === 1 ? 'dozen' : 'dozens'} · ${item.price.toFixed(2)}/dz</p>
                  </div>
                  <p className="text-charcoal-700 font-medium text-[14px] flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-600/10 pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-[14px]"><span className="text-charcoal-700/60">Subtotal</span><span className="text-charcoal-700">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[14px] text-green-700"><span>FREE shipping</span><span>Included</span></div>
              {bulk > 0 && <div className="flex justify-between text-[14px] text-green-600"><span>Bulk discount (6+ dozen)</span><span>−${bulk.toFixed(2)}</span></div>}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-navy-600/10"><span className="text-charcoal-700">Total</span><span className="text-navy-950">${total.toFixed(2)}</span></div>
            </div>
            <p className="mt-4 rounded-lg bg-gold-100 border border-gold-500/25 px-3 py-2 text-[12px] text-navy-950 font-medium text-center">
              Save $19.95 / dozen vs. the park · Authentic Disneyland-quality · No extra fees
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}