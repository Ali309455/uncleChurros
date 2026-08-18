// OrderFacts — compact "Order # / date / payment / status" fact table.
// Shared by every order email so the info layout stays consistent.

import { formatDate } from '@/emails/config'
import StatusBadge from '@/emails/components/StatusBadge'

const FONT = "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

/**
 * @param {Object} props
 * @param {string} props.orderNumber
 * @param {string} [props.orderDate]       raw date value (formatted inside)
 * @param {string} [props.payment]         'COD' | 'Stripe'
 * @param {string} [props.paymentStatus]   'pending' | 'paid'
 * @param {string} [props.status]          canonical email event key for the badge
 */
export default function OrderFacts({ orderNumber, orderDate, payment, paymentStatus, status }) {
  const rows = []

  if (orderNumber) rows.push({ label: 'Order #', value: orderNumber })
  const formattedDate = formatDate(orderDate)
  if (formattedDate) rows.push({ label: 'Order date', value: formattedDate })
  if (payment) rows.push({ label: 'Payment', value: payment === 'COD' ? 'Cash on Delivery' : payment })
  if (paymentStatus) {
    rows.push({
      label: 'Payment status',
      value: paymentStatus === 'paid' ? 'Paid' : paymentStatus === 'pending' ? 'Pending' : paymentStatus,
    })
  }

  return (
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style={{ width: '100%' }}>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.label}>
            <td
              style={{
                padding: `${index === 0 ? '6px' : '4px'} 0 4px`,
                width: '40%',
                fontFamily: FONT,
                fontSize: '13px',
                fontWeight: 600,
                color: '#6b7280',
              }}
            >
              {row.label}
            </td>
            <td
              style={{
                padding: `${index === 0 ? '6px' : '4px'} 0 4px`,
                fontFamily: FONT,
                fontSize: '13px',
                fontWeight: 500,
                color: '#2b2b2b',
              }}
            >
              {row.value}
            </td>
          </tr>
        ))}
        {status && (
          <tr>
            <td style={{ padding: '10px 0 4px', fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
              Order status
            </td>
            <td style={{ padding: '6px 0 4px' }}>
              <StatusBadge status={status} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
