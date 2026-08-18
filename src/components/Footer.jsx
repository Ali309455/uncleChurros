'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { SparkleIcon } from '@/components/ui'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All treats', path: '/shop' },
      { label: 'Churros', path: '/shop' },
      { label: 'Case pricing', path: '/contact' },
      { label: 'Cart', path: '/cart' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Our story', path: '/#story' },
      { label: 'How to prepare', path: '/cooking' },
      { label: 'Contact', path: '/contact' },
      { label: 'FAQ', path: '/#faq' },
    ],
  },
]

export default function Footer() {
  const router = useRouter()
  const go = (path) => router.push(path)

  return (
    <footer
      className="bg-navy-950 text-star-white"
      style={{ backgroundImage: 'radial-gradient(circle at 15% 100%, rgba(201,150,44,0.07) 0%, transparent 55%)' }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <button onClick={() => go('/')} className="flex items-center gap-2.5 text-left" aria-label="Uncle Walt's Churros — home">
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="font-bold text-xl tracking-tight text-star-white">
                Uncle <span className="text-gold-400">Walt&apos;s</span>
              </span>
            </button>
            <p className="text-star-white/45 text-[14px] leading-relaxed mt-4 max-w-sm">
              Authentic park-style churros, flash-frozen at peak freshness and
              delivered free to your door. Crispy outside, soft inside, pure
              nostalgia.
            </p>
            <div className="flex items-center gap-2 mt-5 text-gold-400/90 text-[13px] italic">
              <SparkleIcon size={13} />
              <span style={{ fontFamily: 'var(--font-display)' }}>Bring the Magic Home™</span>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-star-white/30 mb-4">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.path.startsWith('/#') ? (
                      <a
                        href={link.path}
                        className="text-[14px] text-star-white/55 hover:text-gold-400 transition-colors duration-150 text-left"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => go(link.path)}
                        className="text-[14px] text-star-white/55 hover:text-gold-400 transition-colors duration-150 text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-star-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-star-white/25 text-[12px]">
            © 2026 Uncle Walt&apos;s Churros. All rights reserved.
          </p>
          <p className="text-star-white/25 text-[12px] flex items-center gap-1.5">
            <SparkleIcon size={11} className="text-gold-500/60" />
            Free shipping · Cash on delivery available
          </p>
        </div>
      </div>
    </footer>
  )
}
