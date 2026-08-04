export type OrderItem = {
  name: string
  qty: number
  price: number
  image: string
}

export type OrderStatus = 'Placed' | 'Dispatched' | 'Delivered' | 'Cancelled'

export type Order = {
  id: string
  date: string
  customer: { name: string; email: string; phone: string }
  address: string
  payment: 'COD' | 'Stripe'
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  status: OrderStatus
  trackingNumber?: string
  carrier?: string
  shipstationOrderId?: string
}

export const mockOrders: Order[] = [
  {
    id: 'UW-847291',
    date: '2026-07-28',
    customer: { name: 'Priya Desai', email: 'priya.d@example.com', phone: '+1 512 555 0182' },
    address: '1847 Lavaca St, Austin, TX 78701',
    payment: 'Stripe',
    items: [
      { name: 'Classic Cinnamon Churros', qty: 2, price: 12.99, image: 'https://images.unsplash.com/photo-1767489386700-cb3dbcbab13d?w=80&h=80&fit=crop&auto=format' },
      { name: 'Classic Belgian Beignets', qty: 1, price: 10.99, image: 'https://images.unsplash.com/photo-1573050329989-9c2509328687?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 36.97, discount: 0, total: 36.97,
    status: 'Delivered',
  },
  {
    id: 'UW-729304',
    date: '2026-07-30',
    customer: { name: 'Marcus Thibodeau', email: 'm.thibodeau@mail.com', phone: '+1 503 555 0047' },
    address: '4420 NE Fremont St, Portland, OR 97213',
    payment: 'COD',
    items: [
      { name: 'Classic Cinnamon Churros', qty: 3, price: 12.99, image: 'https://images.unsplash.com/photo-1767489386700-cb3dbcbab13d?w=80&h=80&fit=crop&auto=format' },
      { name: 'Dulce de Leche Churros', qty: 3, price: 13.49, image: 'https://images.unsplash.com/photo-1652465485267-9398f1495c46?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 79.44, discount: 7.94, total: 71.50,
    status: 'Dispatched',
  },
  {
    id: 'UW-610582',
    date: '2026-07-31',
    customer: { name: 'Denise Whitmore', email: 'denise.w@example.com', phone: '+1 619 555 0234' },
    address: '2203 India St, San Diego, CA 92101',
    payment: 'Stripe',
    items: [
      { name: 'Dulce de Leche Churros', qty: 1, price: 14.99, image: 'https://images.unsplash.com/photo-1652465485267-9398f1495c46?w=80&h=80&fit=crop&auto=format' },
      { name: 'Strawberry Beignets', qty: 2, price: 11.99, image: 'https://images.unsplash.com/photo-1559598466-f081d11d2238?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 38.97, discount: 0, total: 38.97,
    status: 'Dispatched',
  },
  {
    id: 'UW-501847',
    date: '2026-08-01',
    customer: { name: 'Jordan Kim', email: 'jkim@workmail.io', phone: '+1 213 555 0388' },
    address: '800 W Olympic Blvd, Los Angeles, CA 90015',
    payment: 'Stripe',
    items: [
      { name: 'Churro Bites', qty: 2, price: 9.99, image: 'https://images.unsplash.com/photo-1694495275309-269e3ea6f21e?w=80&h=80&fit=crop&auto=format' },
      { name: 'Crispy Chimichanga Burrito', qty: 3, price: 8.99, image: 'https://images.unsplash.com/photo-1731090389603-d63060ee08a6?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 46.95, discount: 0, total: 46.95,
    status: 'Placed',
  },
  {
    id: 'UW-398201',
    date: '2026-08-01',
    customer: { name: 'Fatima Al-Rashid', email: 'fatima.ar@gmail.com', phone: '+1 415 555 0192' },
    address: '401 Van Ness Ave, San Francisco, CA 94102',
    payment: 'COD',
    items: [
      { name: 'Classic Belgian Beignets', qty: 4, price: 10.99, image: 'https://images.unsplash.com/photo-1573050329989-9c2509328687?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 43.96, discount: 4.40, total: 39.56,
    status: 'Placed',
  },
  {
    id: 'UW-285930',
    date: '2026-07-24',
    customer: { name: 'Rowan Stafford', email: 'rowan.s@hey.com', phone: '+1 720 555 0055' },
    address: '1600 Glenarm Pl, Denver, CO 80202',
    payment: 'Stripe',
    items: [
      { name: 'Classic Cinnamon Churros', qty: 1, price: 12.99, image: 'https://images.unsplash.com/photo-1767489386700-cb3dbcbab13d?w=80&h=80&fit=crop&auto=format' },
      { name: 'Crispy Chimichanga Burrito', qty: 2, price: 8.99, image: 'https://images.unsplash.com/photo-1731090389603-d63060ee08a6?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 30.97, discount: 0, total: 30.97,
    status: 'Cancelled',
  },
  {
    id: 'UW-174622',
    date: '2026-07-20',
    customer: { name: 'Sofia Engström', email: 'sofia.e@inbox.com', phone: '+1 312 555 0741' },
    address: '233 S Wacker Dr, Chicago, IL 60606',
    payment: 'COD',
    items: [
      { name: 'Dulce de Leche Churros', qty: 2, price: 13.49, image: 'https://images.unsplash.com/photo-1652465485267-9398f1495c46?w=80&h=80&fit=crop&auto=format' },
      { name: 'Classic Belgian Beignets', qty: 2, price: 10.99, image: 'https://images.unsplash.com/photo-1573050329989-9c2509328687?w=80&h=80&fit=crop&auto=format' },
      { name: 'Strawberry Beignets', qty: 2, price: 10.79, image: 'https://images.unsplash.com/photo-1559598466-f081d11d2238?w=80&h=80&fit=crop&auto=format' },
    ],
    subtotal: 70.54, discount: 7.05, total: 63.49,
    status: 'Delivered',
  },
]
