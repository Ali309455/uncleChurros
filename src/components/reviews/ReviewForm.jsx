'use client'

import { useState } from 'react'
import StarRating from './StarRating'

const inputClass =
  'w-full bg-white border border-navy-600/15 rounded-xl px-3.5 py-2.5 text-charcoal-700 text-[14px] placeholder:text-charcoal-700/30 outline-none focus:border-gold-500/60 transition-colors'
const errorClass = 'text-red-500/80 text-[11px] mt-1'

/**
 * Review writer. Supports create (empty) and edit (prefilled) modes.
 * Emits { rating, title, review } via onSubmit after validation.
 */
export default function ReviewForm({ mode = 'create', initial = null, onSubmit, onCancel = null }) {
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [title, setTitle] = useState(initial?.title ?? '')
  const [text, setText] = useState(initial?.review ?? '')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!rating) e.rating = 'Select a star rating'
    if (!title.trim()) e.title = 'Add a short headline'
    if (text.trim().length < 10) e.review = 'Tell us a little more (10+ characters)'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSubmit({ rating, title: title.trim(), review: text.trim() })
    if (mode !== 'edit') {
      setRating(0)
      setTitle('')
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-700/50">
          Your rating
        </label>
        <div className="mt-1.5">
          <StarRating value={rating} onChange={setRating} size={28} />
        </div>
        {errors.rating && <p className={errorClass}>{errors.rating}</p>}
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-700/50">
          Review title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Catchy one-liner"
          className={`${inputClass} mt-1.5 ${errors.title ? 'border-red-500/50' : ''}`}
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-700/50">
          Your review
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="How were the churros? Texture, taste, shipping…"
          className={`${inputClass} mt-1.5 resize-none ${errors.review ? 'border-red-500/50' : ''}`}
        />
        {errors.review && <p className={errorClass}>{errors.review}</p>}
      </div>

      <div className="flex gap-2.5 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-navy-600/15 text-charcoal-700/60 hover:text-charcoal-700 text-[13px] font-medium transition-colors flex-shrink-0"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-[14px] transition-all duration-150"
        >
          {mode === 'edit' ? 'Update Review' : 'Submit Review'}
        </button>
      </div>

      <p className="text-charcoal-700/40 text-[11px]">
        Reviews are tied to your order. Approved reviewers are marked Verified Purchase.
      </p>
    </form>
  )
}