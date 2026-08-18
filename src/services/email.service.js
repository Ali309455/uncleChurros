// EmailService — the single client-side gateway for transactional email.
//
// Responsibilities:
//   - Public per-event methods (sendOrderConfirmation, …)
//   - Generic internal send() → POSTs to the app's own /api/email/send route
//
// Responsibilities it explicitly does NOT have:
//   - It never talks to Resend directly (that lives in the server-only
//     provider module behind /api/email/send, so the API key never reaches
//     the browser).
//   - It never renders templates (server-side renderer does).
//   - It never touches Firebase, ShipStation, or templates.
//
// In demo mode (no RESEND_API_KEY) the route simulates delivery, so calling
// these methods is always safe during local development.

const SEND_ENDPOINT = '/api/email/send'

export class EmailService {
  /**
   * Generic internal send. Payload is the raw order object — the server-side
   * renderer normalizes it into the email context.
   *
   * @param {Object} payload
   * @param {string} payload.template  canonical key from ORDER_EMAIL_EVENTS
   * @param {Object} payload.data      order-shaped data
   * @returns {Promise<{ok: boolean, demo?: boolean, id?: string, skipped?: boolean}>}
   */
  async send({ template, data }) {
    const to = data?.customer?.email
    if (!to || !String(to).includes('@')) {
      console.warn(`[EmailService] Skipped "${template}" — no customer email on order ${data?.id || data?.orderNumber || ''}`)
      return { ok: false, skipped: true }
    }

    const res = await fetch(SEND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template, data }),
    })

    if (!res.ok) {
      let message = `Email request failed (${res.status})`
      try {
        const body = await res.json()
        if (body?.error) message = body.error
      } catch {
        /* keep generic message */
      }
      throw new Error(message)
    }

    return res.json()
  }

  // ── Public per-event API ─────────────────────────────────────────────────

  sendOrderConfirmation(order) {
    return this.send({ template: 'confirmation', data: order })
  }

  sendOrderProcessing(order) {
    return this.send({ template: 'processing', data: order })
  }

  sendOrderShipped(order) {
    return this.send({ template: 'shipped', data: order })
  }

  sendOrderDelivered(order) {
    return this.send({ template: 'delivered', data: order })
  }

  sendOrderCancelled(order) {
    return this.send({ template: 'cancelled', data: order })
  }

  sendOrderRefunded(order) {
    return this.send({ template: 'refunded', data: order })
  }
}

/** Singleton — import this everywhere. */
export const emailService = new EmailService()
