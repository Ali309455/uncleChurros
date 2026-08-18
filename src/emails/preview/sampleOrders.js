// Sample order data for the email preview tooling (/emails-preview and
// /api/email/preview). Deliberately exercises edge cases:
//   - long product names, multiple products, missing images
//   - large order totals, long customer names
//   - missing tracking URL, missing optional fields (shipping/tax/discount)
// These samples are never sent to real customers.

const IMG_CLASSIC = 'https://images.unsplash.com/photo-1767489386700-cb3dbcbab13d?w=96&h=96&fit=crop&auto=format'
const IMG_DULCE = 'https://images.unsplash.com/photo-1652465485267-9398f1495c46?w=96&h=96&fit=crop&auto=format'

const RICH_ITEMS = [
  {
    productId: 1,
    name: 'Classic Cinnamon Churros — Hand-Rolled & Fried to Order, Served with a Side of Warm Chocolate Dip',
    price: 65,
    qty: 2,
    image: IMG_CLASSIC,
  },
  { productId: 2, name: 'Dulce de Leche Churros', price: 75, qty: 3, image: IMG_DULCE },
  { productId: 4, name: 'Powdered Sugar Beignets', price: 24.99, qty: 1, image: '' },
]

export const richOrder = {
  id: 'UW-482913',
  orderNumber: 'UW-482913',
  userId: 'demo-user-1',
  customer: {
    name: 'Alexandrina von Lindqvist-Sørensen',
    email: 'customer@example.com',
    phone: '+1 512 555 0182',
  },
  address: '1847 Lavaca St, Austin, TX 78701',
  payment: 'Stripe',
  paymentStatus: 'paid',
  items: RICH_ITEMS,
  subtotal: 279.99,
  shipping: 12.5,
  tax: 21.02,
  discount: 27.99,
  total: 285.52,
  date: '2026-08-10',
  trackingNumber: '9400111899223123456',
  carrier: 'stamps_com',
  shipDate: '2026-08-11',
  refund: { amount: 285.52, date: '2026-08-12', status: 'initiated', method: 'Stripe' },
  status: 'Placed',
}

export const minimalOrder = {
  id: 'UW-000001',
  orderNumber: 'UW-000001',
  customer: { name: 'A', email: 'minimal@example.com' },
  payment: 'COD',
  items: [
    {
      productId: 'p1',
      name: 'An Extremely Long Product Name That Absolutely Wraps Around And Keeps Going For A While',
      price: 99999.99,
      qty: 1,
      image: '',
    },
  ],
  subtotal: 99999.99,
  total: 99999.99,
  date: '2026-08-10',
  status: 'Placed',
}

function withTracking(order) {
  return { ...order, status: 'Dispatched' }
}

function withoutTracking(order) {
  const { trackingNumber, carrier, shipDate, ...rest } = order
  return { ...rest, status: 'Dispatched' }
}

function delivered(order) {
  return { ...order, status: 'Delivered', deliveredAt: '2026-08-12' }
}

function cancelled(order) {
  return { ...order, status: 'Cancelled', cancelledAt: '2026-08-11', refund: order.refund || null }
}

function refunded(order) {
  return { ...order, status: 'Cancelled', cancelledAt: '2026-08-11', refund: order.refund }
}

const SAMPLES = {
  confirmation: () => richOrder,
  processing: () => withoutTracking(richOrder),
  shipped: () => withTracking(richOrder),
  delivered: () => delivered(richOrder),
  cancelled: () => cancelled(richOrder),
  refunded: () => refunded(richOrder),
}

const MINIMAL_SAMPLES = {
  confirmation: () => minimalOrder,
  processing: () => minimalOrder,
  shipped: () => ({ ...minimalOrder, trackingNumber: null, carrier: null }),
  delivered: () => ({ ...minimalOrder, status: 'Delivered' }),
  cancelled: () => ({ ...minimalOrder, status: 'Cancelled', cancelledAt: null }),
  refunded: () => ({ ...minimalOrder, refund: { amount: 99999.99, date: null, status: 'initiated' } }),
}

/** Sample order for a template key — rich (edge cases) by default. */
export function getSampleOrder(template, { minimal = false } = {}) {
  const source = minimal ? MINIMAL_SAMPLES : SAMPLES
  const fn = source[template]
  if (!fn) throw new Error(`No sample for template "${template}"`)
  return fn()
}
