import { getAccentClasses } from '@/lib/cooking'
import { CATEGORY_ICONS } from '@/components/cooking/CookingIcons'

export default function CookingSidebar({ guides, activeCategory, onSelect }) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-star-white/65 mb-3">
        Category
      </p>
      <nav className="flex flex-col gap-2" aria-label="Cooking categories">
        {guides.map((guide) => {
          const accent = getAccentClasses(guide.color)
          const Icon = CATEGORY_ICONS[guide.category] ?? CATEGORY_ICONS.churros
          const isActive = guide.category === activeCategory

          return (
            <button
              key={guide.category}
              type="button"
              onClick={() => onSelect(guide.category)}
              aria-pressed={isActive}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150 ${
                isActive
                  ? `${accent.border} ${accent.background} ring-1 ${accent.ring}`
                  : 'border-navy-600/10 bg-white text-charcoal-700 hover:border-navy-600/25'
              }`}
            >
              <span
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? accent.background : 'bg-cream-100'
                } ${isActive ? accent.text : 'text-charcoal-700/50'}`}
              >
                <Icon size={19} />
              </span>
              <span className={`text-[15px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {guide.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}