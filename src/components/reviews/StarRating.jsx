'use client'

const STAR_POINTS = '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'

function Star({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points={STAR_POINTS} />
    </svg>
  )
}

/**
 * Reusable star rating.
 * - Read-only when `onChange` is omitted (half-star aware via `value` decimals).
 * - Interactive when `onChange` is provided.
 */
export default function StarRating({ value = 0, onChange = null, size = 18, className = '' }) {
  const interactive = typeof onChange === 'function'
  const filled = Math.floor(value)
  const fraction = value - filled

  const handleKey = (e, idx) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChange(idx + 1)
    }
  }

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={interactive ? 'Select a rating' : `Rated ${value.toFixed(1)} out of 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const isFilled = i < filled
        const showHalf = !interactive && i === filled && fraction >= 0.25 && fraction < 0.75

        if (showHalf) {
          return (
            <span key={i} className="relative inline-flex leading-none text-gold-500">
              <span className="block text-charcoal-700/20">
                <Star size={size} />
              </span>
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fraction * 100}%` }}>
                <Star size={size} />
              </span>
            </span>
          )
        }

        if (interactive) {
          const selected = value >= i + 1
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={value === i + 1}
              aria-label={`${i + 1} star${i > 0 ? 's' : ''}`}
              onClick={() => onChange(i + 1)}
              onKeyDown={(e) => handleKey(e, i)}
              className={`${selected ? 'text-gold-500' : 'text-charcoal-700/25'} hover:scale-110 transition-transform`}
            >
              <Star size={size} />
            </button>
          )
        }

        return (
          <span key={i} className={isFilled ? 'text-gold-500' : 'text-charcoal-700/20'}>
            <Star size={size} />
          </span>
        )
      })}
    </div>
  )
}
