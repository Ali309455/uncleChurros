// GET /api/email/preview?template=<key>
//
// Renders one template with its sample data and returns the raw HTML — for
// inspecting/pasting into Litmus, Email on Acid, etc. Never sends an email.

import { EMAIL_TEMPLATE_KEYS } from '@/emails/events'
import { getSampleOrder } from '@/emails/preview/sampleOrders'

// Rendering uses react-dom/server, so this route must run on the Node runtime.
export const runtime = 'nodejs'

export async function GET(request) {
  const { renderEmail } = await import('@/emails/renderEmail')

  const { searchParams } = new URL(request.url)
  const template = searchParams.get('template')
  const minimal = searchParams.get('minimal') === '1'

  if (!EMAIL_TEMPLATE_KEYS.includes(template)) {
    return Response.json({ error: `Unknown template "${template}"` }, { status: 400 })
  }

  try {
    const { html } = await renderEmail(template, getSampleOrder(template, { minimal }))
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (error) {
    console.error(`[email:preview] failed template="${template}"`, error?.message || error)
    return Response.json({ error: 'Preview failed' }, { status: 500 })
  }
}
