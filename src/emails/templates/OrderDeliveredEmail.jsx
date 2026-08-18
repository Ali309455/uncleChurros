// Order Delivered email — sent when the order is marked delivered.
//
// Data contract (provided by the service layer — templates never fetch):
// {
//   order: { customer: {name}, orderNumber, date, deliveredAt?, items,
//            subtotal, discount, tax, shipping?, total },
//   orderNumber: string,
//   orderUrl: string,
//   reviewUrl: string|null         // optional "Leave a Review" CTA
// }

import EmailLayout from '@/emails/components/EmailLayout'
import EmailButton from '@/emails/components/EmailButton'
import OrderFacts from '@/emails/components/OrderFacts'
import OrderSummary from '@/emails/components/OrderSummary'
import { formatDate } from '@/emails/config'

const SERIF = "Georgia, 'Times New Roman', serif"

export default function OrderDeliveredEmail({ data }) {
  const { order, orderNumber, orderUrl, reviewUrl } = data
  const customerName = order?.customer?.name || 'there'
  const deliveryDate = formatDate(order?.deliveredAt || order?.shipDate)

  return (
    <EmailLayout preheader={`Your order #${orderNumber} has been delivered.`}>
      <h1
        style={{
          margin: '0 0 6px',
          fontFamily: SERIF,
          fontSize: '22px',
          fontWeight: 700,
          color: '#0b1226',
        }}
      >
        Delivered!
      </h1>
      <p style={{ margin: '0 0 18px', fontSize: '15px', color: '#2b2b2b' }}>
        Hi {customerName}, your order <strong>#{orderNumber}</strong> has been delivered.
        {deliveryDate ? ` It arrived on ${deliveryDate}.` : ''} We hope you enjoy every bite!
      </p>

      <OrderFacts orderNumber={orderNumber} orderDate={order?.date} status="delivered" />

      <h2
        style={{
          margin: '26px 0 8px',
          fontFamily: SERIF,
          fontSize: '17px',
          fontWeight: 700,
          color: '#0b1226',
        }}
      >
        Order summary
      </h2>
      <OrderSummary
        items={order?.items}
        subtotal={order?.subtotal}
        discount={order?.discount}
        shipping={order?.shipping}
        tax={order?.tax}
        total={order?.total}
      />

      <EmailButton href={orderUrl}>View Your Order</EmailButton>
      {reviewUrl && (
        <EmailButton href={reviewUrl} variant="secondary">
          Leave a Review
        </EmailButton>
      )}
    </EmailLayout>
  )
}
