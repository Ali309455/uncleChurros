// Centralized mapping between order lifecycle events and email templates.
// Single source of truth — templates are referenced by their canonical key
// everywhere (EmailService, API routes, OrderService, preview tooling), so
// event strings are never scattered around the codebase.

/**
 * @typedef {Object} EmailEventMeta
 * @property {string} key         Storage key used for idempotency (emailEvents.<key>)
 * @property {(order: Object) => string} subject
 */

const subject = (text) => (order) => {
  const orderNumber = order?.orderNumber || order?.id || ''
  return text.replace('{{orderNumber}}', orderNumber)
}

export const ORDER_EMAIL_EVENTS = {
  CONFIRMED: {
    key: 'confirmation',
    subject: subject('Your order #{{orderNumber}} has been confirmed'),
  },
  PROCESSING: {
    key: 'processing',
    subject: subject("We're preparing your order #{{orderNumber}}"),
  },
  SHIPPED: {
    key: 'shipped',
    subject: subject('Your order #{{orderNumber}} is on its way'),
  },
  DELIVERED: {
    key: 'delivered',
    subject: subject('Your order #{{orderNumber}} has been delivered'),
  },
  CANCELLED: {
    key: 'cancelled',
    subject: subject('Your order #{{orderNumber}} has been cancelled'),
  },
  REFUNDED: {
    key: 'refunded',
    subject: subject('Your refund for order #{{orderNumber}}'),
  },
}

/** Template name → event meta. Keys match template file names. */
export const EMAIL_EVENT_META = Object.fromEntries(
  Object.entries(ORDER_EMAIL_EVENTS).map(([name, meta]) => [meta.key, { ...meta, name }])
)

/** All template keys, used to validate API input. */
export const EMAIL_TEMPLATE_KEYS = Object.keys(EMAIL_EVENT_META)

/** Get event meta by canonical key; throws for unknown keys. */
export function getEmailEvent(key) {
  const meta = EMAIL_EVENT_META[key]
  if (!meta) throw new Error(`Unknown email template: ${key}`)
  return meta
}
