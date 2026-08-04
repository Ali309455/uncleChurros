# Uncle Walt's Churros — Design Guidelines for Figma Make

A reference brief you can paste into Figma Make (in full or section by section) to get a premium, story-driven design that matches the sales funnel already planned for the site.

---

## 1. Design Thesis

The site should feel like the moment right before a Disney film starts: dark navy sky, a distant castle silhouette, a rainbow arcing up out of it, stars scattered across the background — quiet and cinematic, not a cartoon. That scene lives **behind** the content as an ambient, cursor-reactive layer. Everything in front of it (nav, product cards, copy) stays clean, premium, and legible. The background sets the mood; it never competes with the products.

Think "premium dessert brand with a Disney-magic wink," not "kids' theme park site." Restraint is the goal — one signature moment (the animated castle/rainbow/stars scene), and quiet, disciplined UI everywhere else.

---

## 2. Color Palette

| Token | Hex | Use |
|---|---|---|
| `--navy-950` | `#0B1226` | Base background (deep night sky) |
| `--navy-800` | `#132244` | Secondary background / card backing on dark sections |
| `--navy-600` | `#1F3A5F` | Headings, primary UI accents on light sections |
| `--gold-500` | `#C9962C` | Primary accent — CTAs, price highlights, dividers |
| `--rainbow-arc` | gradient: `#F25C54 → #F2A65A → #F2E86D → #7ED6A5 → #6CB4EE → #B48CE0` | The rainbow arc only — used nowhere else |
| `--star-white` | `#F8F7F2` | Stars, headline text on navy, card text on dark |
| `--cream-100` | `#FAF7F0` | Light section backgrounds (Shop/Checkout content areas) |
| `--charcoal-700` | `#2B2B2B` | Body text on light backgrounds |

Keep the rainbow gradient sacred to the hero scene — don't reuse it on buttons or badges, or it stops feeling special.

---

## 3. Typography

- **Display face:** a confident, slightly rounded serif or high-contrast serif (e.g. something in the spirit of "Fraunces" or "Canela") for the hero headline and section titles — gives the "storybook" warmth without looking childish.
- **Body/UI face:** a clean geometric sans (e.g. "Inter" or "General Sans") for product names, prices, buttons, and all functional text — keeps checkout, cart, and admin panel feeling sharp and trustworthy.
- **Scale:** Hero H1 ~56–64px desktop / 32–36px mobile. Section H2 ~36px / 24px. Body 16–18px. Never drop body text below 14px, including on cards.
- Set the hero headline in the serif on navy with generous letter-spacing; everything transactional (prices, buttons, form labels) in the sans, always high-contrast against its background.

---

## 4. The Animated Hero Background

This is the signature element — build it once, do it well, and let the rest of the UI stay quiet.

**Layers (back to front):**
1. **Sky base** — `--navy-950`, very subtle vertical gradient to `--navy-800` near the bottom so the castle silhouette reads clearly.
2. **Stars** — small white/gold dots scattered irregularly (avoid a grid pattern), 2–3 sizes, soft twinkle animation (opacity pulsing on a slow, staggered loop — no fast blinking).
3. **Castle silhouette** — a simple, elegant turret silhouette (not a licensed Disney castle — an original silhouette in the same spirit: spires, flags, symmetrical) anchored bottom-center or bottom-third, in a slightly lighter navy tone than the sky so it reads as a silhouette, not a black cutout.
4. **Rainbow arc** — rises from behind/above the castle, using the `--rainbow-arc` gradient at low opacity (40–60%) so it glows rather than shouts. Animate it drawing/fading in once on page load, then hold static.

**Cursor interaction (the "responds to cursor" part):**
- Treat it as a **subtle parallax**, not a game. On desktop, as the cursor moves, shift each layer at a different rate: stars move the most (furthest layer, ~8–12px range), the rainbow a little less (~5–8px), the castle barely at all (~2–4px) — this depth separation is what sells the "premium" feel rather than gimmicky.
- Movement should ease/lag slightly behind the cursor (spring/inertia easing, ~200–300ms), never snap instantly.
- On mobile/touch, skip cursor parallax (no cursor) — instead, do a single gentle on-load animation (stars fade in, rainbow draws up) and leave it static, or use a very subtle device-tilt parallax if you want extra polish. Never rely on hover-only effects for anything functional.
- Respect `prefers-reduced-motion`: fall back to a static version of the same scene with no parallax and no twinkle.

**Placement:** This scene lives full-bleed behind the Home page hero (and can echo faintly, much more subdued, behind the site footer). It should NOT appear behind Shop, Cart, Checkout, My Orders, or Admin — those need maximum clarity and speed, so switch to the `--cream-100` / white surfaces there, keeping only the navy/gold color language for continuity.

---

## 5. Product Cards

