// Order Confirmation email — sent when the order is placed.
//
// Data contract (provided by the service layer — templates never fetch):
// {
//   order: { customer: {name, email}, address, orderNumber, date, payment,
//            paymentStatus, status, items: [{name, qty, price, image}],
//            subtotal, discount, shipping?, tax?, total },
//   orderNumber: string,
//   orderUrl: string
// }

import EmailLayout from '@/emails/components/EmailLayout'
import EmailButton from '@/emails/components/EmailButton'
import OrderFacts from '@/emails/components/OrderFacts'
import OrderSummary from '@/emails/components/OrderSummary'

const SERIF = "Georgia, 'Times New Roman', serif"

export default function OrderConfirmationEmail({ data }) {
  const { order, orderNumber, orderUrl } = data
  const customerName = order?.customer?.name || 'there'
  const address = order?.address

  return (
    <EmailLayout preheader={`Thanks for your order, ${customerName}. Your order #${orderNumber} is confirmed.`}>
      <h1
        style={{
          margin: '0 0 6px',
          fontFamily: SERIF,
          fontSize: '22px',
          fontWeight: 700,
          color: '#0b1226',
        }}
      >
        Order confirmed
      </h1>
      <p style={{ margin: '0 0 18px', fontSize: '15px', color: '#2b2b2b' }}>
        Thank you for your order, <strong>{customerName}</strong>. We&apos;ve received your order and are getting it
        ready.
      </p>

      <OrderFacts
        orderNumber={orderNumber}
        orderDate={order?.date}
        payment={order?.payment}
        paymentStatus={order?.paymentStatus}
        status="confirmed"
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

      {address && (
        <>
          <h2
            style={{
              margin: '24px 0 6px',
              fontFamily: SERIF,
              fontSize: '17px',
              fontWeight: 700,
              color: '#0b1226',
            }}
          >
            Shipping to
          </h2>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#2b2b2b' }}>{address}</p>
        </>
      )}

      <EmailButton href={orderUrl}>View Your Order</EmailButton>
    </EmailLayout>
  )
}
