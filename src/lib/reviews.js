// Review business logic — pure functions over the review/order/user data.
// Kept free of React and I/O so the same logic works against mock data today
// and database-backed data later.

export const ELIGIBLE_STATUSES = ['Delivered', 'Completed']

export const REVIEW_SORTS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  highest: (a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt),
  lowest: (a, b) => a.rating - b.rating || new Date(b.createdAt) - new Date(a.createdAt),
}

export const REVIEW_SORT_OPTIONS = [
  { key: 'newest', label: 'Newest' },
  { key: 'highest', label: 'Highest Rated' },
  { key: 'lowest', label: 'Lowest Rated' },
]

/** Reviews visible to shoppers (moderation-ready). */
export function getApprovedReviews(reviews) {
  return (reviews || []).filter((r) => r.isApproved)
}

/** Approved reviews for one product, sorted. */
export function getReviewsForProduct(reviews, productId, sort = 'newest') {
  const list = getApprovedReviews(reviews).filter(
    (r) => String(r.productId) === String(productId)
  )
  const cmp = REVIEW_SORTS[sort] || REVIEW_SORTS.newest
  return [...list].sort(cmp)
}

/** { count, average, distribution: { 5, 4, 3, 2, 1 } } */
export function getProductReviewStats(reviews, productId) {
  const list = getReviewsForProduct(reviews, productId, 'newest')
  const count = list.length
  const total = list.reduce((sum, r) => sum + r.rating, 0)
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  list.forEach((r) => {
    if (distribution[r.rating] != null) distribution[r.rating] += 1
  })
  return {
    count,
    average: count ? total / count : 0,
    distribution,
  }
}

/** True when an order contains the product (by productId; name as fallback). */
export function orderContainsProduct(order, productId) {
  return (order?.items || []).some(
    (item) =>
      (item.productId != null && String(item.productId) === String(productId)) ||
      (item.name != null && String(item.name).toLowerCase().includes(String(productId).toLowerCase()))
  )
}

/** First Delivered/Completed order containing the product, or null. */
export function getEligibleOrderForProduct(orders, productId) {
  return (orders || []).find(
    (o) => ELIGIBLE_STATUSES.includes(o.status) && orderContainsProduct(o, productId)
  ) || null
}

/** The user's existing review for a product, or null. */
export function getReviewByUserForProduct(reviews, productId, userId) {
  return (
    (reviews || []).find(
      (r) => String(r.productId) === String(productId) && r.userId === userId
    ) || null
  )
}

/**
 * Eligibility gate — the single source of truth for "can this person review?".
 * Returns { canReview, order, existingReview, reason }
 *   reason: 'login' | 'no-eligible-order' | null
 */
export function getReviewEligibility({ user, orders, reviews, productId }) {
  if (!user) return { canReview: false, reason: 'login', order: null, existingReview: null }
  const order = getEligibleOrderForProduct(orders, productId)
  if (!order) return { canReview: false, reason: 'no-eligible-order', order: null, existingReview: null }
  const existingReview = getReviewByUserForProduct(reviews, productId, user.email)
  return { canReview: true, order, existingReview }
}

/** Build a new review record (submitted through an eligible order ⇒ verified). */
export function createReviewRecord({ productId, user, order, rating, title, review }) {
  const now = new Date().toISOString()
  return {
    id: `R-${Date.now().toString().slice(-6)}`,
    productId,
    userId: user.email,
    userName: user.name,
    orderId: order.id,
    rating,
    title,
    review,
    verifiedPurchase: true,
    createdAt: now,
    updatedAt: now,
    isApproved: true,
    // Future-ready fields (no UI yet): helpfulVotes, images, video, reply, reported
  }
}

/** Update an existing review (rating / title / text). */
export function updateReviewRecord(review, { rating, title, review: text }) {
  return {
    ...review,
    rating,
    title,
    review: text,
    updatedAt: new Date().toISOString(),
  }
}

/** Human-friendly date for review cards. */
export function formatReviewDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}
