'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import HeroBackground from '@/components/HeroBackground'
import ProductCard from '@/components/ProductCard'
import RevealBlock from '@/components/RevealBlock'
import { useStore } from '@/components/StoreProvider'
import { ArrowIcon } from '@/components/ui'

const faqs = [
  {
    q: 'How do my churros arrive?',
    a: 'Every order ships free in an insulated box, frozen at peak freshness. Keep them frozen until you\u2019re ready, then follow the Cooking Instructions — 3\u20134 minutes in the deep fryer and they taste like they just left the park cart.',
  },
  {
    q: 'How long do they stay good?',
    a: 'Frozen, your churros stay fresh for up to 12 months. Take out only what you plan to prepare and put the rest right back in the freezer.',
  },
  {
    q: 'What about cases and party orders?',
    a: 'Cases (100 pieces) and large event orders get special pricing — just call or message us on the Contact page and we\u2019ll respond within one business day.',
  },
  {
    q: 'Where do you ship?',
    a: 'Free shipping across the continental US. Hawaii and Alaska coming soon. International shipping is not yet available.',
  },
  {
    q: 'Can I pay cash on delivery?',
    a: 'Yes — COD is available on all standard orders. You pay the driver when your box arrives. No card needed.',
  },
]

const birthImages = {
  churros: '/churros.png',
  park: 'https://images.unsplash.com/photo-1609597254239-d9ace3c0b39c?w=500&h=375&fit=crop&auto=format',
}

