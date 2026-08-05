import { getAccentClasses } from '@/lib/cooking'
import MethodCard from '@/components/cooking/MethodCard'

export default function CookingMethods({ guide }) {
  const accent = getAccentClasses(guide.color)
  const best = guide.bestMethod

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {guide.methods.map((method) => (
        <MethodCard
          key={method.method}
          method={method}
          accent={accent}
          isBest={method.method === best}
        />
      ))}
    </div>
  )
}