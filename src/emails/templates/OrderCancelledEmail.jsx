// Order Cancelled email — sent when the order is cancelled.
//
// Data contract (provided by the service layer — templates never fetch):
// {
//   order: { customer: {name}, orderNumber, date, cancelledAt?, payment,
//            paymentStatus, items, subtotal, discount, tax, shipping?, total,
//            refund?: { amount, date, status, method? } },
//   orderNumber: string,
//   orderUrl: string
// }
//
// Refund information is only shown when the backend actually recorded a
// refund on the order — never assumed.

import EmailLayout from '@/emails/components/EmailLayout'
import EmailButton from '@/emails/components/EmailButton'
import OrderFacts from '@/emails/components/OrderFacts'
import OrderSummary from '@/emails/components/OrderSummary'
import { formatDate, formatMoney } from '@/emails/config'

const SERIF = "Georgia, 'Times New Roman', serif"
const FONT = "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

export default function OrderCancelledEmail({ data }) {
  const { order, orderNumber, orderUrl } = data
  const customerName = order?.customer?.name || 'there'
  const refund = order?.refund
  const cancelledDate = formatDate(order?.cancelledAt || order?.updatedAt)

  return (
    <EmailLayout preheader={`Your order #${orderNumber} has been cancelled.`}>
      <h1
        style={{
          margin: '0 0 6px',
          fontFamily: SERIF,
          fontSize: '22px',
          fontWeight: 700,
          color: '#0b1226',
        }}
      >
        Order cancelled
      </h1>
      <p style={{ margin: '0 0 18px', fontSize: '15px', color: '#2b2b2b' }}>
        Hi {customerName}, your order <strong>#{orderNumber}</strong> has been cancelled
        {cancelledDate ? ` on ${cancelledDate}` : ''}. If you have any questions, reply to this email and
        we&apos;ll be happy to help.
      </p>

      <OrderFacts
        orderNumber={orderNumber}
        orderDate={order?.date}
        payment={order?.payment}
        paymentStatus={order?.paymentStatus}
        status="cancelled"
      />

      {refund && (
        <>
          <h2
            style={{
              margin: '26px 0 8px',
              fontFamily: SERIF,
              fontSize: '17px',
              fontWeight: 700,
              color: '#0b1226',
            }}
          >
            Refund information
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
              {formatDate(refund.date) && (
                <tr>
                  <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                    Refund date
                  </td>
                  <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', color: '#2b2b2b' }}>
                    {formatDate(refund.date)}
                  </td>
                </tr>
              )}
              {refund.status && (
                <tr>
                  <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                    Refund status
                  </td>
                  <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', color: '#2b2b2b' }}>
                    {refund.status}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      <h2
        style={{
          margin: '24px 0 8px',
          fontFamily: SERIF,
          fontSize: '17px',
          fontWeight: 700,
          color: '#0b1226',
        }}
      >
        Cancelled items
      </h2>
      <OrderSummary
        items={order?.items}
        subtotal={order?.subtotal}
        discount={order?.discount}
        shipping={order?.shipping}
        tax={order?.tax}
        total={order?.total}
      />

      <EmailButton href={orderUrl}>View Order</EmailButton>
    </EmailLayout>
  )
}
