# Uncle Walt's Churros — Frontend Design Context

Focused developer context for the **frontend design system** of the Next.js storefront:
visual identity, tokens, layout patterns, components, animation, and interaction conventions.
For app architecture, state, orders, admin, and integrations see `website-context.md`.

---

## 1. Design Identity

A "Disney magic at home" brand: **midnight navy night-sky + warm carnival gold**, cream
paper-like backgrounds, elegant serif display type (Fraunces), and playful park nostalgia
(hanging churros, starfields, sparkles, "Bring the Magic Home™").

Two persistent visual modes:

- **Dark (night sky):** hero, nav, admin dashboard, login/signup — `navy-950` bases, gold
  accents, off-white (`star-white`) text, gold-tinted glows and sparkles.
- **Light (cream paper):** content pages (shop, cart, checkout, contact, cooking) — `cream-100`
  page background, white cards with soft navy borders, `charcoal-700` body text.

---

## 2. Design Tokens

Defined once in `src/app/globals.css` via Tailwind v4 `@theme` — **no arbitrary color values
in pages** (except a couple of admin-only status colors).

| Token | Hex | Usage |
| --- | --- | --- |
| `navy-950` | `#0b1226` | Nav, hero, page headers, footer, admin shell |
| `navy-800` | `#132244` | Panels/cards on dark backgrounds |
| `navy-600` | `#1f3a5f` | Muted borders, secondary fills, pressed button state |
| `gold-500` | `#c9962c` | Primary accent — CTAs, prices, badges, active nav, eyebrows |
| `gold-400` | `#d4a843` | Lighter gold — hover, emphasis text, glows |
| `gold-100` | `#fdf3dc` | Gold-tinted backgrounds (bulk discount nudge, etc.) |
| `star-white` | `#f8f7f2` | Off-white headings/text on dark surfaces |
| `cream-100` | `#faf7f0` | Light page background |
| `cream-200` | `#f3ede1` | Image placeholders, subtle tint panels |
| `charcoal-700` | `#2b2b2b` | Body text on light backgrounds |
| `blue-accent-100…700` | `#e6f0fb…#28537f` | Cooking guide accent — beignets |
| `orange-accent-100…700` | `#fdeede…#9e4919` | Cooking guide accent — chimichangas |

Keyframes defined in the same file: `rainbow-reveal`, `hero-copy-up`, `shimmer-slide`,
`hero-churro-enter`, `hero-churro-swing` (+ mobile variant), `hero-arrow-draw-line/head`,
`hero-arrow-sway`, `hero-sparkle-twinkle`, `hero-nudge`.

---

## 3. Typography

Two Google fonts loaded with `next/font` in `src/app/layout.jsx`, exposed as CSS variables and
aliased in `@theme` (`--font-display`, `--font-sans`):

- **Fraunces** (`--font-display`) — headings only. Applied inline via
  `style={{ fontFamily: 'var(--font-display)' }}`; never as a utility class. Used for
  headlines, section titles, card titles, the hero churro caption.
- **Inter** (`--font-sans`) — everything else. Set on `html` and `body` (via
  `SiteShell`), plus the page root divs.

Conventions:

- **Eyebrows:** `text-gold-500 text-[11px] font-semibold uppercase tracking-[0.22em]` —
  category labels above headings (hero, page headers, product cards).
- **Hero headline:** Fraunces, `clamp(2.25rem, 4.5vw, 4rem)`, tight `leading-[1.05]`,
  `letter-spacing: -0.02em`, `text-balance`; second line in gold italic via `<em>`.
- **Body:** 15–16px, relaxed leading, muted `charcoal-700/50–60` on light; `star-white/55`
  on dark.
- **Micro-labels / eyebrow text:** 10–12px uppercase, letter-spaced (`tracking-[0.14em]`–
  `[0.24em]`) — badges, "per dozen", "FREE SHIPPING", section overlines.

---

## 4. Layout Patterns

- **Page shell:** `<body className="min-h-screen flex flex-col">` → `StoreProvider` →
  `SiteShell` → `Nav` + page. `SiteShell` (`src/components/SiteShell.jsx`) hides the Nav on
  `/admin`, `/login`, `/signup` (full-screen routes).
- **Nav:** sticky (`sticky top-0 z-50`), `bg-navy-950/96 backdrop-blur-md`, 64px tall,
  `max-w-6xl mx-auto px-5 sm:px-8`. Desktop links + mobile hamburger with dropdown panel.
- **Page header band:** `bg-navy-950 py-12 px-5 sm:px-8 text-center` with eyebrow + Fraunces
  heading (shop, cart, checkout, confirmation, cooking, contact).
- **Content column:** `max-w-5xl mx-auto px-4 sm:px-8` (max-w-6xl on shop/cooking pages).
- **Cards:** `bg-white rounded-2xl border border-navy-600/10`; dark variants
  `bg-navy-800 border-star-white/5` (admin, hero product).
- **Two-column checkout:** `lg:grid-cols-[1fr_360px]` with a sticky `lg:top-24 h-fit` order
  summary sidebar.
- **Buttons:** primary = `bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold`
  (`rounded-xl` for large CTAs, `rounded-full` for pills like Sign up); text links use
  `text-star-white/60 hover:text-star-white` (dark) or `text-charcoal-700/50 hover:…` (light).
  Secondary outline = `border border-gold-500/25 text-gold-500`.

---

## 5. Components & Reusable UI

