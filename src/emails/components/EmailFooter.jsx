// EmailFooter — brand, support contact, website link, copyright.
// No invented social URLs; contact info comes from the app's own branding.

import { EMAIL_BRAND } from '@/emails/config'

export default function EmailFooter() {
  const year = new Date().getFullYear()
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      border="0"
      style={{ backgroundColor: EMAIL_BRAND.backgroundColor, borderTop: `1px solid ${EMAIL_BRAND.borderColor}` }}
    >
      <tbody>
        <tr>
          <td align="center" style={{ padding: '26px 32px 30px' }}>
            <p
              style={{
                margin: '0 0 12px',
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: '14px',
                fontWeight: 700,
                color: EMAIL_BRAND.headerColor,
              }}
            >
              {EMAIL_BRAND.name}
            </p>
            <p style={{ margin: '0 0 6px', fontSize: '12px', lineHeight: '1.7', color: EMAIL_BRAND.mutedColor }}>
              <a
                href={`mailto:${EMAIL_BRAND.supportEmail}`}
                style={{ color: EMAIL_BRAND.headerColor, textDecoration: 'underline' }}
              >
                {EMAIL_BRAND.supportEmail}
              </a>
              {' · '}
              <a href={EMAIL_BRAND.websiteUrl} style={{ color: EMAIL_BRAND.headerColor, textDecoration: 'underline' }}>
                {EMAIL_BRAND.websiteUrl.replace(/^https?:\/\//, '')}
              </a>
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: EMAIL_BRAND.mutedColor }}>
              © {year} {EMAIL_BRAND.name}. All rights reserved.
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
