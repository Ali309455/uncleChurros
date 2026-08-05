import { REVIEW_SORT_OPTIONS } from '@/lib/reviews'

/** Newest / Highest Rated / Lowest Rated segmented control. */
export default function ReviewFilters({ value, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {REVIEW_SORT_OPTIONS.map((option) => (
        <button
          key={option.key}
          onClick={() => onChange(option.key)}
          aria-pressed={value === option.key}
          className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 ${
            value === option.key
              ? 'bg-navy-950 text-star-white'
              : 'bg-navy-600/8 text-navy-600 hover:bg-navy-600/15'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}