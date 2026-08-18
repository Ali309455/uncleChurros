// Server-only email renderer.
//
// Renders a template to static HTML + plain text from the same data, and
// normalizes an order into the "email context" the templates receive.
// Templates stay purely presentational — all linking/formatting decisions
// (order URL, tracking URL, carrier label, review URL) happen here.
//
// IMPORTANT: this module uses react-dom/server and must never be imported
// from client code. It is loaded dynamically by the /api/email routes.

import { createElement } from 'react'
import { getEmailEvent } from '@/emails/events'
import { getOrderUrl, getProductReviewUrl } from '@/emails/config'
import { buildPlainText } from '@/emails/utils/emailText'
import { trackingUrl, carrierLabel } from '@/services/shipstation'

import OrderConfirmationEmail from '@/emails/templates/OrderConfirmationEmail'
import OrderProcessingEmail from '@/emails/templates/OrderProcessingEmail'
import OrderShippedEmail from '@/emails/templates/OrderShippedEmail'
import OrderDeliveredEmail from '@/emails/templates/OrderDeliveredEmail'
import OrderCancelledEmail from '@/emails/templates/OrderCancelledEmail'
import OrderRefundedEmail from '@/emails/templates/OrderRefundedEmail'

const TEMPLATES = {
  confirmation: OrderConfirmationEmail,
  processing: OrderProcessingEmail,
  shipped: OrderShippedEmail,
  delivered: OrderDeliveredEmail,
  cancelled: OrderCancelledEmail,
  refunded: OrderRefundedEmail,
}

function orderNumber(order) {
  return String(order?.orderNumber || order?.id || '')
}

/** Normalize an order object into the shared email context. */
export function buildEmailContext(order) {
  const orderId = order?.id
  const firstItem = (order?.items || [])[0] || null

  let tracking = null
  if (order?.trackingNumber) {
    const url = order.trackingUrl || trackingUrl(order.carrier, order.trackingNumber)
    tracking = {
      url: url && url !== '#' ? url : null,
      label: order.carrier ? carrierLabel(order.carrier) : null,
    }
  }

  return {
    order,
    orderNumber: orderNumber(order),
    orderUrl: getOrderUrl(order),
    trackingUrl: tracking?.url || null,
    carrierLabel: tracking?.label || null,
    reviewUrl: firstItem ? getProductReviewUrl(firstItem) : null,
  }
}

/**
 * Render an email template to { subject, html, text }.
 * @param {string} template  canonical key from ORDER_EMAIL_EVENTS
 * @param {Object} order     order-shaped data (see buildEmailContext)
 */
export async function renderEmail(template, order) {
  // Dynamic import keeps react-dom/server out of Turbopack's static graph —
  // this module is only ever loaded by the server-side API routes.
  const { renderToStaticMarkup } = await import('react-dom/server')

  const meta = getEmailEvent(template)
  const Component = TEMPLATES[template]
  if (!Component) throw new Error(`No template registered for "${template}"`)

  const data = buildEmailContext(order)
  const html = renderToStaticMarkup(createElement(Component, { data }))
  const text = buildPlainText(template, data)
  const subject = meta.subject(data)

  return { subject, html, text, to: order?.customer?.email || '' }
}
