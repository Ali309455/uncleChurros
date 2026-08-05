import {
  METHOD_ICONS,
  IconOven,
  IconClock,
  IconTemp,
} from '@/components/cooking/CookingIcons'

export default function MethodCard({ method, accent, isBest }) {
  const Icon = METHOD_ICONS[method.method] ?? IconOven

  return (
    <div className="relative rounded-2xl border border-navy-600/10 bg-white p-5 flex flex-col gap-3.5">
      {isBest && (
        <span
          className={`absolute -top-2.5 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${accent.badge}`}
        >
          Best
        </span>
      )}

      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent.background} ${accent.text}`}
        >
          <Icon size={24} />
        </div>
        <h4 className="text-[15px] font-semibold text-charcoal-700">{method.label}</h4>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-charcoal-700/70">
        <span className="inline-flex items-center gap-1.5">
          <IconTemp size={15} className={accent.text} />
          {method.temp}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconClock size={15} className={accent.text} />
          {method.time}
        </span>
      </div>

      {method.tip && (
        <p className="text-charcoal-700/60 text-[13px] leading-relaxed border-t border-navy-600/8 pt-3">
          {method.tip}
        </p>
      )}
    </div>
  )
}