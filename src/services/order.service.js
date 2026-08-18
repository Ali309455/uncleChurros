// OrderService — the full order lifecycle. Prices are NEVER trusted from the
// frontend: the service re-reads products from Firestore and computes the
// total from database prices, then decrements stock in the same transaction.
//
// NOTE: in a browser-only setup this protects against accidents, not a
// determined attacker (they can call Firestore directly). For production,
// move createOrder to a Cloud Function and lock rules down to admin-only
// order writes (see firestore.rules).
//
// Email integration: the service fires transactional emails through
// EmailService at lifecycle transitions (created / dispatched / delivered /
// cancelled / refunded). Emails are best-effort — an email failure never
// fails the order operation. Idempotency: each event key is recorded in the
// order's `emailEvents` map after a successful send, so repeated status
// updates never resend the same notification.

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { authService } from '@/services/auth.service'
import { emailService } from '@/services/email.service'
import { trackingUrl } from '@/services/shipstation'
import { ORDER_EMAIL_EVENTS } from '@/emails/events'
import { cartSubtotal, cartQuantity, bulkDiscount } from '@/utils/cart'

const ORDERS = 'orders'

const ORDER_STATUSES = ['Placed', 'Dispatched', 'Delivered', 'Cancelled']

// Order status → email event. Keys are the canonical event keys from
// ORDER_EMAIL_EVENTS; never scatter status strings around the codebase.
const ORDER_STATUS_EMAIL = {
  Dispatched: (order) =>
    order?.trackingNumber ? ORDER_EMAIL_EVENTS.SHIPPED.key : ORDER_EMAIL_EVENTS.PROCESSING.key,
  Delivered: () => ORDER_EMAIL_EVENTS.DELIVERED.key,
}

/** Round to cents to avoid float drift. */
const roundMoney = (value) => Math.round(value * 100) / 100

function mapOrder(snapshot) {
  const data = snapshot.data()
  return { ...data, id: snapshot.id }
}

export class OrderService {
  /**
   * Create an order from { userId, items: [{ productId, quantity }], shippingAddress, payment }.
   * Fetches products from Firestore, validates existence + stock, prices each
   * item from the database, applies the 10% bulk discount at 6+ dozens, then
   * creates the order and decrements stock — all in one transaction.
   *
   * @returns {Promise<Object>} { id, orderNumber, ...order } — the created order.
   */
  async createOrder({ userId, items, shippingAddress, payment = 'COD' }) {
    const currentUserId = authService.getCurrentUserId()
    if (!currentUserId) throw new Error('User is not authenticated')
    if (userId !== currentUserId) throw new Error('Invalid order data')

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid order data')
    }

