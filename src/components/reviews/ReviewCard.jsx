import { formatReviewDate } from '@/lib/reviews'
import StarRating from './StarRating'

/** Single review card with verified-purchase badge. */
export default function ReviewCard({ review }) {
  return (
    <article className="rounded-2xl bg-white border border-navy-600/10 p-6 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-full bg-navy-800 text-star-white flex items-center justify-center text-[13px] font-semibold flex-shrink-0"
            aria-hidden="true"
          >
            {(review.userName || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-charcoal-700 font-semibold text-[14px] flex flex-wrap items-center gap-x-2 gap-y-0.5">
              {review.userName}
              {review.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700/80 whitespace-nowrap">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Verified Purchase
                </span>
              )}
            </p>
            <p className="text-charcoal-700/40 text-[11px]">{formatReviewDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating value={review.rating} size={14} />
      </div>
      <h4
        className="text-charcoal-700 font-semibold text-[15px]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {review.title}
      </h4>
      <p className="text-charcoal-700/65 text-[14px] leading-relaxed">{review.review}</p>
    </article>
  )
}