- Cards float **on top of** the background scene on Home (in a light or frosted card surface, e.g. `--cream-100` at ~95% opacity with a soft shadow) so text and product photos stay perfectly legible against the busy navy background behind them.
- On Shop/catalog pages (no animated background), cards sit on plain `--cream-100`, so lean on a subtle shadow and 1px hairline border (`--navy-600` at 10% opacity) for separation instead.
- Every card: product photo (consistent crop ratio, e.g. 4:5), name in the sans face, price in gold or navy (bold, clearly the most prominent number on the card), a quantity stepper, and an "Add to Cart" button in `--gold-500` with navy text.
- Bulk-discount pricing (e.g. "Save 10% at 6+") should appear as a small badge on the card, not buried in copy.
- Corner radius: consistent, moderate (e.g. 12–16px) — soft enough to feel premium, not pill-shaped/toy-like.
- Hover state (desktop): gentle lift (translateY -4px) + shadow deepen, ~150ms ease. No rotation, no bounce.

---

## 6. Layout Concept (ASCII wireframes)

**Home — hero section**
```
┌───────────────────────────────────────────┐
│  [nav: logo · Shop · My Orders · Cart]     │
│                                             │
│        ✦   ✦        (stars, navy bg)      │
│              🌈  (rainbow, glowing)         │
│           🏰  (castle silhouette)           │
│                                             │
│      "A little Disney magic,               │
│       delivered fresh to your door."        │
│           [ Shop the Churros → ]            │
└───────────────────────────────────────────┘
        ↓ scroll
┌───────────────────────────────────────────┐
│   Featured products (3 cards, cream bg)     │
└───────────────────────────────────────────┘
┌───────────────────────────────────────────┐
│   Brand story block (image + short copy)    │
└───────────────────────────────────────────┘
┌───────────────────────────────────────────┐
│   FAQ accordion                             │
└───────────────────────────────────────────┘
```

**Shop page**
```
┌───────────────────────────────────────────┐
│  [nav]                                      │
│  Filters (category: Churros/Beignets/       │
│   Chimichangas)         [Sort ▾]            │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│  │card│ │card│ │card│ │card│  (grid, 4→2→1) │
│  └────┘ └────┘ └────┘ └────┘               │
└───────────────────────────────────────────┘
```

Mobile collapses the grid to a single column, nav becomes a hamburger, and the hero scene simplifies (smaller castle, fewer stars, no parallax as noted above) but keeps the same color story so the brand feels consistent top to bottom.

---

## 7. Page-by-Page Guidelines & Overall Flow

### Overall user flow

```
 Home ──────────► Shop ──────────► Product Page ──────────► Cart
 (story, hero,     (full catalog,    (photos, weight,          │
  featured cards,   filters, bulk     description, add to       │
  FAQ)              badges)          cart)                     ▼
                                                              Checkout
                                                          (COD or Stripe)
                                                                 │
                                        ┌────────────────────────┘
                                        ▼
                              Order Confirmation
                              (on-screen + email)
                                        │
                                        ▼
                                  My Orders
                          (status: Placed → Dispatched
                           → Delivered, or Cancelled —
                           each change also emails customer)

 Login / Sign Up ──► gates Cart→Checkout (guest checkout optional,
                      but My Orders requires an account)

 Contact ──► used for 50-pc / full-case bulk quote requests,
             reachable from Shop and product pages

 Admin Panel (separate, authenticated area, not linked from
 public nav) ──► Products (add/edit/pricing/sale toggle)
             ──► Orders (status updates, customer info)
```

The public site (Home → Shop → Product → Cart → Checkout → My Orders) is one continuous, story-led path — every screen should feel like the natural next step, not a separate destination. The Admin Panel is intentionally a different world visually: same navy/gold brand color language, but zero hero/story elements, dense and fast, built for repeated daily use rather than persuasion.

### Home

- **Job:** tell the story, build desire, funnel into Shop.
- Hero (animated castle/rainbow/stars scene) + one-line brand promise + primary CTA ("Shop the Churros").
- Featured products strip — 3–4 cards max, not the full catalog. This is a teaser, not the store.
- Brand story block — short, warm copy + a real product photo (not stock imagery), reinforcing "Disneyland treats, made real at home."
- Social proof if available (reviews/testimonials) sits between the story block and FAQ — omit cleanly if there's no real content yet rather than filling with placeholder quotes.
- FAQ accordion at the very bottom, closed by default, answering the objections that stop a purchase (shipping time, how items arrive, bulk/party orders, storage/reheating).
- Footer: nav links, contact info, socials — quiet, no rainbow bleed beyond a faint echo of the star field.

### Shop

- **Job:** let the customer compare and choose fast.
- Category filter across the top: Churros / Beignets / Chimichanga Burritos (matches the three product lines).
- Optional sort (Price, Popularity).
- Grid of product cards (see Section 5) — 4 columns desktop, 2 tablet, 1 mobile.
- Bulk-order tiers (50-pc, full case) shown as a card variant or banner that routes to Contact/"Request a Quote" instead of Add to Cart, so it's visually distinct from instant-checkout items.
- No hero scene here — plain `--cream-100` background, nav stays consistent from Home.

