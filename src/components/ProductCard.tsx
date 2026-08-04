import { useState } from 'react'
import type { Product } from '../data/products'
import type { CartItem } from '../App'

type Props = {
  product: Product
  onAdd: (product: Omit<CartItem, 'quantity'>, qty: number) => void
  variant?: 'dark' | 'light'
}

export default function ProductCard({ product, onAdd, variant = 'light' }: Props) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const discount = qty >= 6

  const handleAdd = () => {
    onAdd(
      { id: product.id, name: product.name, price: discount ? product.price6plus : product.price, image: product.image },
      qty
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const cardBg = variant === 'dark' ? 'bg-cream-100/96' : 'bg-cream-100'
  const borderStyle = variant === 'dark' ? 'border-white/10' : 'border-navy-600/10'

  return (
    <div
      className={`group flex flex-col rounded-2xl overflow-hidden border ${borderStyle} ${cardBg} shadow-sm transition-all duration-150 hover:-translate-y-1 hover:shadow-lg`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
          loading="lazy"
        />
        {/* Bulk badge */}
        <div className="absolute top-3 left-3 bg-gold-500 text-navy-950 text-xs font-semibold px-2.5 py-1 rounded-full leading-none">
          Save 10% at 6+
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-navy-600/50 mb-1">
            {product.category}
          </p>
          <h3
            className="text-charcoal-700 font-semibold text-base leading-snug"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h3>
          <p className="text-charcoal-700/55 text-[13px] mt-1 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-gold-500 font-bold text-xl leading-none">
            ${(discount ? product.price6plus : product.price).toFixed(2)}
          </span>
          {discount && (
            <span className="text-charcoal-700/40 text-sm line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
          <span className="text-charcoal-700/40 text-[12px] ml-auto">{product.weight}</span>
        </div>

        {/* Quantity + CTA */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <div className="flex items-center border border-navy-600/15 rounded-xl overflow-hidden">
            <button
              className="w-9 h-9 flex items-center justify-center text-charcoal-700 hover:bg-navy-600/5 transition-colors text-lg font-light"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium text-charcoal-700">
              {qty}
            </span>
            <button
              className="w-9 h-9 flex items-center justify-center text-charcoal-700 hover:bg-navy-600/5 transition-colors text-lg font-light"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            className={`flex-1 h-9 rounded-xl text-sm font-semibold transition-all duration-150 ${
              added
                ? 'bg-navy-600 text-star-white'
                : 'bg-gold-500 hover:bg-gold-400 text-navy-950'
            }`}
            onClick={handleAdd}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
