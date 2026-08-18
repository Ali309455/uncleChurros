'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import RevealBlock from '@/components/RevealBlock'
import { useStore } from '@/components/StoreProvider'
import { ArrowIcon, SparkleIcon, Stars, SectionHeader, FAQAccordion } from '@/components/ui'
import { BUNDLES } from '@/data/products'

const faqs = [
  {
    q: 'How do I prepare them?',
    a: 'Straight from the freezer — no thawing needed. Deep-fry at 350°F for 3\u20134 minutes, air-fry at 380°F for 4\u20135 minutes, or bake at 400°F for 6\u20138 minutes. Full instructions are in the Cooking Guide for every product.',
  },
  {
    q: 'How many churros come in an order?',
    a: 'Every dozen is 12 pieces. Most orders start with one dozen, and you can pick two or three dozen at checkout — 24 or 36 pieces — with the per-dozen price staying the same. Cases of 100 pieces get special pricing on request.',
  },
  {
    q: 'How do my churros arrive?',
    a: 'Every order ships free in an insulated box, frozen at peak freshness. Keep them frozen until you\u2019re ready, then follow the Cooking Instructions — 3\u20134 minutes in the deep fryer and they taste like they just left the park cart.',
  },
  {
    q: 'How should I store them?',
    a: 'Frozen, your churros stay fresh for up to 12 months. Take out only what you plan to prepare and put the rest right back in the freezer.',
  },
  {
    q: 'How does shipping work?',
    a: 'Free shipping across the continental US — included on every order, no minimums. Hawaii and Alaska are coming soon, and international shipping is not yet available.',
  },
  {
    q: 'Can I pay cash on delivery?',
    a: 'Yes — COD is available on all standard orders. You pay the driver when your box arrives. No card needed.',
  },
]

const trustPoints = [
  {
    icon: 'sparkle',
    label: 'Park-inspired flavor',
    note: 'The exact 15-inch style served at the parks',
  },
  {
    icon: 'pan',
    label: 'Easy to prepare',
    note: 'Ready from frozen in 3\u20134 minutes',
  },
  {
    icon: 'heart',
    label: 'Perfect for sharing',
    note: 'Dozen, two-dozen & case options',
  },
  {
    icon: 'truck',
    label: 'Delivered to your door',
    note: 'Free shipping across the continental US',
  },
]

function TrustIcon({ icon, className = '' }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  }
  switch (icon) {
    case 'sparkle':
      return (
        <svg {...common}>
          <path d="M12 2c.7 4.9 3.5 7.8 8.5 8.8-5 1-7.8 3.9-8.5 8.8-.7-4.9-3.5-7.8-8.5-8.8 5-1 7.8-3.9 8.5-8.8z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'pan':
      return (
        <svg {...common}>
          <circle cx="9" cy="14" r="6" />
          <path d="M3 3h4M3 6h2M17 14h4" />
          <path d="M15 5c.5 1.5 1.5 1.5 1.5 0S15 3.5 15 5z" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...common}>
          <path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6z" />
        </svg>
      )
    case 'truck':
      return (
        <svg {...common}>
          <path d="M1 7h13v10H1z" />
          <path d="M14 10h4l4 4v3h-8" />
          <circle cx="6" cy="18.5" r="1.8" />
          <circle cx="17" cy="18.5" r="1.8" />
        </svg>
      )
    default:
      return null
  }
}