### Product Page

- **Job:** answer every question that would stop someone from adding to cart.
- Large product photo(s), name, price (with bulk-discount tiers listed plainly, e.g. "1–5: $X · 6+: save 10%").
- Weight/pack size clearly stated.
- Short description in the same warm brand voice as Home, not clinical copy.
- Quantity stepper + Add to Cart, sticky on mobile scroll so it's always reachable.
- Cross-sell: "Pairs well with…" linking to the other two product lines.

### Cart

- **Job:** frictionless review, no surprises.
- Line items with photo thumbnail, name, quantity (editable), line price.
- Auto-applied bulk discount shown as a visible line ("Bulk discount: −$X"), not hidden until checkout.
- Clear subtotal, and a single obvious "Checkout" CTA.
- Empty state: friendly, on-brand, links back to Shop — not a bare "Your cart is empty."

### Checkout

- **Job:** fast, trustworthy, zero distraction.
- No hero/animation — plain, well-lit `--cream-100` layout, generous spacing, form fields with clear labels.
- Payment method toggle: **Cash on Delivery** vs **Stripe** — visually equal weight, not Stripe-as-default/COD-as-afterthought.
- Order summary visible alongside the form (sidebar desktop, collapsible summary on mobile) so the customer never loses sight of what they're paying.
- Trust signals near the payment button: secure checkout note, accepted card icons.
- On success → dedicated confirmation screen (order number, summary, "check your email") — not just a toast.

### My Orders

- **Job:** reduce "where's my order" anxiety without contacting support.
- List of past orders, most recent first, each showing order #, date, items, total, and current status.
- Status shown as a clear stepper/badge: Placed → Dispatched → Delivered (or Cancelled, styled distinctly e.g. muted red).
- Tapping an order expands full detail (items, address, payment method).
- Empty state for new accounts: friendly, links to Shop.

### Login / Sign Up

- **Job:** stay out of the way.
- Minimal, centered form, brand mark at top, no hero scene.
- Keep copy human: "Log in" / "Create account," not "Authenticate."
- Consider allowing guest checkout with an optional "create an account" prompt post-purchase, since forcing signup before checkout is a common drop-off point — flag this as a decision for the client if not already settled.

### Contact

- **Job:** capture bulk/party order leads and general questions.
- Simple form (name, email, message, optional "order size" field) plus direct email/phone if the client wants it listed.
- This is also where the 50-pc/full-case "Request a Quote" flow lands, so consider a pre-filled subject or a dedicated toggle ("I'm asking about a bulk order") so admin can triage.

### Admin Panel

- **Job:** fast, dense, reliable — the opposite of the marketing site's mood.
- Left-nav or top-tab structure: Products / Orders / (future: Customers, Discounts).
- Products: table/list with quick-edit inline where possible (price, sale toggle), full edit view for description/images/bulk tiers.
- Orders: table with filter by status, search by customer, and a clear one-click way to change status (Dispatched/Delivered/Cancelled) that triggers the customer email — make that email trigger visually obvious (e.g. a small confirmation toast: "Customer notified") so whoever's running it trusts it happened.
- No navy/rainbow hero styling here — brand color language only in accents (gold buttons, navy headers), everything else neutral and legible for fast scanning.

---

## 8. Motion Guidelines (site-wide)

- One orchestrated moment on load (hero scene draw-in). Everything else is restrained micro-interaction: button hover/press states, card lift, smooth accordion open for FAQ, subtle fade/slide on scroll-reveal for sections below the fold.
- No more than one animated element competing for attention at a time.
- Checkout, Cart, My Orders, and Admin Panel should feel fast and almost motion-free — these are task screens, not brand moments. Save the "delight" budget for Home.

---

## 9. Responsiveness Checklist

- Breakpoints: mobile (< 640px), tablet (640–1024px), desktop (> 1024px).
- Hero text and castle scene scale down together — never let the castle shrink out of proportion to the headline.
- Cards: 1 column mobile, 2 columns tablet, 3–4 columns desktop.
- Tap targets (Add to Cart, quantity stepper, nav links) minimum 44×44px on mobile.
- All prices, quantities, and status labels must remain fully readable at mobile width — no truncation of price or discount text.
- Admin panel: prioritize a clean responsive table/list view on mobile (stacked card-style rows) since it'll likely be checked from a phone between tasks.

---

## 10. Tone Reminder for Figma Make Prompts

When prompting Figma Make screen-by-screen, keep repeating the throughline so it doesn't drift into a generic template: **"premium, cinematic, story-first on Home; clean, fast, and trustworthy everywhere transactional happens (Shop, Cart, Checkout, My Orders, Admin)."** The navy/gold/rainbow scene is the one "wow" moment — everything else should feel calm, confident, and easy to buy from.