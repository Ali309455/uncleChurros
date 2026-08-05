const ACCENTS = {
  gold: {
    text: 'text-gold-500',
    border: 'border-gold-500/50',
    background: 'bg-gold-100',
    badge: 'bg-gold-500 text-navy-950',
    ring: 'ring-gold-500/25',
  },
  blue: {
    text: 'text-blue-accent-600',
    border: 'border-blue-accent-400/60',
    background: 'bg-blue-accent-100',
    badge: 'bg-blue-accent-500 text-white',
    ring: 'ring-blue-accent-500/25',
  },
  orange: {
    text: 'text-orange-accent-600',
    border: 'border-orange-accent-400/60',
    background: 'bg-orange-accent-100',
    badge: 'bg-orange-accent-500 text-white',
    ring: 'ring-orange-accent-500/25',
  },
}

export function getAccentClasses(color) {
  return ACCENTS[color] ?? ACCENTS.gold
}

export function getCategoriesFromOrder(items) {
  if (!Array.isArray(items)) return []

  const categories = []
  for (const item of items) {
    if (!item || typeof item.name !== 'string' || !item.name.trim()) continue

    const name = item.name.toLowerCase()
    const category = name.includes('beignet')
      ? 'beignets'
      : name.includes('chimichanga')
        ? 'chimichangas'
        : 'churros'

    if (!categories.includes(category)) categories.push(category)
  }
  return categories
}