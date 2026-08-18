// Email branding + runtime configuration.
//
// Single source of truth for brand values used by every email template —
// never hardcode colors/URLs inside templates. Values map to the existing
// design system in src/app/globals.css (navy-950, gold-500, cream-100 …).
//
// This module is safe to import from both client and server code. Secrets
// (RESEND_API_KEY) never live here — they stay in the server-only provider.

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '')

export const EMAIL_BRAND = {
  name: "Uncle Walt's Churros",
  primaryColor: '#c9962c', // gold-500 — CTAs, accents
  primaryColorHover: '#d4a843', // gold-400
  primaryLight: '#fdf3dc', // gold-100 — tinted surfaces
  headerColor: '#0b1226', // navy-950
  navy800: '#132244',
  textColor: '#2b2b2b', // charcoal-700 — body text
  mutedColor: '#6b7280', // neutral body secondary
  backgroundColor: '#faf7f0', // cream-100 — email canvas
  cardColor: '#ffffff',
  borderColor: '#f3ede1', // cream-200
  logoUrl: `${APP_URL}/logo.png`,
  websiteUrl: APP_URL,
  contactEmail: 'hello@unclewalts.com',
  supportEmail: 'hello@unclewalts.com',
}

// Status badge palette — keyed by canonical email event names.
export const EMAIL_STATUS_COLORS = {
  confirmed: { label: 'Confirmed', bg: '#fdf3dc', text: '#8a6d1f' },
  processing: { label: 'Processing', bg: '#fef3c7', text: '#92400e' },
  shipped: { label: 'Shipped', bg: '#e0f2fe', text: '#075985' },
  delivered: { label: 'Delivered', bg: '#dcfce7', text: '#166534' },
  cancelled: { label: 'Cancelled', bg: '#fee2e2', text: '#991b1b' },
  refunded: { label: 'Refunded', bg: '#ede9fe', text: '#5b21b6' },
}

// ── URLs ─────────────────────────────────────────────────────────────────────
// The app has no customer-facing order detail page today; /confirmation is the
// order receipt route. Point ORDER_PAGE_PATH at a real /orders/[id] route if
// one is added. The full URL is always derived from the configured APP_URL.

const ORDER_PAGE_PATH = '/confirmation'

export function getOrderUrl(order) {
  return `${APP_URL}${ORDER_PAGE_PATH}`
}

export function getProductReviewUrl(item) {
  if (!item || item.productId == null) return null
  return `${APP_URL}/shop/${encodeURIComponent(item.productId)}#reviews-heading`
}

// ── Formatting ───────────────────────────────────────────────────────────────

/** "$1,299.00" — USD, thousands separated, 2 decimals. */
export function formatMoney(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return ''
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

/** Human-friendly date from YYYY-MM-DD, ISO string, Date or Firestore Timestamp. */
export function formatDate(value) {
  if (value == null || value === '') return ''
  try {
    const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}