| Component | File | Notes |
| --- | --- | --- |
| `Nav` | `src/components/Nav.jsx` | Sticky nav, cart badge (gold pill, `9+` cap), auth chip, mobile dropdown, inline SVG cart/hamburger icons |
| `ProductCard` | `src/components/ProductCard.jsx` | Horizontal card (image 38% on md+), hover lift (`-translate-y-1 shadow-lg`), image zoom (`group-hover:scale-103`), bundle qty selector (1/2/3 dozen), "✓ Added" flash state, dark (`variant="dark"`) & light variants, case-pricing link |
| `HeroBackground` | `src/components/HeroBackground.jsx` | Canvas starfield: ~110 twinkling stars (every 9th gold), mouse-push physics, click sparkle bursts, `prefers-reduced-motion` via `useSyncExternalStore` |
| `RevealBlock` | `src/components/RevealBlock.jsx` | Scroll-reveal (IntersectionObserver, `useScrollReveal` hook) |
| `SiteShell` | `src/components/SiteShell.jsx` | Nav gating per route |
| `ui.jsx` | `src/components/ui.jsx` | `ArrowIcon` (right/left/down/upRight inline SVG), `Spinner`, `Shimmer` skeletons (`OrderRowSkeleton`, `ProductRowSkeleton`, `PageLoadingSkeleton`, `ProductCardSkeleton`) |
| `LoginForm` | `src/components/LoginForm.jsx` | Demo auth, quick-access buttons, Google + email form |
| `StoreProvider` | `src/components/StoreProvider.jsx` | Global context: cart/orders/products/user + all actions (see website-context.md §7) |

---

## 6. Icons & Imagery

- **No icon library in production UI** — all icons are custom inline SVGs with a shared
  stroke style (`strokeWidth="1.8"`, `strokeLinecap/join="round"`): cart, hamburger, arrows,
  cooking icons (`src/components/cooking/CookingIcons.jsx`). Only the admin uses
  `lucide-react` and ad-hoc status colors.
- **Product images** live in `/public` (`churros.png`, `beignets.png`, `Chimichanga.png`),
  rendered with `next/image` (`fill` or width/height, `object-cover`, lazy except hero).
- **Unsplash** imagery is allowlisted in `next.config.mjs` for non-product photos
  (timeline, contact, cooking page).

---

## 7. Motion & Interaction

All choreography defined in `src/app/globals.css` (animation utilities + keyframes) and
honored at `prefers-reduced-motion: reduce` (hero classes disabled; canvas hero also watches
the media query at runtime).

**Hero sequence (staggered entrance):** eyebrow → headline → description (fade-up via
`hero-copy-up` at 0.25/0.45/0.7s) → hanging churro (`hero-churro-enter` rise, then infinite
`hero-churro-swing` pendulum, `transform-origin: 50% -12%`) → CTA. Animated SVG arrow
(stroke-dashoffset draw) + sparkles at ~2–3s.

**Micro-interactions:**

- Buttons: `transition-all duration-150`, gold → `hover:bg-gold-400`.
- Cards: hover lift + image zoom (300ms).
- Add-to-cart: button flips to navy "✓ Added to cart" for 1.8s.
- Nav links: `transition-colors duration-150`, active route = `text-gold-400`.
- Scroll reveals: `RevealBlock` fades/slides content in as it enters the viewport.
- Admin: shimmer skeletons while loading, toasts on actions.

---

## 8. Responsiveness

Mobile-first Tailwind breakpoints (`sm: 640` / `md: 768` / `lg: 1024`):

- Product cards: vertical on mobile (`flex-col`, `aspect-[4/3]` image) → horizontal `md:flex-row`
  with `md:w-[38%]` image.
- Shop grid: 1 → 4 columns (`sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
- Admin tables: mobile card layout → tablet → desktop grid (`lg:grid-cols-[…]`).
- Hero: `clamp()` typography + `dvh` height, mobile-only churro swing animation
  (`@media (max-width: 639px)` swaps to `hero-churro-swing-mobile`).
- Nav: links hidden below `sm`, hamburger + dropdown instead.

---

## 9. Content & Data-Driven Design

- Products seeded in `src/data/products.js` (3 live, 3 commented "coming soon"): id, name,
  category (`churros | beignets | chimichangas`), price, `price6plus`, `parkPrice`, weight,
  description, image, `featured`, `available`. Also exports `BUNDLES` (1/2/3 dozen) and
  `CASE_PACK` (100-piece case).
- Cooking guide: `src/data/cooking.js` + `src/lib/cooking.js` (category detection,
  `getAccentClasses`) + `src/components/cooking/*` (sidebar, method cards, info cards, icons).
- FAQ accordion, testimonials, and founder timeline are hard-coded on the home page;
  prices render with a `formatPrice` helper (no trailing zeros for whole dollars).

---

## 10. Design Rules of Thumb (for new UI)

1. **Never hardcode colors** — use the `@theme` tokens only.
2. **Headings always Fraunces** via `style={{ fontFamily: 'var(--font-display)' }}`.
3. **Icons are inline SVGs** with the shared stroke style (1.8, rounded) — not lucide
   (except admin).
4. **Dark surfaces** = `navy-950` + `star-white` text + `gold-400` emphasis; **light
   surfaces** = `cream-100` bg + white cards + `charcoal-700` text.
5. **Page headers** follow the navy band + gold eyebrow + display heading pattern.
6. **Motion** is 150–300ms ease transitions; hero-style choreography stays in
   `globals.css` and respects `prefers-reduced-motion`.
7. **Imagery** goes through `next/image` (Unsplash or `/public`); never bare `<img>` for
   photos.
