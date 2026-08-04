import { useState, useRef, useEffect } from 'react'
import HeroBackground from '../components/HeroBackground'
import ProductCard from '../components/ProductCard'
import type { Product } from '../data/products'
import type { Page, CartItem } from '../App'

type Props = {
  setPage: (p: Page) => void
  addToCart: (product: Omit<CartItem, 'quantity'>, qty: number) => void
  products: Product[]
}

// Scroll-reveal hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function RevealBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`,
      }}
    >
      {children}
    </div>
  )
}

const faqs = [
  {
    q: 'How do my churros arrive?',
    a: "Each order is made fresh the morning it ships. Churros arrive in an insulated box designed to keep them at optimal temperature for up to 6 hours. Heat in the oven at 180°C for 4–5 minutes and they'll taste like they came straight from the fryer.",
  },
  {
    q: 'How long do they stay good?',
    a: "Best enjoyed the day they arrive. You can refrigerate them for up to 3 days and reheat in the oven — they'll be 95% as good. We don't recommend freezing: the texture suffers.",
  },
  {
    q: 'What about bulk and party orders?',
    a: "We handle 50-piece and full-case orders for events and parties. These ship on a custom schedule and include a dedicated contact. Reach us on the Contact page and we'll respond within one business day.",
  },
  {
    q: 'Where do you ship?',
    a: "Currently shipping across the continental US. Hawaii and Alaska coming soon. International shipping is not yet available.",
  },
  {
    q: 'Can I pay cash on delivery?',
    a: 'Yes — COD is available on all standard orders. You pay the driver when your box arrives. No card needed.',
  },
]

const storyChapters = [
  {
    num: '01',
    year: '1989',
    headline: 'The 47-minute wait that started everything.',
    body: "Walter Marquez was six years old the first time his abuela Rosa took him to Disneyland. He didn't care about the rides. He cared about the churros. That first bite — the crack of the cinnamon crust, the warm doughy pull inside — was, by his own account, \"the most important thing that happened to me that decade.\" The line was 47 minutes long. He stood in it happily every single time.",
    image: 'https://images.unsplash.com/photo-1609597254239-d9ace3c0b39c?w=600&h=420&fit=crop&auto=format',
    imageAlt: 'Theme park at night, glowing lights along the main street',
    align: 'right' as const,
  },
  {
    num: '02',
    year: '2008',
    headline: 'He had the degree. He had the job. He had the wrong life.',
    body: 'Marketing degree from UCLA. Account manager at a distribution firm in Anaheim. The kind of résumé that looked good on paper and felt hollow at 11 p.m. on a Tuesday. Walt spent those nights in his apartment kitchen, not working late — experimenting. He was trying, with increasing obsession, to reverse-engineer the churro. \"I knew it wasn\'t just flour and oil,\" he says. \"There was something in the ratio nobody would tell me.\"',
    image: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=600&h=420&fit=crop&auto=format',
    imageAlt: 'Two chefs standing in front of a kitchen counter',
    align: 'left' as const,
  },
  {
    num: '03',
    year: '2019',
    headline: 'Batch 42. The breakthrough.',
    body: "Eleven years. Forty-one failed batches. The problem, Walt eventually discovered, wasn't the technique — it was the masa harina. Most commercial sources use a coarser grind. He'd been chasing a ghost. He sourced a small-batch stone-ground masa from a family mill in Oaxaca after a chance conversation at a food expo. Batch 42 was different the moment the dough hit the oil. His neighbour, who'd been politely suffering through the experiments, knocked on the door uninvited for the first time.",
    image: 'https://images.unsplash.com/photo-1767489386700-cb3dbcbab13d?w=600&h=420&fit=crop&auto=format',
    imageAlt: 'Freshly fried churros dusted in cinnamon sugar',
    align: 'right' as const,
  },
  {
    num: '04',
    year: '2019 — now',
    headline: 'He sold 12 boxes from the back of a Honda Civic. Then quit his job.',
    body: "March 14th, 2019. Walt sold his first twelve boxes from the back of his car at a farmers' market in Fullerton. He ran out in 40 minutes. Three months later, when weekly orders hit 200, he handed in his notice. His mother still refers to it as \"the phase.\" He has now shipped over 50,000 churros to 42 states. The line at his door is still zero minutes long.",
    image: 'https://images.unsplash.com/photo-1773813949612-84f8746a542b?w=600&h=420&fit=crop&auto=format',
    imageAlt: 'Man sitting at a kitchen table surrounded by food',
    align: 'left' as const,
  },
]

