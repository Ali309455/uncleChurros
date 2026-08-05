import { getProductReviewStats } from '@/lib/reviews'
import StarRating from './StarRating'

/** Average rating + count + rating distribution. Renders nothing when empty. */
export default function ReviewSummary({ reviews, productId }) {
  const stats = getProductReviewStats(reviews, productId)
  if (!stats.count) return null

  return (
    <div className="rounded-2xl bg-white border border-navy-600/10 p-6">
      <div className="flex items-center gap-5">
        <div
          className="text-charcoal-700 font-bold leading-none"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 5vw, 54px)' }}
        >
          {stats.average.toFixed(1)}
        </div>
        <div>
          <StarRating value={stats.average} size={16} />
          <p className="text-charcoal-700/45 text-[12px] mt-1.5">
            Based on {stats.count} {stats.count === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats.distribution[star] || 0
          const pct = stats.count ? (count / stats.count) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="w-9 text-charcoal-700/55 font-medium">{star}★</span>
              <div className="flex-1 h-[6px] rounded-full bg-navy-600/10 overflow-hidden">
                <div className="h-full rounded-full bg-gold-500" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-9 text-right text-charcoal-700/40">{pct.toFixed(0)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}