function BundleCard({ bundle, price, parkPrice, featured, onAdd }) {
  const total = price * bundle.dozens
  const parkTotal = parkPrice * bundle.dozens
  const save = parkTotal - total
  return (
    <RevealBlock delay={bundle.dozens * 0.08} className="h-full">
      <div
        className={`relative h-full flex flex-col rounded-3xl p-7 sm:p-8 transition-all duration-300 ${
          featured
            ? 'bg-white border-2 border-navy-600 shadow-[0_20px_50px_-20px_rgba(31,58,95,0.35)] -translate-y-1 sm:-translate-y-3'
            : 'bg-white border border-navy-600/12 shadow-sm hover:shadow-lg hover:-translate-y-1'
        }`}
      >
        {featured && (
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-navy-950 text-[10px] font-bold uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full shadow-sm whitespace-nowrap">
            ✦ Most Popular
          </span>
        )}
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-navy-600">
          {bundle.dozens === 1 ? 'One' : bundle.dozens === 2 ? 'Two' : 'Three'} Dozen
        </p>
        <p
          className="text-navy-950 text-4xl font-semibold mt-3 leading-none"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ${bundle.dozens * 12}
        </p>
        <p className="text-[12px] text-charcoal-700/50 mt-2">
          {bundle.pieces} pieces · ${price.toFixed(2)}/dozen
        </p>
        <div className="mt-4 rounded-xl bg-green-50 border border-green-600/20 px-3.5 py-2.5 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-green-700/90">Save ${save.toFixed(2)}</span>
          <span className="text-[12px] text-charcoal-700/40 line-through">${parkTotal.toFixed(2)}</span>
        </div>
        <button
          onClick={onAdd}
          className={`mt-6 w-full h-12 rounded-xl text-[15px] font-semibold transition-all duration-150 ${
            featured
              ? 'bg-navy-600 hover:bg-gold-500 hover:text-navy-950 text-white'
              : 'bg-white border-2 border-navy-600/20 text-navy-600 hover:border-navy-600 hover:bg-navy-600 hover:text-white'
          }`}
        >
          Add {bundle.dozens} Dozen — ${total.toFixed(0)}
        </button>
        <p className="mt-3 text-center text-[11px] text-charcoal-700/45">
          Free shipping included
        </p>
      </div>
    </RevealBlock>
  )
}

const birthImages = {
  churros: '/churros.png',
  park: 'https://images.unsplash.com/photo-1609597254239-d9ace3c0b39c?w=500&h=375&fit=crop&auto=format',
}

const testimonials = [
  {
    quote: "I've been to Disneyland twelve times. These taste better. I'm not sure how to feel about that.",
    author: 'Priya D., Austin TX',
  },
  {
    quote: "Showed up for my daughter's birthday with a box. I am now her favourite parent. Worth every cent.",
    author: 'Marcus T., Portland OR',
  },
  {
    quote: "My husband cried. He said they tasted like 1994. I ordered two more boxes that same evening.",
    author: 'Denise W., San Diego CA',
  },
]

const steps = [
  {
    n: '01',
    title: 'Choose your treats',
    text: 'Pick your favorites — classic cinnamon churros, beignets, or chimichangas — in any quantity that suits your crew.',
    icon: 'bag',
  },
  {
    n: '02',
    title: 'Prepare them at home',
    text: 'Ready straight from the freezer. Deep fry, air fry, or bake — golden and crisp in minutes, no skill required.',
    icon: 'pan',
  },
  {
    n: '03',
    title: 'Enjoy the magic',
    text: 'Serve warm with cinnamon sugar, chocolate, or dulce de leche — and relive that first park bite with every batch.',
    icon: 'heart',
  },
]

function StepIcon({ icon, className = '' }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  }
  if (icon === 'bag') {
    return (
      <svg {...common}>
        <path d="M6 7h12l1.5 13a1.5 1.5 0 0 1-1.5 1.6H6A1.5 1.5 0 0 1 4.5 20z" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </svg>
    )
  }
  if (icon === 'pan') {
    return (
      <svg {...common}>
        <circle cx="9" cy="14" r="6" />
        <path d="M3 3h4M3 6h2M17 14h4" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M19.5 12.6 12 20l-7.5-7.4a5 5 0 1 1 7.5-6.6 5 5 0 1 1 7.5 6.6z" />
    </svg>
  )
}

