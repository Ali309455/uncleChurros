import { getAccentClasses } from '@/lib/cooking'
import { CATEGORY_ICONS } from '@/components/cooking/CookingIcons'

export default function CategoryHeader({ guide }) {
  const accent = getAccentClasses(guide.color)
  const Icon = CATEGORY_ICONS[guide.category] ?? CATEGORY_ICONS.churros

  return (
    <header className="flex items-start gap-4">
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${accent.background} ${accent.text}`}
      >
        <Icon size={30} />
      </div>
      <div className="min-w-0">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accent.text}`}>
          {guide.label}
        </p>
        <h2
          className="text-navy-950 text-xl sm:text-2xl mt-1 leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {guide.headline}
        </h2>
        <p className="text-charcoal-700/60 text-[14px] leading-relaxed mt-2">
          {guide.subtitle}
        </p>
      </div>
    </header>
  )
}