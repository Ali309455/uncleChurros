// Order Refunded email — sent when the backend records a refund.
//
// Data contract (provided by the service layer — templates never fetch):
// {
//   order: { customer: {name}, orderNumber, date, payment, paymentStatus,
//            refund: { amount, date, status, method? } },
//   orderNumber: string,
//   orderUrl: string
// }
//
// Refund amounts/dates/status come exclusively from the order's recorded
// refund data — never invented.

import EmailLayout from '@/emails/components/EmailLayout'
import EmailButton from '@/emails/components/EmailButton'
import OrderFacts from '@/emails/components/OrderFacts'
import { formatDate, formatMoney } from '@/emails/config'

const SERIF = "Georgia, 'Times New Roman', serif"
const FONT = "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

export default function OrderRefundedEmail({ data }) {
  const { order, orderNumber, orderUrl } = data
  const customerName = order?.customer?.name || 'there'
  const refund = order?.refund || {}
  const refundDate = formatDate(refund.date)

  return (
    <EmailLayout preheader={`Your refund for order #${orderNumber}.`}>
      <h1
        style={{
          margin: '0 0 6px',
          fontFamily: SERIF,
          fontSize: '22px',
          fontWeight: 700,
          color: '#0b1226',
        }}
      >
        Refund processed
      </h1>
      <p style={{ margin: '0 0 18px', fontSize: '15px', color: '#2b2b2b' }}>
        Hi {customerName}, a refund has been initiated for your order <strong>#{orderNumber}</strong>.
        {refundDate ? ` The refund was processed on ${refundDate}.` : ''}
      </p>

      <OrderFacts
        orderNumber={orderNumber}
        orderDate={order?.date}
        payment={order?.payment}
        paymentStatus={order?.paymentStatus}
        status="refunded"
      />

      <h2
        style={{
          margin: '26px 0 8px',
          fontFamily: SERIF,
          fontSize: '17px',
          fontWeight: 700,
          color: '#0b1226',
        }}
      >
        Refund details
      </h2>
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style={{ width: '100%' }}>
        <tbody>
          {refund.amount != null && (
            <tr>
              <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#6b7280', width: '40%' }}>
                Refund amount
              </td>
              <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', color: '#2b2b2b' }}>
                {formatMoney(refund.amount)}
              </td>
            </tr>
          )}
          {refundDate && (
            <tr>
              <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                Refund date
              </td>
              <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', color: '#2b2b2b' }}>{refundDate}</td>
            </tr>
          )}
          {refund.status && (
            <tr>
              <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                Refund status
              </td>
              <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', color: '#2b2b2b' }}>{refund.status}</td>
            </tr>
          )}
          {refund.method && (
            <tr>
              <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                Payment method
              </td>
              <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', color: '#2b2b2b' }}>{refund.method}</td>
            </tr>
          )}
        </tbody>
      </table>

      <EmailButton href={orderUrl}>View Order</EmailButton>
    </EmailLayout>
  )
}
