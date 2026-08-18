// POST /api/email/send — the app's own email endpoint.
//
// The client-side EmailService posts { template, data } here; this route
// renders the template and delivers it through the (server-only) provider.
// The RESEND_API_KEY never leaves the server. In demo mode (no key) it
// simulates delivery so local development always succeeds.
//
// NOTE: in production, protect this route (e.g. admin auth) to prevent it
// being used as an open email relay.

import { sendEmail } from '@/emails/provider/resendProvider'
import { EMAIL_TEMPLATE_KEYS } from '@/emails/events'

// Rendering uses react-dom/server, so this route must run on the Node runtime.
export const runtime = 'nodejs'

export async function POST(request) {
  const { renderEmail } = await import('@/emails/renderEmail')

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { template, data } = body || {}
  if (!EMAIL_TEMPLATE_KEYS.includes(template)) {
    return Response.json({ error: `Unknown template "${template}"` }, { status: 400 })
  }
  if (!data || typeof data !== 'object') {
    return Response.json({ error: 'Missing email data' }, { status: 400 })
  }

  try {
    const { subject, html, text, to } = await renderEmail(template, data)
    const result = await sendEmail({ to, subject, html, text })
    console.info(`[email] sent template="${template}" to=${to} subject="${subject}" demo=${Boolean(result.demo)} id=${result.id || '-'}`)
    return Response.json(result)
  } catch (error) {
    // Never log the payload (may contain PII) or credentials.
    console.error(`[email] failed template="${template}"`, error?.message || error)
    return Response.json({ error: 'Email delivery failed' }, { status: 500 })
  }
}
