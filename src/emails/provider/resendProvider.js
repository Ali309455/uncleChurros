// Server-only email provider — the ONLY module allowed to touch Resend.
//
// Kept isolated so the provider can be swapped (e.g. for Postmark or SES)
// without touching templates or EmailService. Runs inside the /api/email
// route handlers so the API key never reaches the client.
//
// Demo mode: when RESEND_API_KEY is missing (the default in this repo),
// sendEmail resolves as a successful demo delivery instead of failing.

import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export const EMAIL_FROM = process.env.EMAIL_FROM || "Uncle Walt's Churros <orders@unclewalts.com>"
export const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || process.env.CONTACT_EMAIL || 'hello@unclewalts.com'

/**
 * Send one transactional email.
 * @returns {Promise<{ok: boolean, id?: string, demo?: boolean}>}
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!resend) {
    console.info(`[email:demo] to=${to} subject="${subject}"`)
    return { ok: true, demo: true }
  }

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    replyTo: [EMAIL_REPLY_TO],
    subject,
    html,
    text,
  })

  if (error) throw new Error(error.message || 'Email provider error')
  return { ok: true, id: data?.id || null }
}