    // Merge duplicate product lines; only productId + quantity are accepted.
    const lines = new Map()
    for (const item of items) {
      const productId = String(item?.productId || '')
      const quantity = Number(item?.quantity)
      if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        throw new Error('Invalid order data')
      }
      lines.set(productId, (lines.get(productId) || 0) + quantity)
    }

    const now = serverTimestamp()
    const orderNumber = `UW-${Date.now().toString().slice(-6)}`

    const orderId = await runTransaction(db, async (transaction) => {
      // ── 1. Read every product from the database (reads first) ──
      const lineSnapshots = []
      for (const [productId, quantity] of lines) {
        const productSnap = await transaction.get(doc(db, 'products', productId))
        if (!productSnap.exists()) throw new Error(`Product not found: ${productId}`)
        lineSnapshots.push({ productId, quantity, snap: productSnap })
      }

      // ── 2. Validate availability + stock against the database ──
      const orderItems = lineSnapshots.map(({ productId, quantity, snap }) => {
        const product = snap.data()
        if (product.available === false) {
          throw new Error(`Product is not available: ${product.name || productId}`)
        }
        if (product.stock != null && Number(product.stock) < quantity) {
          throw new Error(`Insufficient stock: ${product.name || productId}`)
        }
        return {
          productId,
          name: product.name,
          price: roundMoney(Number(product.price)),
          qty: quantity,
          image: product.image || '',
        }
      })

      // ── 3. Price from the database, never from the frontend ──
      const subtotal = roundMoney(cartSubtotal(orderItems.map((i) => ({ price: i.price, quantity: i.qty }))))
      const totalQty = cartQuantity(orderItems.map((i) => ({ quantity: i.qty })))
      const discount = roundMoney(bulkDiscount(orderItems.map((i) => ({ price: i.price, quantity: i.qty }))))
      const total = roundMoney(subtotal - discount)

      // ── 4. Decrement tracked stock (same transaction → no race conditions) ──
      for (const { productId, quantity, snap } of lineSnapshots) {
        const product = snap.data()
        if (product.stock != null) {
          transaction.update(doc(db, 'products', productId), {
            stock: Number(product.stock) - quantity,
            updatedAt: now,
          })
        }
      }

      // ── 5. Create the order ──
      const orderRef = doc(collection(db, ORDERS))
      transaction.set(orderRef, {
        orderNumber,
        userId,
        customer: {
          name: shippingAddress?.name || '',
          email: shippingAddress?.email || '',
          phone: shippingAddress?.phone || '',
        },
        address: [shippingAddress?.address, shippingAddress?.city, shippingAddress?.zip]
          .filter(Boolean)
          .join(', '),
        payment,
        items: orderItems,
        subtotal,
        discount,
        total,
        paymentStatus: 'pending',
        status: 'Placed',
        date: new Date().toISOString().split('T')[0],
        createdAt: now,
        updatedAt: now,
      })
      return orderRef.id
    })

    const order = await this.getOrderById(orderId)

    // Fire-and-forget: the order is already committed; an email failure must
    // never turn a successful order into a failed one.
    this._sendEmailEvent(order, ORDER_EMAIL_EVENTS.CONFIRMED.key)

    return order
  }

  /** A single order. Throws 'Order not found'. */
  async getOrderById(orderId) {
    const snap = await getDoc(doc(db, ORDERS, orderId))
    if (!snap.exists()) throw new Error('Order not found')
    return mapOrder(snap)
  }

  /** A user's orders, newest first. */
  async getUserOrders(userId) {
    const snap = await getDocs(
      query(collection(db, ORDERS), where('userId', '==', userId), orderBy('createdAt', 'desc'))
    )
    return snap.docs.map(mapOrder)
  }

  /** All orders (admin dashboard), newest first. */
  async getAllOrders() {
    const snap = await getDocs(query(collection(db, ORDERS), orderBy('createdAt', 'desc')))
    return snap.docs.map(mapOrder)
  }

  /** Set an order's status. Cancelling restocks the items. */
  async updateOrderStatus(orderId, status) {
    if (!ORDER_STATUSES.includes(status)) throw new Error('Invalid order status')
    if (status === 'Cancelled') return this.cancelOrder(orderId)

    const orderSnap = await getDoc(doc(db, ORDERS, orderId))
    if (!orderSnap.exists()) throw new Error('Order not found')

    // No-op when the status hasn't changed: skip the write AND the email,
    // so repeated PROCESSING→PROCESSING updates never resend notifications.
    const current = orderSnap.data()
    if (current.status === status) return mapOrder(orderSnap)

    await updateDoc(doc(db, ORDERS, orderId), { status, updatedAt: serverTimestamp() })
    const order = mapOrder(await getDoc(doc(db, ORDERS, orderId)))

    const eventFn = ORDER_STATUS_EMAIL[status]
    if (eventFn) this._sendEmailEvent(order, eventFn(order))
    return order
  }

  /**
   * Record ShipStation tracking info and notify the customer.
   * Persists trackingNumber/carrier/trackingUrl/shipDate, then fires the
   * shipped email (once — guarded by emailEvents.shipped).
   */
  async updateShippingInformation(orderId, { trackingNumber, carrier, trackingUrl: explicitTrackingUrl, shipDate } = {}) {
    if (!orderId || !trackingNumber) throw new Error('Invalid shipping data')

    const orderSnap = await getDoc(doc(db, ORDERS, orderId))
    if (!orderSnap.exists()) throw new Error('Order not found')
    const current = orderSnap.data()
    if (current.status === 'Cancelled') throw new Error('Cannot ship a cancelled order')

    // Prefer an explicit tracking URL; otherwise derive the real carrier
    // tracking page from the carrier + tracking number.
    const url = explicitTrackingUrl || trackingUrl(carrier, trackingNumber)

    await updateDoc(doc(db, ORDERS, orderId), {
      trackingNumber,
      carrier: carrier || '',
      trackingUrl: url && url !== '#' ? url : '',
      shipDate: shipDate || new Date().toISOString().split('T')[0],
      updatedAt: serverTimestamp(),
    })

    const order = mapOrder(await getDoc(doc(db, ORDERS, orderId)))
    this._sendEmailEvent(order, ORDER_EMAIL_EVENTS.SHIPPED.key)
    return order
  }

  /**
   * Record a refund on the order (backend confirmation that a refund was
   * initiated) and notify the customer. The refunded email never fires
   * without this recorded data.
   */
  async refundOrder(orderId, { amount, method = 'Stripe', note = '' } = {}) {
    const amountNum = Number(amount)
    if (!orderId || !Number.isFinite(amountNum) || amountNum < 0) {
      throw new Error('Invalid refund data')
    }

    const orderSnap = await getDoc(doc(db, ORDERS, orderId))
    if (!orderSnap.exists()) throw new Error('Order not found')
    const current = orderSnap.data()
    if (current.refund) throw new Error('Refund already recorded for this order')

    const refund = {
      amount: roundMoney(amountNum),
      date: new Date().toISOString().split('T')[0],
      status: 'initiated',
      method,
    }
    if (note) refund.note = note

    await updateDoc(doc(db, ORDERS, orderId), { refund, updatedAt: serverTimestamp() })
    const order = mapOrder(await getDoc(doc(db, ORDERS, orderId)))
    this._sendEmailEvent(order, ORDER_EMAIL_EVENTS.REFUNDED.key)
    return order
  }

  /** Cancel an order and restore stock to the products (atomic). */
  async cancelOrder(orderId) {
    const now = serverTimestamp()
    await runTransaction(db, async (transaction) => {
      const orderSnap = await transaction.get(doc(db, ORDERS, orderId))
      if (!orderSnap.exists()) throw new Error('Order not found')
      const order = orderSnap.data()
      if (order.status === 'Cancelled') return
      if (order.status === 'Delivered') {
        throw new Error('Cannot cancel a delivered order')
      }

      for (const item of order.items || []) {
        const productSnap = await transaction.get(doc(db, 'products', item.productId))
        if (productSnap.exists()) {
          const stock = productSnap.data().stock
          if (stock != null) {
            transaction.update(doc(db, 'products', item.productId), {
              stock: Number(stock) + item.qty,
              updatedAt: now,
            })
          }
        }
      }

      transaction.update(orderSnap.ref, { status: 'Cancelled', updatedAt: now })
    })

    const order = await this.getOrderById(orderId)

    this._sendEmailEvent(order, ORDER_EMAIL_EVENTS.CANCELLED.key)
    // Only when the backend actually recorded a refund do we also notify
    // about it — never assumed from the cancellation alone.
    if (order?.refund) this._sendEmailEvent(order, ORDER_EMAIL_EVENTS.REFUNDED.key)

    return order
  }

  /**
   * Best-effort transactional email, guarded against duplicates.
   *
   * Sends `eventKey`'s email for `order` and records it in
   * `order.emailEvents.<key>` only after a successful send. Failures are
   * logged and simply retried on the next relevant order update — they never
   * propagate to the caller. Orders without a customer email are skipped.
   */
  async _sendEmailEvent(order, eventKey) {
    try {
      if (!order?.id || order.emailEvents?.[eventKey]) return

      const senders = {
        [ORDER_EMAIL_EVENTS.CONFIRMED.key]: () => emailService.sendOrderConfirmation(order),
        [ORDER_EMAIL_EVENTS.PROCESSING.key]: () => emailService.sendOrderProcessing(order),
        [ORDER_EMAIL_EVENTS.SHIPPED.key]: () => emailService.sendOrderShipped(order),
        [ORDER_EMAIL_EVENTS.DELIVERED.key]: () => emailService.sendOrderDelivered(order),
        [ORDER_EMAIL_EVENTS.CANCELLED.key]: () => emailService.sendOrderCancelled(order),
        [ORDER_EMAIL_EVENTS.REFUNDED.key]: () => emailService.sendOrderRefunded(order),
      }
      const sender = senders[eventKey]
      if (!sender) return

      const result = await sender()
      if (result?.skipped) return // no customer email — retry on a later update

      await updateDoc(doc(db, ORDERS, order.id), {
        [`emailEvents.${eventKey}`]: true,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      // Log the event only — never the order payload (PII) or credentials.
      console.warn(
        `[OrderService] Email "${eventKey}" for order ${order?.id} failed — will retry on next update.`,
        error?.message || error
      )
    }
  }
}

/** Singleton — import this everywhere. */
export const orderService = new OrderService()
