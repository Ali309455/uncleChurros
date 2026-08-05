import { getAccentClasses } from '@/lib/cooking'
import {
  IconServe,
  IconSnowflake,
  IconLightbulb,
} from '@/components/cooking/CookingIcons'

const INFO_ITEMS = [
  { key: 'serving', label: 'Serving', icon: IconServe },
  { key: 'storage', label: 'Storage', icon: IconSnowflake },
  { key: 'proTip', label: 'Pro Tip', icon: IconLightbulb },
]

export default function CookingInfoCards({ guide }) {
  const accent = getAccentClasses(guide.color)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {INFO_ITEMS.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="rounded-2xl border border-navy-600/10 bg-cream-100 p-5 flex flex-col gap-2.5"
        >
          <div className="flex items-center gap-2.5">
            <span className={`${accent.text}`}>
              <Icon size={18} />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-700/45">
              {label}
            </p>
          </div>
          <p className="text-charcoal-700/75 text-[13.5px] leading-relaxed">{guide[key]}</p>
        </div>
      ))}
    </div>
  )
}