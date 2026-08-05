import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { StoreProvider } from '@/components/StoreProvider'
import SiteShell from '@/components/SiteShell'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: {
    default: "Uncle Walt's Churros — Bring the Magic Home™",
    template: '%s · Uncle Walt’s Churros',
  },
  description:
    'The same 15-inch churros served at Disneyland — flash-frozen, free shipping, just $65 a dozen. Bring the Magic Home™.',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <StoreProvider>
          <SiteShell>{children}</SiteShell>
        </StoreProvider>
      </body>
    </html>
  )
}
