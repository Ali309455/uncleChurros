'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/components/StoreProvider'
import { getReviewEligibility, getReviewsForProduct } from '@/lib/reviews'
import ReviewSummary from './ReviewSummary'
import ReviewFilters from './ReviewFilters'
import ReviewList from './ReviewList'
import ReviewForm from './ReviewForm'
import StarRating from './StarRating'

/**
 * Full reviews experience for one product:
 * summary + filters + feed on the left, write/edit panel on the right.
 */
export default function ReviewSection({ productId }) {
  const { user, orders, reviews, submitReview, updateReview } = useStore()
  const [sort, setSort] = useState('newest')
  const [editing, setEditing] = useState(false)
  const [notice, setNotice] = useState('')
  const noticeTimer = useRef(null)

  const productReviews = useMemo(
    () => getReviewsForProduct(reviews, productId, sort),
    [reviews, productId, sort]
  )
  const eligibility = useMemo(
    () => getReviewEligibility({ user, orders, reviews, productId }),
    [user, orders, reviews, productId]
  )

  const flash = (msg) => {
    setNotice(msg)
    clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(''), 5000)
  }

  const handleCreated = (input) => {
    const created = submitReview(productId, input, eligibility.order.id)
    if (created) flash('✓ Thanks! Your review is live.')
  }

  const handleUpdated = (input) => {
    updateReview(eligibility.existingReview.id, input)
    setEditing(false)
    flash('✓ Review updated.')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
      {/* Feed column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <ReviewSummary reviews={reviews} productId={productId} />
        {productReviews.length > 0 && <ReviewFilters value={sort} onChange={setSort} />}
        <ReviewList reviews={productReviews} />
      </div>

      {/* Write / edit / eligibility panel */}
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-2xl bg-white border border-navy-600/10 p-6">
          <h3
            className="text-charcoal-700 font-semibold text-lg"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {eligibility.existingReview ? 'Your review' : 'Write a Review'}
          </h3>

          {notice && (
            <p className="text-green-700/80 text-[13px] font-medium mt-2">{notice}</p>
          )}

          <div className="mt-4">
            {eligibility.canReview ? (
              eligibility.existingReview ? (
                editing ? (
                  <ReviewForm
                    mode="edit"
                    initial={eligibility.existingReview}
                    onSubmit={handleUpdated}
                    onCancel={() => setEditing(false)}
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-xl bg-cream-100 border border-navy-600/10 p-4">
                      <StarRating value={eligibility.existingReview.rating} size={14} />
                      <p className="text-charcoal-700 font-semibold text-[14px] mt-1.5">
                        {eligibility.existingReview.title}
                      </p>
                      <p className="text-charcoal-700/55 text-[13px] leading-relaxed mt-1 line-clamp-4">
                        {eligibility.existingReview.review}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditing(true)}
                      className="w-full py-2.5 rounded-xl border border-gold-500/60 text-gold-500 hover:bg-gold-500/10 text-[14px] font-semibold transition-colors"
                    >
                      Edit Your Review
                    </button>
                  </div>
                )
              ) : (
                <ReviewForm onSubmit={handleCreated} />
              )
            ) : (
              <div>
                <p className="text-charcoal-700/55 text-[13px] leading-relaxed">
                  {!user
                    ? 'Only customers with a delivered order can review. Log in to check your purchase history.'
                    : 'You can write a review once an order containing this product is marked Delivered.'}
                </p>
                {!user && (
                  <Link
                    href="/login"
                    className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-navy-600 hover:text-gold-500 transition-colors"
                  >
                    Log in to review →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}