export default function Home() {
  const router = useRouter()
  const { products, addToCart } = useStore()
  const featuredProducts = products.filter((p) => p.featured).slice(0, 3)
  const [openFaq, setOpenFaq] = useState(null)

  const go = (path) => router.push(path)

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <HeroBackground />
        <div
          className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-32 sm:pb-40 max-w-sm sm:max-w-3xl mx-auto"
          style={{ animation: 'hero-copy-up 1.1s 0.5s ease both' }}
        >
          <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.24em] mb-5 sm:mb-6">
            Authentic · Frozen Fresh · Free Shipping
          </p>
          <h1
            className="text-star-white leading-[1.08] sm:leading-[1.06] mb-5 sm:mb-6"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 8vw, 36px)', letterSpacing: '-0.01em' }}
          >
            Bring the Magic Home<sup className="text-[0.4em] align-super">™</sup>
            <br />
            <em className="not-italic" style={{ color: '#D4A843' }}>the exact Disneyland churro.</em>
          </h1>
          <p className="text-star-white/55 text-base sm:text-lg leading-[1.7] sm:leading-relaxed mb-7 sm:mb-8 max-w-[32ch] sm:max-w-xl">
            Authentic 15-inch churros — the same ones served at Disneyland theme parks —
            flash-frozen and shipped free, at just $65 a dozen.
          </p>

          {/* Pricing — immediately visible */}
          <div className="w-full max-w-[340px] sm:max-w-none flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-center gap-y-5 sm:gap-y-4 sm:gap-x-6 rounded-[22px] sm:rounded-2xl border border-gold-500/20 sm:border-gold-500/25 bg-navy-800/40 sm:bg-navy-800/50 backdrop-blur-md px-7 py-7 sm:px-6 sm:py-4">
            <div className="order-1 flex items-baseline justify-center gap-1">
              <span
                className="text-gold-400 font-bold leading-none"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 10vw, 40px)' }}
              >
                $65
              </span>
              <span className="text-star-white/60 text-sm">/ dozen</span>
            </div>
            <div className="hidden sm:block h-9 w-px bg-star-white/10 sm:order-2" />
            <div className="order-4 sm:order-3 text-center sm:text-left">
              <p className="text-gold-400 text-[15px] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                Save $19.95
              </p>
              <p className="text-star-white/50 text-[12px]">vs. buying inside the park</p>
            </div>
            <div className="hidden sm:block h-9 w-px bg-star-white/10 sm:order-4" />
            <div className="order-2 sm:order-5 text-center sm:text-left">
              <p className="text-star-white text-[15px] font-semibold tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                FREE SHIPPING
              </p>
              <p className="text-star-white/50 text-[12px]">on every order</p>
            </div>
            <div className="order-3 sm:hidden h-px w-16 bg-star-white/15 mx-auto" />
          </div>

          {/* Benefit checklist */}
          <p className="mt-6 sm:mt-4 grid grid-cols-1 min-[400px]:grid-cols-2 gap-x-5 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:gap-y-1.5 text-[13px] text-star-white/60">
            <span className="inline-flex items-center justify-center gap-1.5">
              <span className="text-gold-500">✓</span> Same churros as Disneyland
            </span>
            <span className="inline-flex items-center justify-center gap-1.5">
              <span className="text-gold-500">✓</span> Approx. 15-inch churros
            </span>
            <span className="inline-flex items-center justify-center gap-1.5">
              <span className="text-gold-500">✓</span> 12 pieces per dozen
            </span>
            <span className="inline-flex items-center justify-center gap-1.5">
              <span className="text-gold-500">✓</span> Easy to prepare at home
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center mt-7 sm:mt-8 w-full sm:w-auto">
            <button
              onClick={() => go('/shop')}
              className="group w-full sm:w-auto min-h-[48px] sm:min-h-0 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-base px-8 py-4 sm:py-3.5 rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-500/25"
            >
              Shop the Churros
              <svg className="inline-block w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-0 text-star-white/50 hover:text-star-white text-sm font-medium transition-colors px-6 sm:px-4 py-4 sm:py-3"
            >
              Discover the story <ArrowIcon dir="down" size={14} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Hint: click the sky */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-star-white/20 text-[11px] tracking-widest z-10 select-none pointer-events-none">
          CLICK THE SKY · MOVE TO PUSH STARS
        </p>
      </section>

      {/* ══ PROMO STRIP ══ */}
      {/* <section className="bg-gold-500 text-navy-950">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-[13px] font-semibold tracking-wide">
          <span>✦ Bring the Magic Home™</span>
          <span>Authentic Disneyland-quality churros</span>
          <span>Save $19.95 / dozen</span>
          <span>FREE SHIPPING</span>
          <span>Approx. 15-inch churros</span>
        </div>
      </section> */}

      {/* ══ THE BIRTH OF THE DISNEYLAND CHURRO ══ */}
      <section id="story" className="bg-navy-950 py-24 sm:py-28 px-5 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Imagery */}
            <RevealBlock>
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-navy-800">
                  <Image
                    src={birthImages.churros}
                    alt="Fresh long churros rolled in cinnamon sugar, glowing in warm light"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
                </div>

                {/* Theme-park night overlay shot */}
                <div className="absolute -bottom-8 left-6 w-44 sm:w-56 rounded-xl overflow-hidden border-4 border-navy-950 shadow-2xl">
                  <div className="relative aspect-[4/3] bg-navy-800">
                    <Image
                      src={birthImages.park}
                      alt="Theme park walkway glowing with warm evening lights"
                      fill
                      sizes="(min-width: 640px) 224px, 176px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Era stamp */}
                <div className="absolute -top-4 right-6 bg-gold-500 text-navy-950 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] shadow-lg">
                  Since the mid-&apos;80s
                </div>
              </div>
            </RevealBlock>

            {/* Copy */}
            <div>
              <RevealBlock>
                <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.24em] mb-4">
                  The snack that stole the park
                </p>
                <h2
                  className="text-star-white text-3xl sm:text-5xl leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  The Birth of the
                  <br />
                  <em className="not-italic text-gold-400">Disneyland Churro</em>
                </h2>
              </RevealBlock>

              <RevealBlock delay={0.08}>
                <p className="text-star-white/55 leading-relaxed text-[15px] mt-6 max-w-lg">
                  In the mid-1980s, a simple golden pastry rolled in warm cinnamon sugar quietly
                  became one of the most beloved snacks in the world. Long, crisp on the outside,
                  impossibly soft within — the churro wasn&apos;t just food. It became part of the
                  experience itself. The crackle of that first bite, the sugar dust on your
                  fingers, the line that felt worth every minute.
                </p>
                <p className="text-star-white/55 leading-relaxed text-[15px] mt-4 mb-9 max-w-lg">
                  Millions of guests have enjoyed that same iconic churro over the years. Uncle
                  Walt&apos;s lets you bring that exact theme-park moment home — flash-frozen at
                  peak freshness, delivered straight to your door.
                </p>
              </RevealBlock>

              {/* Highlights */}
              <RevealBlock delay={0.12}>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 mb-10">
                  {[
                    'Inspired by the iconic Disneyland-style churro',
                    'Approximately 15-inch premium churros',
                    'Flash frozen at peak freshness',
                    'Free shipping to your door',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[13.5px] text-star-white/75 leading-snug"
                    >
                      <span className="text-gold-500 text-sm leading-snug mt-px" aria-hidden="true">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealBlock>

              {/* CTA */}
              <RevealBlock delay={0.16}>
                <button
                  onClick={() => go('/shop')}
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-base px-4 py-4 rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-500/25"
                >
                  Bring the Magic Home <ArrowIcon size={16} className="ml-1.5" />
                </button>
                <p className="text-star-white/40 text-[13px] mt-4">
                  Skip the park lines. Park-quality churros, delivered to your door.
                </p>
              </RevealBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      <section className="bg-cream-100 py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <RevealBlock>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">
                  Bring the Magic Home™
                </p>
                <h2
                  className="text-navy-950 text-3xl sm:text-4xl leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  The real deal, frozen fresh.
                </h2>
              </div>
              <button
                onClick={() => go('/shop')}
                className="group hidden sm:inline-flex items-center text-sm font-medium text-navy-600 hover:text-gold-500 transition-colors"
              >
                View all
                <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7">
            {featuredProducts.map((product, i) => (
              <RevealBlock
                key={product.id}
                delay={i * 0.1}
                className={i === 2 && featuredProducts.length === 3 ? 'lg:col-span-2' : ''}
              >
                <ProductCard product={product} onAdd={addToCart} variant="light" />
              </RevealBlock>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <button
              onClick={() => go('/shop')}
              className="group w-full py-3 text-sm font-medium text-navy-600 border border-navy-600/20 rounded-xl hover:bg-navy-600/5 transition-colors"
            >
              View full catalogue
              <svg className="inline-block w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="bg-navy-800 py-20 px-5 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <RevealBlock>
            <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.24em] mb-10 text-center">
              What people are saying
            </p>
          </RevealBlock>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                quote: "I've been to Disneyland twelve times. These taste better. I'm not sure how to feel about that.",
                author: 'Priya D., Austin TX',
                stars: 5,
              },
              {
                quote: "Showed up for my daughter's birthday with a box. I am now her favourite parent. Worth every cent.",
                author: 'Marcus T., Portland OR',
                stars: 5,
              },
              {
                quote: "My husband cried. He said they tasted like 1994. I ordered two more boxes that same evening.",
                author: 'Denise W., San Diego CA',
                stars: 5,
              },
            ].map((t, i) => (
              <RevealBlock key={i} delay={i * 0.1}>
                <div className="bg-navy-950/50 border border-star-white/5 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <span key={s} className="text-gold-500 text-sm">★</span>
                    ))}
                  </div>
                  <p
                    className="text-star-white/75 leading-relaxed text-[15px] italic flex-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-star-white/35 text-[13px] font-medium">{t.author}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="bg-cream-100 py-20 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <RevealBlock>
            <div className="text-center mb-12">
              <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.22em] mb-3">
                Good questions
              </p>
              <h2
                className="text-navy-950 text-3xl sm:text-4xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Answered before you ask.
              </h2>
            </div>
          </RevealBlock>

          <div className="flex flex-col divide-y divide-navy-600/10">
            {faqs.map((faq, i) => (
              <div key={i} className="py-5">
                <button
                  className="w-full flex items-center justify-between text-left gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="text-charcoal-700 font-medium text-base" style={{ fontFamily: 'var(--font-display)' }}>
                    {faq.q}
                  </span>
                  <span
                    className={`text-gold-500 text-xl transition-transform duration-200 flex-shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <p className="mt-3 text-charcoal-700/65 text-[15px] leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer
        className="bg-navy-950 py-12 px-5 sm:px-8"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(201,150,44,0.04) 0%, transparent 50%)' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Uncle Walt's Churros"
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-xl tracking-tight text-star-white">Uncle <span className="text-gold-400">Walt's</span></span>
          </div>
          <div className="flex gap-6 text-[13px]">
            <button onClick={() => go('/shop')} className="text-star-white/40 hover:text-star-white/70 transition-colors">Shop</button>
            <button onClick={() => go('/cart')} className="text-star-white/40 hover:text-star-white/70 transition-colors">Cart</button>
            <button onClick={() => go('/contact')} className="text-star-white/40 hover:text-star-white/70 transition-colors">Contact</button>
          </div>
          <p className="text-star-white/25 text-[12px]">© 2026 Uncle Walt&apos;s Churros. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}