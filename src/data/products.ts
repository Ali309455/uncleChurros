export type Product = {
  id: number
  name: string
  category: 'churros' | 'beignets' | 'chimichangas'
  price: number
  price6plus: number
  weight: string
  description: string
  image: string
  featured?: boolean
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Cinnamon Churros',
    category: 'churros',
    price: 12.99,
    price6plus: 11.69,
    weight: '6 churros · 480g',
    description:
      'Golden-fried, crispy outside and pillowy inside, rolled in our house-blended cinnamon sugar. The original park experience, made fresh for your door.',
    image:
      'https://images.unsplash.com/photo-1767489386700-cb3dbcbab13d?w=480&h=600&fit=crop&auto=format',
    featured: true,
  },
  {
    id: 2,
    name: 'Dulce de Leche Churros',
    category: 'churros',
    price: 14.99,
    price6plus: 13.49,
    weight: '6 churros · 500g',
    description:
      'Classic churros crowned with a slow-cooked dulce de leche drizzle and a finish of flaked sea salt. Rich, golden, quietly addictive.',
    image:
      'https://images.unsplash.com/photo-1652465485267-9398f1495c46?w=480&h=600&fit=crop&auto=format',
    featured: true,
  },
  {
    id: 3,
    name: 'Churro Bites',
    category: 'churros',
    price: 9.99,
    price6plus: 8.99,
    weight: '12 bites · 360g',
    description:
      'All the magic in one easy-to-share size. Bite-sized churro puffs with a pot of warm chocolate dipping sauce. Made for movie nights.',
    image:
      'https://images.unsplash.com/photo-1694495275309-269e3ea6f21e?w=480&h=600&fit=crop&auto=format',
  },
  {
    id: 4,
    name: 'Classic Belgian Beignets',
    category: 'beignets',
    price: 10.99,
    price6plus: 9.89,
    weight: '8 beignets · 320g',
    description:
      "Light as a cloud, dusted in a snowfall of powdered sugar. New Orleans tradition, no flights required.",
    image:
      'https://images.unsplash.com/photo-1573050329989-9c2509328687?w=480&h=600&fit=crop&auto=format',
    featured: true,
  },
  {
    id: 5,
    name: 'Strawberry Beignets',
    category: 'beignets',
    price: 11.99,
    price6plus: 10.79,
    weight: '8 beignets · 340g',
    description:
      'Our airy beignets with a jammy fresh-strawberry compote and a cloud of whipped cream. Summer in every bite, any time of year.',
    image:
      'https://images.unsplash.com/photo-1559598466-f081d11d2238?w=480&h=600&fit=crop&auto=format',
  },
  {
    id: 6,
    name: 'Crispy Chimichanga Burrito',
    category: 'chimichangas',
    price: 8.99,
    price6plus: 8.09,
    weight: '1 burrito · 280g',
    description:
      'Seasoned slow-cooked beef, sharp cheddar, and jalapeño cream cheese wrapped in a perfectly fried tortilla. The savory counterpoint to all the sweetness.',
    image:
      'https://images.unsplash.com/photo-1731090389603-d63060ee08a6?w=480&h=600&fit=crop&auto=format',
  },
]

export const featuredProducts = products.filter((p) => p.featured)
