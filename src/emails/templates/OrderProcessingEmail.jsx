// Order Processing email — sent when the order moves into preparation.
//
// Data contract (provided by the service layer — templates never fetch):
// {
//   order: { customer: {name}, orderNumber, date, payment, paymentStatus,
//            items: [{name, qty, price, image}], subtotal, discount, tax,
//            shipping?, total },
//   orderNumber: string,
//   orderUrl: string
// }

import EmailLayout from '@/emails/components/EmailLayout'
import EmailButton from '@/emails/components/EmailButton'
import OrderFacts from '@/emails/components/OrderFacts'
import OrderSummary from '@/emails/components/OrderSummary'

const SERIF = "Georgia, 'Times New Roman', serif"

export default function OrderProcessingEmail({ data }) {
  const { order, orderNumber, orderUrl } = data
  const customerName = order?.customer?.name || 'there'

  return (
    <EmailLayout preheader={`We're preparing your order #${orderNumber}.`}>
      <h1
        style={{
          margin: '0 0 6px',
          fontFamily: SERIF,
          fontSize: '22px',
          fontWeight: 700,
          color: '#0b1226',
        }}
      >
        We&apos;re preparing your order
      </h1>
      <p style={{ margin: '0 0 18px', fontSize: '15px', color: '#2b2b2b' }}>
        Hi {customerName}, your order <strong>#{orderNumber}</strong> is now being prepared. We&apos;ll let you know
        the moment it ships.
      </p>

      <OrderFacts
        orderNumber={orderNumber}
        orderDate={order?.date}
        payment={order?.payment}
        paymentStatus={order?.paymentStatus}
        status="processing"
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
    </EmailLayout>
  )
}
