'use client'

import { useMemo, useState } from 'react'
import { COOKING_GUIDES } from '@/data/cooking'
import { getAccentClasses } from '@/lib/cooking'
import CookingSidebar from '@/components/cooking/CookingSidebar'
import CategoryHeader from '@/components/cooking/CategoryHeader'
import CookingMethods from '@/components/cooking/CookingMethods'
import CookingInfoCards from '@/components/cooking/CookingInfoCards'
import { IconBook, IconTemp } from '@/components/cooking/CookingIcons'

function SectionHeading({ icon: Icon, accent, children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent.background} ${accent.text}`}
      >
        <Icon size={17} />
      </span>
      <h3
        className="text-navy-950 text-lg leading-none"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {children}
      </h3>
    </div>
  )
}

function GuideCard({ guide }) {
  const accent = getAccentClasses(guide.color)

  return (
    <div className="flex flex-col gap-7 rounded-3xl border border-navy-600/10 bg-white p-6 sm:p-8">
      <CategoryHeader guide={guide} />

      <div>
        <SectionHeading icon={IconTemp} accent={accent}>
          Heating methods
        </SectionHeading>
        <CookingMethods guide={guide} />
      </div>

      <div>
        <SectionHeading icon={IconBook} accent={accent}>
          Additional information
        </SectionHeading>
        <CookingInfoCards guide={guide} />
      </div>
    </div>
  )
}

export default function CookingGuide({ categories, compact = false }) {
  const guides = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return COOKING_GUIDES
    const wanted = new Set(categories)
    return COOKING_GUIDES.filter((guide) => wanted.has(guide.category))
  }, [categories])

  const [activeCategory, setActiveCategory] = useState(null)

  if (guides.length === 0) return null

  const activeGuide =
    guides.find((guide) => guide.category === activeCategory) ?? guides[0]

  if (compact) {
    return (
      <div className="flex flex-col gap-6">
        {guides.map((guide) => (
          <GuideCard key={guide.category} guide={guide} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
      <CookingSidebar
        guides={guides}
        activeCategory={activeGuide.category}
        onSelect={setActiveCategory}
      />
      <div className="flex-1 min-w-0 w-full">
        <GuideCard guide={activeGuide} />
      </div>
    </div>
  )
}