export default function Home() {
  const router = useRouter()
  const { products, addToCart } = useStore()
  const featuredProducts = products.filter((p) => p.featured).slice(0, 3)
  const churros = products.find((p) => p.category === 'churros' && p.available !== false)

  const go = (path) => router.push(path)
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      {/* ══ HERO ══ */}
      <section className="relative bg-white overflow-hidden">
        {/* Castle backdrop */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <Image
            src="/castle.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="w-full  h-full object-cover sm:object-contain object-bottom  max-sm:h-[52vh] max-sm:translate-y-6 opacity-60"
          />
        </div>
        {/* Readability overlay — keeps copy crisp over the castle */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(250,247,240,0.6) 0%, rgba(250,247,240,0.38) 50%, rgba(250,247,240,0.28) 100%)' }}
          aria-hidden="true"
        />
        {/* Soft cream wash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 75% 35%, #faf7f0 0%, rgba(250,247,240,0) 60%), radial-gradient(ellipse 60% 50% at 8% 90%, rgba(201,150,44,0.08) 0%, rgba(201,150,44,0) 60%)' }}
          aria-hidden="true"
        />
        {/* Blue curve decoration */}
        <svg
          className="hero-curve absolute bottom-0 left-0 w-full h-24 sm:h-32 text-navy-600/10 pointer-events-none"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path d="M0,60 C240,110 480,10 720,50 C960,90 1200,20 1440,65" stroke="currentColor" strokeWidth="2" />
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-6 items-center">
          {/* Copy */}
          <div className="flex flex-col items-start text-left">
            <p className="hero-eyebrow text-gold-700 text-[11px] font-semibold uppercase tracking-[0.26em] mb-4">
              ✦ The magic is back
            </p>
            <h1
              className="hero-headline text-navy-950 leading-[1.06] text-balance"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 4.1rem)', letterSpacing: '-0.02em' }}
            >
              Bring the magic{' '}
              <em className="not-italic text-navy-600" style={{ fontStyle: 'italic' }}>home.</em>
            </h1>
            <p
              className="hero-description text-gold-600 text-lg sm:text-xl italic mt-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              One churro at a time.
            </p>
            <p className="hero-description text-charcoal-700/60 text-[15px] sm:text-base leading-relaxed mt-4 max-w-lg text-pretty">
              Authentic 15-inch churros — the same style served at the theme parks —
              flash-frozen at peak freshness and shipped free to your door, for just $65 a dozen.
            </p>

            <div className="hero-cta-row flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-8">
              <button
                onClick={() => go('/shop')}
                className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full bg-navy-600 hover:bg-gold-500 text-white hover:text-navy-950 font-semibold text-[15px] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(201,150,44,0.7)]"
              >
                Shop Churros <ArrowIcon size={15} />
              </button>
              <button
                onClick={() => scrollTo('story')}
                className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full border-2 border-navy-600/20 text-navy-600 font-semibold text-[15px] hover:border-gold-500 hover:text-gold-700 transition-all duration-150"
              >
                Explore the Magic
              </button>
            </div>

            <div className="hero-cta-row mt-8 flex items-center gap-3">
              <Stars rating={5} size={14} />
              <p className="text-[13px] text-charcoal-700/50 font-medium">
                Loved by churro fans across the country
              </p>
            </div>
          </div>

          {/* Product */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Warm glow */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 48%, rgba(201,150,44,0.18) 0%, rgba(201,150,44,0.05) 45%, transparent 70%)' }}
              aria-hidden="true"
            />

            {/* Churro */}
            <div className="hero-float relative">
              <Image
                src="/churro2.png"
                alt="Classic cinnamon churro, golden and dusted in cinnamon sugar"
                width={1024}
                height={1536}
                priority
                draggable={false}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="block h-[clamp(240px,42vh,460px)] w-auto select-none drop-shadow-[0_30px_40px_rgba(11,18,38,0.18)]"
              />
            </div>

            {/* Floating sparkles */}
            <SparkleIcon className="hero-sparkle absolute top-[14%] right-[10%] sm:right-[16%] w-5 h-5 text-gold-500" />
            <SparkleIcon className="hero-sparkle absolute top-[46%] left-[4%] w-3.5 h-3.5 text-gold-400" />
            <SparkleIcon className="hero-sparkle absolute bottom-[16%] right-[2%] sm:right-[6%] w-4 h-4 text-gold-500" />

            {/* Floating free-shipping pill */}
            <div className="hero-float-slow absolute top-[18%] left-[6%] sm:left-[10%] bg-white border border-navy-600/10 rounded-full px-4 py-2 shadow-[0_10px_30px_-10px_rgba(11,18,38,0.25)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold-500" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy-600">Free Shipping</span>
            </div>

            {/* Floating rating pill */}
            <div className="hero-float-slow absolute bottom-[10%] left-[2%] sm:left-[8%] bg-white border border-navy-600/10 rounded-full px-4 py-2 shadow-[0_10px_30px_-10px_rgba(11,18,38,0.25)] flex items-center gap-1.5">
              <Stars rating={5} size={11} />
              <span className="text-[11px] font-semibold text-charcoal-700/60">The real deal</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SOCIAL PROOF STRIP ══ */}
      <section className="bg-cream-200 border-y border-navy-600/8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            <div className="flex items-center gap-3 flex-shrink-0">
              <Stars rating={5} size={16} />
              <p className="text-navy-950 font-semibold text-[15px]">
                Loved by churro fans
              </p>
            </div>
            <div className="hidden lg:block h-8 w-px bg-navy-600/15" aria-hidden="true" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-8 w-full">
              {trustPoints.map((t) => (
                <div key={t.label} className="flex items-start gap-2.5">
                  <span className="text-navy-600 mt-0.5 flex-shrink-0">
                    <TrustIcon icon={t.icon} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-charcoal-700 leading-tight">{t.label}</p>
                    <p className="text-[11.5px] text-charcoal-700/50 leading-snug mt-0.5 hidden sm:block">{t.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      <section className="bg-cream-100 py-20 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <RevealBlock>
            <div className="flex items-end justify-between gap-6 mb-10 sm:mb-12">
              <SectionHeader
                eyebrow="Bring the Magic Home™"
                title="The magic starts here."
                sub="Choose your favorite park-inspired treats — crisp on the outside, impossibly soft within."
              />
              <button
                onClick={() => go('/shop')}
                className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-gold-700 transition-colors flex-shrink-0"
              >
                View all
                <ArrowIcon size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {featuredProducts.map((product, i) => (
              <RevealBlock key={product.id} delay={i * 0.1} className="h-full">
                <ProductCard product={product} onAdd={addToCart} />
              </RevealBlock>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <button
              onClick={() => go('/shop')}
              className="group w-full py-3.5 text-sm font-semibold text-navy-600 border-2 border-navy-600/15 rounded-xl hover:border-navy-600 transition-colors"
            >
              View full catalogue
              <ArrowIcon size={14} className="inline-block ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* ══ BUNDLES / AOV ══ */}
      <section className="bg-white py-20 sm:py-24 px-5 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <RevealBlock>
            <div className="flex flex-col items-center text-center mb-12 sm:mb-14">
              <SectionHeader
                align="center"
                eyebrow="Party-size savings"
                title="Bring enough magic to share."
                sub="One dozen is never quite enough — every bundle ships free, and the more you bring, the more you save vs. park pricing."
              />
            </div>
          </RevealBlock>

          {churros && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5 lg:gap-7 max-w-4xl mx-auto">
              {BUNDLES.map((b) => (
                <BundleCard
                  key={b.dozens}
                  bundle={b}
                  price={churros.price}
                  parkPrice={churros.parkPrice}
                  featured={b.dozens === 2}
                  onAdd={() =>
                    addToCart(
                      { id: churros.id, name: churros.name, price: churros.price, image: churros.image },
                      b.dozens
                    )
                  }
                />
              ))}
            </div>
          )}

          <p className="text-center text-[13px] text-charcoal-700/45 mt-8">
            Bigger event? Cases of 100 pieces get special pricing —{' '}
            <button onClick={() => go('/contact')} className="font-semibold text-navy-600 hover:text-gold-700 transition-colors underline underline-offset-2">
              call for a quote
            </button>
            .
          </p>
        </div>
      </section>

      {/* ══ STORY ══ */}
      <section id="story" className="bg-cream-100 py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Imagery */}
            <RevealBlock>
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-cream-200 shadow-[0_24px_60px_-24px_rgba(11,18,38,0.3)]">
                  <Image
                    src={birthImages.churros}
                    alt="Fresh long churros rolled in cinnamon sugar, glowing in warm light"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Theme-park night overlay shot */}
                <div className="absolute -bottom-8 left-6 w-44 sm:w-56 rounded-2xl overflow-hidden border-4 border-cream-100 shadow-2xl">
                  <div className="relative aspect-[4/3] bg-cream-200">
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
                <div className="absolute -top-4 right-6 bg-gold-500 text-navy-950 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] shadow-lg">
                  Since the mid-&apos;80s
                </div>
              </div>
            </RevealBlock>

            {/* Copy */}
            <div>
              <RevealBlock>
                <SectionHeader
                  eyebrow="The snack that stole the park"
                  title="That first bite should feel familiar."
                />
              </RevealBlock>

              <RevealBlock delay={0.08}>
                <p className="text-charcoal-700/60 leading-relaxed text-[15px] mt-6 max-w-lg">
                  In the mid-1980s, a simple golden pastry rolled in warm cinnamon sugar quietly
                  became one of the most beloved snacks in the world. Long, crisp on the outside,
                  impossibly soft within — the churro wasn&apos;t just food. It became part of the
                  experience itself. The crackle of that first bite, the sugar dust on your
                  fingers, the line that felt worth every minute.
                </p>
                <p className="text-charcoal-700/60 leading-relaxed text-[15px] mt-4 mb-8 max-w-lg">
                  Millions of guests have enjoyed that same iconic churro over the years. Uncle
                  Walt&apos;s lets you bring that exact theme-park moment home — flash-frozen at
                  peak freshness, delivered straight to your door.
                </p>
              </RevealBlock>

              <RevealBlock delay={0.12}>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 mb-9">
                  {[
                    'Inspired by the iconic Disneyland-style churro',
                    'Approximately 15-inch premium churros',
                    'Flash frozen at peak freshness',
                    'Free shipping to your door',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[13.5px] text-charcoal-700/70 leading-snug"
                    >
                      <span className="text-gold-600 text-sm leading-snug mt-px" aria-hidden="true">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </RevealBlock>

              <RevealBlock delay={0.16}>
                <p className="text-charcoal-700/40 text-[13px] mt-4">
                  Skip the park lines. Park-quality churros, delivered to your door.
                </p>
              </RevealBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BRING THE MAGIC HOME (blue band) ══ */}
      <section className="relative bg-navy-600 overflow-hidden">
        {/* Decorative sparkles */}
        <SparkleIcon className="absolute top-8 left-[8%] w-6 h-6 text-gold-400/40" />
        <SparkleIcon className="absolute bottom-10 left-[24%] w-3.5 h-3.5 text-gold-400/50" />
        <SparkleIcon className="absolute top-12 right-[14%] w-5 h-5 text-gold-400/40" />
        <SparkleIcon className="absolute bottom-8 right-[30%] w-4 h-4 text-gold-400/45" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 90% at 85% 50%, rgba(201,150,44,0.12) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-20 sm:py-24 text-center">
          <p className="text-gold-400 text-[11px] font-semibold uppercase tracking-[0.26em] mb-4">
            Your kitchen. Your park.
          </p>
          <h2
            className="text-white text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.1] tracking-tight text-balance"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.015em' }}
          >
            Bring the magic home.
          </h2>
          <p className="text-white/70 text-[15px] sm:text-base leading-relaxed mt-5 max-w-xl mx-auto text-pretty">
            No park ticket. No line. Just the same golden, cinnamon-sugar moment —
            flash-frozen and waiting in your freezer for whenever you&apos;re ready.
          </p>
          <button
            onClick={() => go('/shop')}
            className="mt-9 inline-flex items-center gap-2 h-13 px-9 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-[15px] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-12px_rgba(212,168,67,0.6)]"
          >
            Shop the Magic <ArrowIcon size={15} />
          </button>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="bg-white py-20 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <RevealBlock>
            <div className="flex flex-col items-center text-center mb-12 sm:mb-14">
              <SectionHeader
                align="center"
                eyebrow="Effortlessly simple"
                title="Three steps to the good stuff."
                sub="From frozen to first bite in minutes — no special skills, no complicated equipment."
              />
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {steps.map((step, i) => (
              <RevealBlock key={step.n} delay={i * 0.1} className="h-full">
                <div className="relative h-full flex flex-col items-center text-center rounded-3xl border border-navy-600/10 bg-cream-100 px-6 py-10">
                  <span className="absolute top-5 right-6 text-[44px] font-semibold text-navy-600/8 leading-none" style={{ fontFamily: 'var(--font-display)' }} aria-hidden="true">
                    {step.n}
                  </span>
                  <span className="w-14 h-14 rounded-2xl bg-navy-600 text-white flex items-center justify-center shadow-[0_10px_24px_-10px_rgba(31,58,95,0.5)]">
                    <StepIcon icon={step.icon} />
                  </span>
                  <h3
                    className="text-xl mt-6 text-navy-950"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-charcoal-700/60 mt-3">
                    {step.text}
                  </p>
                  {i < 2 && (
                    <span className="hidden md:flex absolute top-1/2 -right-5 -translate-y-1/2 text-gold-500" aria-hidden="true">
                      <ArrowIcon size={18} />
                    </span>
                  )}
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COOKING PREVIEW ══ */}
      <section className="bg-cream-100 py-20 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
            <RevealBlock>
              <SectionHeader
                eyebrow="In your kitchen"
                title="Your kitchen. Your park."
                sub="Deep fry, air fry, or oven-bake straight from the freezer. 3\u20134 minutes to golden, crispy, park-ready churros — full instructions included with every guide."
              />
              <button
                onClick={() => go('/cooking')}
                className="mt-8 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-navy-600 hover:bg-gold-500 text-white hover:text-navy-950 font-semibold text-[14.5px] transition-all duration-150 hover:-translate-y-0.5"
              >
                See How to Prepare <ArrowIcon size={15} />
              </button>
            </RevealBlock>

            <RevealBlock delay={0.1}>
              <div className="relative rounded-3xl overflow-hidden shadow-[0_28px_60px_-28px_rgba(11,18,38,0.35)]">
                <div className="relative aspect-[16/10]">
                  <Image
                    src="/kitchenimage.jpg"
                    alt="Churros being prepared at home in a warm kitchen"
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                  <span className="bg-white/92 backdrop-blur-sm text-navy-950 text-[12px] font-bold uppercase tracking-[0.12em] px-3.5 py-2 rounded-full border border-white/50">
                    Frozen → golden in minutes
                  </span>
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="bg-white py-20 sm:py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <RevealBlock>
            <div className="flex flex-col items-center text-center mb-12 sm:mb-14">
              <SectionHeader
                align="center"
                eyebrow="From the fan mail"
                title="Real boxes. Real reactions."
                sub="A few of the many notes from churro fans across the country."
              />
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {testimonials.map((t, i) => (
              <RevealBlock key={i} delay={i * 0.1} className="h-full">
                <figure className="h-full flex flex-col rounded-3xl bg-cream-100 border border-navy-600/10 p-7">
                  <Stars rating={5} size={14} />
                  <blockquote
                    className="text-charcoal-700/80 leading-relaxed text-[15px] italic mt-4 flex-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-navy-600/8 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-navy-600/10 text-navy-600 flex items-center justify-center text-[12px] font-bold">
                      {t.author.charAt(0)}
                    </span>
                    <span className="text-[13px] font-semibold text-charcoal-700/70">{t.author}</span>
                  </figcaption>
                </figure>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section id="faq" className="bg-cream-100 py-20 sm:py-24 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <RevealBlock>
            <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
              <SectionHeader
                align="center"
                eyebrow="Good questions"
                title="Answered before you ask."
                sub="Everything you need to know before your box of magic arrives."
              />
            </div>
          </RevealBlock>

          <RevealBlock delay={0.08}>
            <FAQAccordion items={faqs} />
          </RevealBlock>

          <p className="text-center text-[13px] text-charcoal-700/45 mt-8">
            Still curious?{' '}
            <button onClick={() => go('/contact')} className="font-semibold text-navy-600 hover:text-gold-700 transition-colors underline underline-offset-2">
              We&apos;re here to help
            </button>
            .
          </p>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="bg-cream-200 py-20 sm:py-24 px-5 sm:px-8 overflow-hidden relative">
        <SparkleIcon className="absolute top-10 left-[10%] w-4 h-4 text-gold-500/50" />
        <SparkleIcon className="absolute bottom-12 right-[12%] w-5 h-5 text-gold-500/40" />

        <div className="relative max-w-3xl mx-auto text-center">
          <RevealBlock>
            <h2
              className="text-navy-950 text-4xl sm:text-5xl leading-[1.1] tracking-tight text-balance"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
            >
              Ready to bring the magic home?
            </h2>
            <p className="text-charcoal-700/60 text-[15px] sm:text-base leading-relaxed mt-5 max-w-lg mx-auto text-pretty">
              Free shipping. Cash on delivery available. Frozen at peak freshness,
              ready whenever you are — just $65 a dozen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-9">
              <button
                onClick={() => go('/shop')}
                className="inline-flex items-center justify-center gap-2 h-13 px-9 rounded-full bg-navy-600 hover:bg-gold-500 text-white hover:text-navy-950 font-semibold text-[15px] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(201,150,44,0.7)]"
              >
                Shop Churros <ArrowIcon size={15} />
              </button>
              <button
                onClick={() => go('/cooking')}
                className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full border-2 border-navy-600/20 text-navy-600 font-semibold text-[15px] hover:border-gold-500 hover:text-gold-700 transition-all duration-150"
              >
                How to Prepare
              </button>
            </div>
          </RevealBlock>
        </div>
      </section>
    </div>
  )
}
