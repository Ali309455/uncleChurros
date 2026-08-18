/**
 * Order schema — preserves the shape used by `src/data/orders.js` and the
 * admin UI (items use `qty`, customer is an object, status is capitalized).
 *
 * @typedef {Object} OrderItem
 * @property {string} productId  Product document id
 * @property {string} name       Product name at time of purchase
 * @property {number} qty        Quantity (dozens)
 * @property {number} price      Unit price from the database at time of purchase
 * @property {string} image      Product image URL
 */

/**
 * @typedef {Object} OrderCustomer
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 */

/**
 * @typedef {Object} Order
 * @property {string} id          Firestore document id
 * @property {string} orderNumber Human-friendly id (e.g. "UW-482913")
 * @property {string} userId      Authenticated user who placed the order
 * @property {OrderCustomer} customer
 * @property {string} address     "street, city, ZIP" string (admin UI convention)
 * @property {string} payment     'COD' | 'Stripe'
 * @property {OrderItem[]} items
 * @property {number} subtotal
 * @property {number} discount    Bulk discount (10% at 6+ dozens)
 * @property {number} total
 * @property {string} paymentStatus 'pending' | 'paid'
 * @property {string} status      'Placed' | 'Dispatched' | 'Delivered' | 'Cancelled'
 * @property {string} date        YYYY-MM-DD (admin UI convention)
 * @property {import('firebase/firestore').FieldValue|Date} createdAt
 * @property {import('firebase/firestore').FieldValue|Date} updatedAt
 */

/**
 * Payload accepted by `orderService.createOrder`. Prices are IGNORED —
 * the service reads prices from Firestore.
 *
 * @typedef {Object} CreateOrderInput
 * @property {string} userId
 * @property {Array<{ productId: string, quantity: number }>} items
 * @property {{ name: string, email: string, phone?: string, address: string, city: string, zip: string }} shippingAddress
 * @property {string} [payment] 'COD' | 'Stripe' (default 'COD')
 */

export {}
