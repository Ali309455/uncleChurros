import CookingGuide from '@/components/cooking/CookingGuide'
import { IconBook } from '@/components/cooking/CookingIcons'

export const metadata = {
  title: 'Cooking Instructions',
  description: 'Preparation instructions for churros, beignets, and chimichangas — deep fry, air fry, or oven.',
}

export default function CookingGuidePage() {
  return (
    <div className="min-h-screen bg-cream-100 pb-20">
      <div className="bg-navy-950 py-16 sm:py-20 px-5 sm:px-8 text-center">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-navy-800 text-gold-400 ring-1 ring-gold-500/25 mb-6">
          <IconBook size={24} />
        </span>
        <p className="text-gold-400 text-[11px] font-semibold uppercase tracking-[0.3em] mb-3">
          In your kitchen
        </p>
        <h1
          className="text-star-white text-4xl sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Cooking Instructions
        </h1>
        <p className="text-star-white/60 mt-4 max-w-md mx-auto text-[15px] leading-relaxed">
          Simple prep instructions for every product — deep fry, air fry, or bake straight from frozen.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 sm:pt-12">
        <CookingGuide />
      </div>
    </div>
  )
}