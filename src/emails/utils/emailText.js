// Plain-text versions of every transactional email.
//
// Generated from the same order data as the HTML templates — no separate
// business logic. Each builder returns an array of text blocks (joined with
// blank lines by the renderer).

import { formatDate, formatMoney } from '@/emails/config'

const money = (v) => formatMoney(v) || ''

function orderLines(order) {
  const lines = []
  const items = order?.items || []
  if (items.length) {
    lines.push('Items:')
    for (const item of items) {
      const qty = Number(item?.qty ?? item?.quantity ?? 0)
      lines.push(`- ${item?.name || 'Item'} x${qty} — ${money(Number(item?.price || 0) * qty)}`)
    }
  }
  if (order?.subtotal != null) lines.push(`Subtotal: ${money(order.subtotal)}`)
  if (order?.shipping != null) lines.push(`Shipping: ${money(order.shipping)}`)
  if (order?.tax != null) lines.push(`Tax: ${money(order.tax)}`)
  if (Number(order?.discount) > 0) lines.push(`Discount: -${money(order.discount)}`)
  if (order?.total != null) lines.push(`Total: ${money(order.total)}`)
  return lines
}

function trackingLines(data) {
  const { order, trackingUrl, carrierLabel } = data
  const lines = []
  if (carrierLabel) lines.push(`Carrier: ${carrierLabel}`)
  if (order?.trackingNumber) lines.push(`Tracking number: ${order.trackingNumber}`)
  if (trackingUrl) {
    lines.push('')
    lines.push('Track your package:')
    lines.push(trackingUrl)
  }
  return lines
}

function refundLines(order) {
  const refund = order?.refund || {}
  const lines = []
  if (refund.amount != null) lines.push(`Refund amount: ${money(refund.amount)}`)
  if (formatDate(refund.date)) lines.push(`Refund date: ${formatDate(refund.date)}`)
  if (refund.status) lines.push(`Refund status: ${refund.status}`)
  return lines
}

function closing(order) {
  return [
    'Thank you for shopping with Uncle Walt\'s Churros.',
    '',
    'Questions? Contact us at hello@unclewalts.com',
  ]
}

export const PLAIN_TEXT_BUILDERS = {
  confirmation(data) {
    const order = data.order
    const customerName = order?.customer?.name || 'there'
    return [
      `Your order #${data.orderNumber} has been confirmed`,
      '',
      'Order confirmed',
      '',
      `Thank you for your order, ${customerName}. We've received your order and are getting it ready.`,
      '',
      `Order #: ${data.orderNumber}`,
      order?.date ? `Order date: ${order.date}` : '',
      order?.paymentStatus ? `Payment status: ${order.paymentStatus}` : '',
      '',
      ...orderLines(order),
      order?.address ? ['', `Shipping to: ${order.address}`] : [],
      '',
      `View your order: ${data.orderUrl}`,
      '',
      ...closing(order),
    ].flat()
  },

  processing(data) {
    const order = data.order
    const customerName = order?.customer?.name || 'there'
    return [
      `We're preparing your order #${data.orderNumber}`,
      '',
      "We're preparing your order",
      '',
      `Hi ${customerName}, your order #${data.orderNumber} is now being prepared. We'll let you know the moment it ships.`,
      '',
      `Order #: ${data.orderNumber}`,
      order?.date ? `Order date: ${order.date}` : '',
      '',
      ...orderLines(order),
      '',
      `View your order: ${data.orderUrl}`,
      '',
      ...closing(order),
    ].flat()
  },

  shipped(data) {
    const order = data.order
    const customerName = order?.customer?.name || 'there'
    return [
      `Your order #${data.orderNumber} is on its way`,
      '',
      'Your order is on its way',
      '',
      `Hi ${customerName}, good news — your order #${data.orderNumber} has shipped.`,
      '',
      `Order #: ${data.orderNumber}`,
      ...(order?.trackingNumber || data.trackingUrl ? trackingLines(data) : []),
      '',
      ...orderLines(order),
      '',
      `View your order: ${data.orderUrl}`,
      '',
      ...closing(order),
    ].flat()
  },

  delivered(data) {
    const order = data.order
    const customerName = order?.customer?.name || 'there'
    const deliveryDate = formatDate(order?.deliveredAt || order?.shipDate)
    const blocks = [
      `Your order #${data.orderNumber} has been delivered`,
      '',
      'Delivered!',
      '',
      `Hi ${customerName}, your order #${data.orderNumber} has been delivered.`,
    ]
    if (deliveryDate) blocks.push(`It arrived on ${deliveryDate}.`)
    blocks.push('')
    blocks.push(`Order #: ${data.orderNumber}`)
    blocks.push('')
    blocks.push(...orderLines(order))
    blocks.push('')
    blocks.push(`View your order: ${data.orderUrl}`)
    if (data.reviewUrl) {
      blocks.push('')
      blocks.push(`Leave a review: ${data.reviewUrl}`)
    }
    blocks.push('')
    blocks.push(...closing(order))
    return blocks
  },

  cancelled(data) {
    const order = data.order
    const customerName = order?.customer?.name || 'there'
    const cancelledDate = formatDate(order?.cancelledAt || order?.updatedAt)
    const blocks = [
      `Your order #${data.orderNumber} has been cancelled`,
      '',
      'Order cancelled',
      '',
      `Hi ${customerName}, your order #${data.orderNumber} has been cancelled${cancelledDate ? ` on ${cancelledDate}` : ''}.`,
    ]
    if (order?.refund) {
      blocks.push('')
      blocks.push(...refundLines(order))
    }
    blocks.push('')
    blocks.push(`Order #: ${data.orderNumber}`)
    blocks.push('')
    blocks.push(...orderLines(order))
    blocks.push('')
    blocks.push(`View order: ${data.orderUrl}`)
    blocks.push('')
    blocks.push(...closing(order))
    return blocks
  },

  refunded(data) {
    const order = data.order
    const customerName = order?.customer?.name || 'there'
    const refundDate = formatDate(order?.refund?.date)
    const blocks = [
      `Your refund for order #${data.orderNumber}`,
      '',
      'Refund processed',
      '',
      `Hi ${customerName}, a refund has been initiated for your order #${data.orderNumber}.`,
    ]
    if (refundDate) blocks.push(`The refund was processed on ${refundDate}.`)
    blocks.push('')
    blocks.push(`Order #: ${data.orderNumber}`)
    blocks.push('')
    blocks.push(...refundLines(order))
    blocks.push('')
    blocks.push(`View order: ${data.orderUrl}`)
    blocks.push('')
    blocks.push(...closing(order))
    return blocks
  },
}

/** Build the plain-text body for a template key + email context. */
export function buildPlainText(template, data) {
  const builder = PLAIN_TEXT_BUILDERS[template]
  if (!builder) return ''
  return builder(data)
    .flat()
    .filter((line) => line != null && line !== '')
    .join('\n\n')
}
