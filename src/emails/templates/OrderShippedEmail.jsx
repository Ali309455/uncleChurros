// Order Shipped email — sent with ShipStation tracking information.
//
// Data contract (provided by the service layer — templates never fetch):
// {
//   order: { customer: {name}, orderNumber, date, items, subtotal, discount,
//            tax, shipping?, total, trackingNumber, carrier, shipDate },
//   orderNumber: string,
//   orderUrl: string,
//   trackingUrl: string|null,     // real tracking URL, or null to omit section
//   carrierLabel: string|null     // human label, e.g. "USPS"
// }

import EmailLayout from '@/emails/components/EmailLayout'
import EmailButton from '@/emails/components/EmailButton'
import OrderFacts from '@/emails/components/OrderFacts'
import OrderSummary from '@/emails/components/OrderSummary'
import { formatDate } from '@/emails/config'

const SERIF = "Georgia, 'Times New Roman', serif"
const FONT = "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

export default function OrderShippedEmail({ data }) {
  const { order, orderNumber, orderUrl, trackingUrl, carrierLabel } = data
  const customerName = order?.customer?.name || 'there'
  const trackingNumber = order?.trackingNumber
  const shipDate = order?.shipDate
  const hasTracking = trackingNumber || trackingUrl

  return (
    <EmailLayout preheader={`Your order #${orderNumber} is on its way.`}>
      <h1
        style={{
          margin: '0 0 6px',
          fontFamily: SERIF,
          fontSize: '22px',
          fontWeight: 700,
          color: '#0b1226',
        }}
      >
        Your order is on its way
      </h1>
      <p style={{ margin: '0 0 18px', fontSize: '15px', color: '#2b2b2b' }}>
        Hi {customerName}, good news — your order <strong>#{orderNumber}</strong> has shipped.
      </p>

      <OrderFacts
        orderNumber={orderNumber}
        orderDate={order?.date}
        payment={order?.payment}
        paymentStatus={order?.paymentStatus}
        status="shipped"
      />

      {hasTracking && (
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
            Tracking information
          </h2>
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style={{ width: '100%' }}>
            <tbody>
              {carrierLabel && (
                <tr>
                  <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#6b7280', width: '40%' }}>
                    Carrier
                  </td>
                  <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', color: '#2b2b2b' }}>
                    {carrierLabel}
                  </td>
                </tr>
              )}
              {trackingNumber && (
                <tr>
                  <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                    Tracking number
                  </td>
                  <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', color: '#2b2b2b', wordBreak: 'break-all' }}>
                    {trackingNumber}
                  </td>
                </tr>
              )}
              {formatDate(shipDate) && (
                <tr>
                  <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                    Shipping date
                  </td>
                  <td style={{ padding: '4px 0', fontFamily: FONT, fontSize: '13px', color: '#2b2b2b' }}>
                    {formatDate(shipDate)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {trackingUrl && <EmailButton href={trackingUrl}>Track Your Package</EmailButton>}
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

      <EmailButton href={orderUrl} variant="secondary">
        View Your Order
      </EmailButton>
    </EmailLayout>
  )
}
