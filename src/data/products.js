export const BUNDLES = [
  { dozens: 1, label: 'One Dozen', pieces: 12 },
  { dozens: 2, label: 'Two Dozen', pieces: 24 },
  { dozens: 3, label: 'Three Dozen', pieces: 36 },
]

export const CASE_PACK = {
  label: 'Case (100 pieces)',
  note: 'Call for Special Pricing',
}

export const products = [
  {
    id: 1,
    name: 'Classic Cinnamon Churros',
    category: 'churros',
    price: 65,
    price6plus: 65,
    parkPrice: 84.95,
    weight: '1 Dozen (12 pieces)',
    description:
      'The exact 15-inch churros served at Disneyland theme parks — flash-frozen at peak freshness and shipped free to your door for less than you pay in the park. Golden-crisp outside, soft and pillowy inside, rolled in house-blended cinnamon sugar. Heat and enjoy in minutes.',
    image:
      'https://images.unsplash.com/photo-1767489386700-cb3dbcbab13d?w=800&h=600&fit=crop&auto=format',
    featured: true,
    available: true,
  },
  {
    id: 2,
    name: 'Dulce de Leche Churros',
    category: 'churros',
    price: 75,
    price6plus: 75,
    parkPrice: 89.95,
    weight: '1 Dozen (12 pieces)',
    description:
      'Our signature 15-inch park-quality churros drizzled with slow-cooked dulce de leche and a whisper of flaked sea salt. Flash-frozen for freshness and easy to prepare at home — a premium theme-park treat for a fraction of the park price.',
    image:
      'https://images.unsplash.com/photo-1652465485267-9398f1495c46?w=800&h=600&fit=crop&auto=format',
    featured: true,
    available: true,
  },
  {
    id: 3,
    name: 'Chocolate Dipped Churros',
    category: 'churros',
    price: 70,
    price6plus: 70,
    parkPrice: 84.95,
    weight: '1 Dozen (12 pieces)',
    description:
      'Long, golden 15-inch churros finished with a rich chocolate dip and a snowy dusting of cinnamon sugar. The authentic Disneyland-style recipe, frozen for freshness and simple to prepare at home — free shipping on every dozen.',
    image:
      'https://images.unsplash.com/photo-1515579171902-e0c5f918b32b?w=800&h=600&fit=crop&auto=format',
    featured: false,
    available: true,
  },
  {
    id: 4,
    name: 'Powdered Sugar Beignets',
    category: 'beignets',
    price: null,
    price6plus: null,
    parkPrice: null,
    weight: 'Coming soon',
    description:
      'Fluffy, golden-fried beignets snowed under a cloud of powdered sugar — a New Orleans classic done the Uncle Walt\u2019s way. Flash-frozen and ready to fry at home. Pricing coming soon.',
    image:
      'https://images.unsplash.com/photo-1573050329989-9c2509328687?w=800&h=600&fit=crop&auto=format',
    featured: false,
    available: false,
  },
  {
    id: 5,
    name: 'Golden Chimichanga Burritos',
    category: 'chimichangas',
    price: null,
    price6plus: null,
    parkPrice: null,
    weight: 'Coming soon',
    description:
      'Golden, deep-fried burritos with a savory seasoned filling — the perfect savory companion to our churros. Flash-frozen and ready to crisp at home. Pricing coming soon.',
    image:
      'https://images.unsplash.com/photo-1731090389603-d63060ee08a6?w=800&h=600&fit=crop&auto=format',
    featured: false,
    available: false,
  },
]

export const featuredProducts = products.filter((p) => p.featured)