export default function Home({ setPage, addToCart, products }: Props) {
  const featuredProducts = products.filter(p => p.featured).slice(0, 3)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <HeroBackground />
        <div
          className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-40 max-w-3xl mx-auto"
          style={{ animation: 'hero-copy-up 1.1s 0.5s ease both' }}
        >
          <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.24em] mb-6">
            Handcrafted · Park-Inspired · Delivered Fresh
          </p>
          <h1
            className="text-star-white leading-[1.06] mb-6"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 7.5vw, 72px)', letterSpacing: '-0.01em' }}
          >
            A little Disney magic,
            <br />
            <em className="not-italic" style={{ color: '#D4A843' }}>delivered to your door.</em>
          </h1>
          <p className="text-star-white/55 text-lg leading-relaxed mb-10 max-w-xl">
            The churros you only thought you could get inside the park — made in our kitchen
            and on your doorstep in hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              onClick={() => setPage('shop')}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-base px-8 py-3.5 rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-500/25"
            >
              Shop the Churros →
            </button>
            <button
              onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-star-white/50 hover:text-star-white text-sm font-medium transition-colors px-4 py-3"
            >
              Read Walt&apos;s story ↓
            </button>
          </div>
        </div>

        {/* Hint: click the sky */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-star-white/20 text-[11px] tracking-widest z-10 select-none pointer-events-none">
          CLICK THE SKY · MOVE TO PUSH STARS
        </p>
      </section>

      {/* ══ OWNER STORY ══ */}
      <section id="story" className="bg-navy-950 py-24 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <RevealBlock>
            <div className="text-center mb-20">
              <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.24em] mb-4">
                The man behind the churro
              </p>
              <h2
                className="text-star-white text-4xl sm:text-5xl leading-tight max-w-2xl mx-auto"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Walt&apos;s story didn&apos;t start in a boardroom.
                <br />
                <em className="not-italic text-gold-400">It started in a queue.</em>
              </h2>
            </div>
          </RevealBlock>

          {/* Pull quote bar */}
          <RevealBlock delay={0.1}>
            <div className="border-l-4 border-gold-500 pl-6 mb-20 max-w-xl mx-auto lg:mx-0">
              <p
                className="text-star-white/80 text-xl sm:text-2xl leading-relaxed italic"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                &ldquo;I didn&apos;t want to open a restaurant.
                I wanted to build the ride.&rdquo;
              </p>
              <p className="text-gold-500/70 text-sm mt-3 font-medium not-italic">
                — Walter Marquez, founder
              </p>
            </div>
          </RevealBlock>

          {/* Chapter timeline */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div
              className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-px"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,150,44,0.3) 10%, rgba(201,150,44,0.3) 90%, transparent)' }}
            />

            <div className="flex flex-col gap-24">
              {storyChapters.map((ch, i) => (
                <RevealBlock key={i} delay={0.08}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${ch.align === 'left' ? '' : 'lg:direction-rtl'}`}>
                    {/* Text side */}
                    <div className={ch.align === 'right' ? 'lg:order-2' : 'lg:order-1'}>
                      <div className="flex items-start gap-4 mb-4">
                        {/* Chapter number */}
                        <span
                          className="text-gold-500/25 font-bold flex-shrink-0 leading-none select-none"
                          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 7vw, 80px)' }}
                        >
                          {ch.num}
                        </span>
                        <div className="pt-2">
                          <p className="text-gold-500/70 text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">
                            {ch.year}
                          </p>
                          <h3
                            className="text-star-white text-xl sm:text-2xl leading-snug"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {ch.headline}
                          </h3>
                        </div>
                      </div>
                      <p className="text-star-white/50 leading-relaxed text-[15px] ml-0 lg:ml-[calc(clamp(48px,7vw,80px)+16px)]">
                        {ch.body}
                      </p>
                    </div>

                    {/* Image side */}
                    <div className={`${ch.align === 'right' ? 'lg:order-1' : 'lg:order-2'} relative`}>
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-navy-600 group">
                        <img
                          src={ch.image}
                          alt={ch.imageAlt}
                          className="w-full h-full object-cover opacity-75 transition-all duration-500 group-hover:opacity-90 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Subtle gold overlay on hover */}
                        <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/5 transition-colors duration-500" />
                      </div>
                      {/* Year stamp */}
                      <div
                        className="absolute -bottom-3 right-4 bg-navy-800 border border-gold-500/20 px-3 py-1.5 rounded-lg"
                      >
                        <span className="text-gold-500 font-bold text-sm tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                          {ch.year.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <RevealBlock delay={0.1}>
            <div className="mt-24 grid grid-cols-2 sm:grid-cols-4 gap-px bg-star-white/5 rounded-2xl overflow-hidden border border-star-white/5">
              {[
                { n: '50,000+', label: 'Churros shipped' },
                { n: '42', label: 'States reached' },
                { n: '11 years', label: 'To perfect the recipe' },
                { n: '0 mins', label: 'Wait time at your door' },
              ].map((stat) => (
                <div key={stat.n} className="flex flex-col items-center justify-center py-8 px-4 bg-navy-800 text-center">
                  <p
                    className="text-gold-500 font-bold mb-1"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)' }}
                  >
                    {stat.n}
                  </p>
                  <p className="text-star-white/40 text-[13px] uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ══ */}
      <section className="bg-cream-100 py-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <RevealBlock>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-gold-500 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">
                  Fan favourites
                </p>
                <h2
                  className="text-navy-950 text-3xl sm:text-4xl leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  The classics, done right.
                </h2>
              </div>
              <button
                onClick={() => setPage('shop')}
                className="hidden sm:block text-sm font-medium text-navy-600 hover:text-gold-500 transition-colors"
              >
                View all →
              </button>
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <RevealBlock key={product.id} delay={i * 0.1}>
                <ProductCard product={product} onAdd={addToCart} variant="light" />
              </RevealBlock>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <button
              onClick={() => setPage('shop')}
              className="w-full py-3 text-sm font-medium text-navy-600 border border-navy-600/20 rounded-xl hover:bg-navy-600/5 transition-colors"
            >
              View full catalogue →
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
            <span className="text-gold-500 text-lg" aria-hidden="true" style={{ fontFamily: 'var(--font-display)' }}>✦</span>
            <span className="text-star-white/70 text-base" style={{ fontFamily: 'var(--font-display)' }}>
              Uncle Walt&apos;s Churros
            </span>
          </div>
          <div className="flex gap-6 text-[13px]">
            <button onClick={() => setPage('shop')} className="text-star-white/40 hover:text-star-white/70 transition-colors">Shop</button>
            <button onClick={() => setPage('cart')} className="text-star-white/40 hover:text-star-white/70 transition-colors">Cart</button>
            <button onClick={() => setPage('contact')} className="text-star-white/40 hover:text-star-white/70 transition-colors">Contact</button>
          </div>
          <p className="text-star-white/25 text-[12px]">© 2026 Uncle Walt&apos;s Churros. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
