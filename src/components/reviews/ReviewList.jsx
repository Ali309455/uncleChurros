import ReviewCard from './ReviewCard'
import ReviewEmptyState from './ReviewEmptyState'

/** Sorted review feed; renders the empty state when there are no reviews. */
export default function ReviewList({ reviews }) {
  if (!reviews.length) return <ReviewEmptyState />
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}