import Image from 'next/image'
import CookingGuide from '@/components/cooking/CookingGuide'
import { SparkleIcon } from '@/components/ui'

export const metadata = {
  title: 'Cooking Instructions',
  description: 'Preparation instructions for churros, beignets, and chimichangas — deep fry, air fry, or oven.',
}

export default function CookingGuidePage() {
  return (
    <div className="min-h-screen bg-cream-100 pb-20">
      {/* ══ Header ══ */}
      <div className="relative bg-navy-600 py-16 sm:py-20 px-5 sm:px-8 text-center overflow-hidden">
        <SparkleIcon className="absolute top-8 left-[10%] w-4 h-4 text-gold-400/50" />
        <SparkleIcon className="absolute bottom-10 right-[12%] w-5 h-5 text-gold-400/40" />
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-gold-400 ring-1 ring-gold-500/30 mb-6">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </span>
        <p className="text-gold-400 text-[11px] font-semibold uppercase tracking-[0.3em] mb-3">
          In your kitchen
        </p>
        <h1
          className="text-white text-4xl sm:text-5xl leading-tight"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
        >
          Make the magic at home.
        </h1>
        <p className="text-white/70 mt-4 max-w-md mx-auto text-[15px] leading-relaxed">
          Simple prep instructions for every product — deep fry, air fry, or bake
          straight from frozen. Ready in minutes.
        </p>
      </div>

      {/* ══ Kitchen preview ══ */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 -mt-10 relative z-10">
        <div className="rounded-3xl overflow-hidden shadow-[0_28px_60px_-24px_rgba(11,18,38,0.4)] border-4 border-white">
          <div className="relative aspect-[21/7]">
            <Image
              src="/kitchenimage.jpg"
              alt="Golden churros being fried at home in a warm kitchen"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* ══ Guide ══ */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 mt-10 sm:mt-12">
        <CookingGuide />
      </div>
    </div>
  )
}
