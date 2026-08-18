// EmailHeader — navy brand band with logo + brand name.
// Logo falls back to a plain-text brand lockup when the image cannot load.

import { EMAIL_BRAND } from '@/emails/config'

const SERIF_STACK = "Georgia, 'Times New Roman', serif"

export default function EmailHeader({ tagline = null }) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border="0"
      style={{
        backgroundColor: EMAIL_BRAND.headerColor,
        borderBottom: `4px solid ${EMAIL_BRAND.primaryColor}`,
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '28px 32px' }}>
            <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'middle' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> is required for email clients */}
                    <img
                      src={EMAIL_BRAND.logoUrl}
                      alt={EMAIL_BRAND.name}
                      width="44"
                      height="44"
                      style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        borderRadius: '10px',
                      }}
                    />
                    <span
                      style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        marginLeft: '14px',
                        fontFamily: SERIF_STACK,
                        fontSize: '21px',
                        fontWeight: 700,
                        letterSpacing: '0.2px',
                        color: '#f8f7f2',
                      }}
                    >
                      {EMAIL_BRAND.name}
                    </span>
                  </td>
                </tr>
                {tagline && (
                  <tr>
                    <td
                      style={{
                        paddingTop: '10px',
                        fontFamily: SERIF_STACK,
                        fontSize: '13px',
                        fontStyle: 'italic',
                        color: 'rgba(248, 247, 242, 0.65)',
                      }}
                    >
                      {tagline}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
