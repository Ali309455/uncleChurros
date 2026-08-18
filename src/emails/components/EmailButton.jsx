// EmailButton — table-based CTA that stays clickable even when CSS is
// partially stripped (the anchor renders as a plain link).

import { EMAIL_BRAND } from '@/emails/config'

export default function EmailButton({ href, children, variant = 'primary', align = 'center' }) {
  const isPrimary = variant !== 'secondary'
  const bg = isPrimary ? EMAIL_BRAND.primaryColor : EMAIL_BRAND.cardColor
  const border = isPrimary ? EMAIL_BRAND.primaryColor : EMAIL_BRAND.primaryColor
  const color = isPrimary ? EMAIL_BRAND.headerColor : EMAIL_BRAND.headerColor

  return (
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
      <tbody>
        <tr>
          <td align={align} style={{ padding: '26px 0 8px' }}>
            <table role="presentation" cellPadding="0" cellSpacing="0" border="0">
              <tbody>
                <tr>
                  <td
                    style={{
                      borderRadius: '10px',
                      backgroundColor: bg,
                      border: `1px solid ${border}`,
                    }}
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '13px 30px',
                        fontFamily: "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                        fontSize: '14px',
                        fontWeight: 600,
                        letterSpacing: '0.3px',
                        color,
                        textDecoration: 'none',
                        borderRadius: '10px',
                      }}
                    >
                      {children}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
