// OrderSummary — reusable line-item + totals table for order emails.
// Renders only the pricing fields that exist in the order data; a missing
// image falls back to a tinted placeholder tile with the first initial.

import { EMAIL_BRAND, formatMoney } from '@/emails/config'

const FONT = "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"

function LineImage({ item }) {
  if (item.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- plain <img> is required for email clients
      <img
        src={item.image}
        alt=""
        width="48"
        height="48"
        style={{
          display: 'block',
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          border: `1px solid ${EMAIL_BRAND.borderColor}`,
        }}
      />
    )
  }
  return (
    <table
      role="presentation"
      cellPadding="0"
      cellSpacing="0"
      border="0"
      style={{
        width: '48px',
        height: '48px',
        backgroundColor: EMAIL_BRAND.primaryLight,
        borderRadius: '8px',
        border: `1px solid ${EMAIL_BRAND.borderColor}`,
      }}
    >
      <tbody>
        <tr>
          <td
            align="center"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: '20px',
              fontWeight: 700,
              color: EMAIL_BRAND.primaryColor,
            }}
          >
            {(String(item.name || '?').charAt(0) || '?').toUpperCase()}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function Row({ label, value, strong = false, muted = false, finalRow = false }) {
  return (
    <tr>
      <td
        style={{
          padding: `${finalRow ? '14px' : '5px'} 0 5px`,
          fontFamily: FONT,
          fontSize: strong ? '16px' : '13px',
          fontWeight: strong ? 700 : 400,
          color: muted ? EMAIL_BRAND.mutedColor : EMAIL_BRAND.textColor,
          borderTop: finalRow ? `2px solid ${EMAIL_BRAND.headerColor}` : 'none',
        }}
      >
        {label}
      </td>
      <td
        align="right"
        style={{
          padding: `${finalRow ? '14px' : '5px'} 0 5px`,
          fontFamily: FONT,
          fontSize: strong ? '16px' : '13px',
          fontWeight: strong ? 700 : 400,
          color: muted ? EMAIL_BRAND.mutedColor : EMAIL_BRAND.textColor,
          borderTop: finalRow ? `2px solid ${EMAIL_BRAND.headerColor}` : 'none',
        }}
      >
        {value}
      </td>
    </tr>
  )
}

/**
 * @param {Object} props
 * @param {Array<{name: string, qty: number, price: number, image?: string}>} props.items
 * @param {number} props.subtotal
 * @param {number} [props.discount]   shown only when > 0
 * @param {number} [props.shipping]   shown only when present
 * @param {number} [props.tax]        shown only when present
 * @param {number} props.total
 */
export default function OrderSummary({ items = [], subtotal, discount, shipping, tax, total }) {
  const hasShipping = shipping != null && Number.isFinite(Number(shipping))
  const hasTax = tax != null && Number.isFinite(Number(tax))
  const hasDiscount = Number(discount) > 0

  return (
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style={{ width: '100%' }}>
      <tbody>
        {items.map((item, index) => {
          const qty = Number(item?.qty ?? item?.quantity ?? 0)
          const price = Number(item?.price ?? 0)
          const lineTotal = qty * price
          return (
            <tr key={`${item?.productId ?? ''}-${index}`}>
              <td
                style={{
                  padding: '10px 0',
                  borderTop: index === 0 ? `1px solid ${EMAIL_BRAND.borderColor}` : `1px solid ${EMAIL_BRAND.borderColor}`,
                  verticalAlign: 'top',
                }}
              >
                <table role="presentation" cellPadding="0" cellSpacing="0" border="0">
                  <tbody>
                    <tr>
                      <td style={{ paddingRight: '12px', verticalAlign: 'top' }}>
                        <LineImage item={item} />
                      </td>
                      <td style={{ verticalAlign: 'top' }}>
                        <p
                          style={{
                            margin: '1px 0 3px',
                            fontFamily: FONT,
                            fontSize: '14px',
                            fontWeight: 600,
                            color: EMAIL_BRAND.textColor,
                          }}
                        >
                          {item?.name || 'Item'}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: FONT,
                            fontSize: '12px',
                            color: EMAIL_BRAND.mutedColor,
                          }}
                        >
                          {formatMoney(price)} × {qty}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td
                align="right"
                style={{
                  padding: '10px 0',
                  borderTop: `1px solid ${EMAIL_BRAND.borderColor}`,
                  verticalAlign: 'top',
                  fontFamily: FONT,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: EMAIL_BRAND.textColor,
                  whiteSpace: 'nowrap',
                }}
              >
                {formatMoney(lineTotal)}
              </td>
            </tr>
          )
        })}

        <Row label="Subtotal" value={formatMoney(subtotal)} />
        {hasShipping && <Row label="Shipping" value={formatMoney(shipping)} />}
        {hasTax && <Row label="Tax" value={formatMoney(tax)} />}
        {hasDiscount && <Row label="Discount" value={`− ${formatMoney(discount)}`} muted />}
        <Row label="Total" value={formatMoney(total)} strong finalRow />
      </tbody>
    </table>
  )
}
