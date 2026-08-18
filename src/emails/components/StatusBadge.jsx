// StatusBadge — pill-shaped status indicator for order emails.

import { EMAIL_STATUS_COLORS } from '@/emails/config'

const FALLBACK = { label: 'Pending', bg: '#f3f4f6', text: '#374151' }

/**
 * @param {string} status  Canonical event key: confirmed | processing |
 *                         shipped | delivered | cancelled | refunded
 */
export default function StatusBadge({ status }) {
  const s = EMAIL_STATUS_COLORS[status] || FALLBACK
  return (
    <table role="presentation" cellPadding="0" cellSpacing="0" border="0" style={{ display: 'inline-table' }}>
      <tbody>
        <tr>
          <td
            style={{
              borderRadius: '999px',
              backgroundColor: s.bg,
              padding: '6px 14px',
              fontFamily: "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              color: s.text,
            }}
          >
            {s.label}
          </td>
        </tr>
      </tbody>
    </table>
  )
}
