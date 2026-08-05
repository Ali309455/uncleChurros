/** Empty state shown when a product has no approved reviews. */
export default function ReviewEmptyState() {
  return (
    <div className="rounded-2xl bg-white border border-navy-600/10 px-6 py-14 text-center">
      <p
        className="text-charcoal-700 text-lg"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        No reviews yet.
      </p>
      <p className="text-charcoal-700/50 text-[14px] mt-2">
        Be the first verified customer to share your experience.
      </p>
    </div>
  )
}