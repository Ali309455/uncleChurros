// EmailLayout — the shared email document shell.
//
// Table-based layout with inline styles for reliable rendering across Gmail,
// Outlook, Apple Mail and mobile clients. No JavaScript, no external fonts,
// no CSS classes. The inner card collapses fluidly to the viewport width.

import { EMAIL_BRAND } from '@/emails/config'
import EmailHeader from '@/emails/components/EmailHeader'
import EmailFooter from '@/emails/components/EmailFooter'

const PADDING_X = '32px'

export default function EmailLayout({ children, preheader = '', showHeader = true, showFooter = true }) {
  return (
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
      {/* eslint-disable-next-line @next/next/no-head-element -- emails need a real <head>, not next/head */}
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>Uncle Walt&apos;s Churros</title>
      </head>
      <body style={{ margin: 0, padding: 0, width: '100%', backgroundColor: EMAIL_BRAND.backgroundColor }}>
        {preheader ? (
          <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden', msoHide: 'all' }}>
            {preheader}
          </div>
        ) : null}
        <table
          role="presentation"
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          border="0"
          style={{
            backgroundColor: EMAIL_BRAND.backgroundColor,
            width: '100%',
            padding: '24px 0',
          }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: '0 12px' }}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  border="0"
                  style={{
                    maxWidth: '600px',
                    width: '100%',
                    margin: '0 auto',
                    backgroundColor: EMAIL_BRAND.cardColor,
                    border: `1px solid ${EMAIL_BRAND.borderColor}`,
                    borderRadius: '14px',
                    overflow: 'hidden',
                  }}
                >
                  <tbody>
                    {showHeader && (
                      <tr>
                        <td>
                          <EmailHeader />
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td style={{ padding: `${PADDING_X} 0` }}>
                        <table
                          role="presentation"
                          width="100%"
                          cellPadding="0"
                          cellSpacing="0"
                          border="0"
                          style={{ width: '100%' }}
                        >
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  padding: `0 ${PADDING_X}`,
                                  fontFamily:
                                    "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                                  fontSize: '15px',
                                  lineHeight: '1.6',
                                  color: EMAIL_BRAND.textColor,
                                }}
                              >
                                {children}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    {showFooter && (
                      <tr>
                        <td>
                          <EmailFooter />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}
