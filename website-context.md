# Uncle Walt's Churros — Website Context

Complete developer context for the **Uncle Walt's Churros** storefront: how it works, what
each page shows, the order mechanism, the admin dashboard, and the reusable pieces (cart,
shipping, cooking guide, auth).

---

## 1. Overview

An e-commerce storefront for a fictional, park-inspired churro brand ("Uncle Walt's Churros",
founded by Walter Marquez — a Disneyland churro fanatic). Customers can browse the catalogue,
add products to a cart, check out (Cash on Delivery or Stripe demo), see an order confirmation,
and get reheating instructions via a cooking guide. A full admin dashboard manages orders,
products, and shipping (through ShipStation).

The whole app runs **client-side state** (a React Context store) — there is **no backend,
database, or API** for core commerce. Everything is in-memory demo data, so state resets on a
page refresh. Integrations (ShipStation, Stripe) exist as demo wrappers with simulated responses.

> **Important:** `figma/` in the repo root is the original Figma Make prototype — reference only,
> not part of the Next.js app, and ignored by ESLint.

---

## 2. Tech Stack

- **Next.js 16.3** (App Router) + React 19
- **JavaScript / JSX only** — no TypeScript
- **Tailwind CSS v4** (via `@tailwindcss/postcss`, theme defined with `@theme` in CSS)
- **Tailwind v4 theme tokens** in `src/app/globals.css` (custom colors — no arbitrary-value
  classes scattered across pages)
- **Fonts:** Fraunces (display) + Inter (body), loaded via `next/font` into CSS variables
  (`--font-display`, `--font-sans`)
- **dependencies available:** `lucide-react`, `@stripe/stripe-js`, `stripe` — but the UI uses
  **custom inline SVGs**, not icon libraries
- **`next/image`** for images, sourced from Unsplash (allowlisted in `next.config.mjs`)
- No external UI library, no real backend

---

## 3. Project Structure

```
src/
├── app/                     # App Router routes
│   ├── layout.jsx           # Root layout → StoreProvider + SiteShell
│   ├── page.jsx             # Home
│   ├── shop/                # Product catalogue
│   ├── cart/                # Cart
│   ├── checkout/            # Checkout form
│   ├── confirmation/        # Order confirmation (+ compact cooking guide)
│   ├── cooking/             # Standalone Cooking Guide page
│   ├── contact/             # Contact + bulk order request
│   ├── login/               # Renders <LoginForm />
│   ├── signup/              # Create account
│   └── admin/               # Admin dashboard (orders/products/settings/MODULES)
├── components/
│   ├── StoreProvider.jsx    # Global client store (cart, orders, products, user)
│   ├── SiteShell.jsx        # Renders Nav unless hidden route
│   ├── Nav.jsx              # Sticky nav (desktop + mobile)
│   ├── ProductCard.jsx      # Product card with qty stepper + "Add to Cart"
│   ├── HeroBackground.jsx   # Animated canvas starfield + castle silhouette
│   ├── LoginForm.jsx        # Sign-in (demo auth, used by /login and /admin gate)
│   ├── RevealBlock.jsx      # Scroll-reveal wrapper
│   ├── ui.jsx               # Spinner + shimmer skeletons (admin loading)
│   └── cooking/             # Reusable cooking guide UI
├── data/
│   ├── products.js          # Seed products
│   ├── orders.js            # Seed/mock orders
│   └── cooking.js           # Cooking guide data (churros/beignets/chimichangas)
├── lib/cooking.js           # Category detection + accent class helper
├── services/shipstation.js  # ShipStation REST client (with demo fallbacks)
├── hooks/useScrollReveal.js # IntersectionObserver reveal hook
├── utils/cart.js            # Pricing helpers
└── app/globals.css          # Tailwind v4 @theme + global keyframes
```

**Path alias:** `@/*` → `./src/*` (jsconfig.json), e.g. `@/components/StoreProvider`.

---

## 4. Design System

Defined entirely in `src/app/globals.css` using Tailwind v4's `@theme`:

| Token            | Hex        | Usage                                |
| ---------------- | ---------- | ------------------------------------ |
| `navy-950`       | `#0b1226`  | Dark nav, page headers, footer       |
| `navy-800`       | `#132244`  | Panels on dark backgrounds           |
| `navy-600`       | `#1f3a5f`  | Muted borders / text                 |
| `gold-500`       | `#c9962c`  | Primary accent (CTAs, star, badges)  |
| `gold-400`       | `#d4a843`  | Lighter gold (hover/emphasis)        |
| `gold-100`       | `#fdf3dc`  | Gold tint backgrounds                |
| `star-white`     | `#f8f7f2`  | Off-white text on dark (headings/nav)|
| `cream-100`      | `#faf7f0`  | Light page background                |
| `cream-200`      | `#f3ede1`  | Slightly darker tint (image placeholders) |
| `charcoal-700`   | `#2b2b2b`  | Body text on light backgrounds       |
| `blue-accent-*`  | —          | Cooking guide accent (beignets)      |
| `orange-accent-*`| —          | Cooking guide accent (chimichangas)  |

Design conventions:
- Headings use `style={{ fontFamily: 'var(--font-display)' }}` (Fraunces).
- Cards: `rounded-2xl border border-navy-600/10 bg-white`, dark cards `bg-navy-800/… border-star-white/5`.
- Page headers: navy-950 block with an overline eyebrow (`text-gold-500`, uppercase, tracked) + display heading.
- Buttons: gold pill/rounded CTAs, `hover:bg-gold-400`, text `text-navy-950`.
- Used ad-hoc Tailwind default colors in admin only: `blue/amber/green/red/purple` for status pills and `#00A4B4` (ShipStation teal) inline.

---

## 5. Routes & What Each Page Shows

| Route | Page | Highlights |
| --- | --- | --- |
| `/` | Home | Interactive hero (canvas starfield, click for sparkles, move cursor to push stars), founder story timeline (1989→now), stats strip, 3 featured products, testimonials, FAQ accordion, footer |
| `/shop` | Catalogue | Filter by category (All/Churros/Beignets/Chimichangas), sort by price, responsive 1–4 column grid, bulk-order callout (mailto `events@unclewalts.com`) |
| `/cart` | Cart | Line items with qty steppers (+/−/×), subtotal, bulk discount line, 10%-off nudge under 6 items, checkout CTA |
| `/checkout` | Checkout | Delivery form (validation), payment method toggle (COD / Stripe), order summary sidebar, places order → `/confirmation` |
| `/confirmation` | Order confirmation | "Order Placed" card with order number, 3-step status strip, **cooking guide** for purchased categories |
| `/cooking` | Cooking Guide | Hero + sidebar (category tabs) + detail panel (methods + info). Entries are generated from `data/cooking.js` |
| `/contact` | Contact | Message form, bulk-order toggle, direct email/phone panel, response hours, bulk CTA |
| `/login` | Sign in | Full-screen dark starfield, demo quick-access buttons, Google + email form |
| `/signup` | Create account | Full-screen form (name/email/password) + Google button |
| `/admin` | Admin dashboard | Orders / Products / Settings tabs; **gated** behind admin login |

**Nav visibility:** `SiteShell` (`src/components/SiteShell.jsx`) hides the global Nav on
`/admin`, `/login`, `/signup` — those pages have full-screen layouts. The Nav shows Shop,
**Cooking**, Contact, Cart (with badge), and auth controls.

---

## 6. Design of Product Data

`src/data/products.js` — seed array with fields:

```js
{
  id: 1,
  name: 'Classic Cinnamon Churros',
  category: 'churros',          // 'churros' | 'beignets' | 'chimichangas'
  price: 12.99,                 // regular price
  price6plus: 11.69,            // bulk price applied at qty >= 6
  weight: '6 churros · 480g',
  description: '…',
  image: 'https://images.unsplash.com/…',
  featured: true,               // shown on home page
}
```

- 6 seed products: 3 churros, 2 beignets, 1 chimichanga.
- `featuredProducts` derives from `featured === true`.
- Products are stored in React state, so **admin can add/delete/toggle-feature at runtime**.

---

## 7. The Store — `StoreProvider`

`src/components/StoreProvider.jsx` is a client-side Context ("the source of truth"), replacing
what would be a backend/Redux layer. Exposed via `useStore()`:

| State | Shape | Purpose |
| --- | --- | --- |
| `cart` | `[{ id, name, price, image, quantity }]` | Line items in the cart |
| `lastOrderId` | string (`UW-######`) | Order number shown on confirmation |
| `user` | `{ name, email, isAdmin }` or `null` | Current signed-in user |
| `orders` | array (seeded from `data/orders.js`) | Every order (new ones prepended) |
| `products` | array (seeded from `data/products.js`) | Live catalogue (admin edits this) |

Derived: `cartCount` (total quantity).

Actions:
- `addToCart(product, qty)` — merges by `id` or appends.
- `updateQty(id, qty)` — removes the item when `qty <= 0`.
- `placeOrder(formData)` — **creates the order** (see §8), sets `lastOrderId`, clears the cart.
- `updateOrderStatus(orderId, status)` — sets `status` (Placed/Dispatched/Delivered/Cancelled).
- `updateOrderShipping(orderId, tracking, carrier, shipstationOrderId)` — stores tracking,
  sets carrier + status `Dispatched`.
- `addProduct / deleteProduct / toggleFeatured` — admin catalogue management.
- `login(user) / logout()` — sets user to `null`.

`useStore()` throws if used outside `<StoreProvider>` (wrapped in root `layout.jsx`).

---

## 8. Order Mechanism (End to End)

### 8.1 Add to cart
`ProductCard` lets a shopper pick qty (min 1) and hit **Add to Cart**. If qty ≥ 6 the **bulk
price** (`price6plus`) is used and a *Save 10% at 6+* badge is shown. After adding, the button
flashes "✓ Added". Cart count badge updates in the Nav.

### 8.2 Pricing rules (`src/utils/cart.js`)
- `cartSubtotal(items)` — Σ price × quantity.
- `cartQuantity(items)` — Σ quantity.
- `bulkDiscount(items)` — **10% of subtotal when total quantity ≥ 6**, else 0.
- `cartTotal(items)` — subtotal − bulk discount.

The unit price already reflects bulk pricing at the *line level* when the shopper picked qty ≥ 6
on the card, so the 10% discount is an **additional** order-level incentive.

### 8.3 Checkout
`/checkout` collects name/email/phone/delivery address and a payment method:
- **COD** (Cash on Delivery) — default.
- **Stripe** — demo only; shows a placeholder note ("Card fields appear here via Stripe
  Elements in production").

Client-side validation blocks incomplete forms. On submit → simulated 1s delay →
`placeOrder()` → `router.push('/confirmation')`.

### 8.4 Order object shape
```js
{
  id: 'UW-173456',                 // based on Date.now()
  date: '2026-08-05',
  customer: { name, email, phone },
  address: 'Street, City, ZIP',
  payment: 'COD' | 'Stripe',
  items: [{ name, qty, price, image }],   // note: qty, not quantity
  subtotal,                              // number
  discount,                              // bulk discount amount
  total,                                 // subtotal - discount
  status: 'Placed',
  // added later by shipping: trackingNumber, carrier, shipstationOrderId
}
```

`placeOrder` prepends the order to `orders` and stores its id in `lastOrderId`. The new order can
be found in the store as `orders.find(o => o.id === lastOrderId)`.

### 8.5 Confirmation page
Reuses the store to derive cooking guide categories:

```js
const categories = getCategoriesFromOrder(order?.items ?? [])
```

Then renders `<CookingGuide categories={categories} compact />` (one guide card per category —
**not** per product) below the "Order Placed" receipt.

### 8.6 Mock orders
`src/data/orders.js` seeds 7 orders covering every status (Placed/Dispatched/Delivered/
Cancelled) and a mix of categories. These appear in the admin dashboard immediately.

---

## 9. Auth & Roles (Demo)

There is **no real authentication**. Rules:

- **Log in** (`LoginForm`): any email containing `admin` or `walt` (case-insensitive) ⇒
  `isAdmin: true`; anything else ⇒ regular user. Password just needs ≥ 6 chars.
- **Quick demo buttons** on `/login`: "Enter as Admin" (`admin@unclewalts.com`) and
  "Enter as User" (`guest@example.com`) — one click, no password.
- **Sign up** (`/signup`): creates a regular (non-admin) user and redirects home.
- **Admin gate:** `/admin` renders `<LoginForm intendedAdmin />` when `!user?.isAdmin`, i.e.
  admin pages are only reachable after an admin login. Logging out returns to `/`.

The Nav shows Admin link (for admins), Log out, Log in / Sign up, and a user avatar chip.

---

## 10. Admin Dashboard — `/admin`

Dark full-screen layout (top bar + collapsible sidebar + content). Three tabs:

### 10.1 Orders tab
- **Stats strip:** Total / Pending / In transit / Revenue (Revenue excludes Cancelled).
- **Search:** by order id, customer name, or email.
- **Status filter:** All / Placed / Dispatched / Delivered / Cancelled.
- **Table** (responsive: mobile cards, tablet, desktop grid) showing order id, date, customer,
  address, item count, payment, total, status badge, plus:
  - **Status dropdown** → calls `updateOrderStatus` + toast.
  - **Ship button** → opens the single-order shipping panel (rate lookup, label purchase). If a
    tracking number exists, a green dot + Track link show instead.
  - **Expand** → inline detail: items with images/qty, payment breakdown, shipping block.
  - **Sync to ShipStation** → pushes the order and toasts on success.
- **Bulk actions:** checkbox-select any non-Cancelled orders → "Bulk Create Labels" modal that
  generates labels for all selected orders against a chosen service, updating statuses to
  *Dispatched* and showing per-order progress (pending / creating / done / error).

### 10.2 Products tab
- Searchable table (image, name, weight, category, regular/bulk price, featured toggle, delete).
- **Add Product** → slide-over form (name, category, prices, weight, image URL with preview,
  description). New product appears in `/shop` and the home featured grid only if toggled.
- Featured toggle and delete show toast feedback. Skeleton rows while "loading".

### 10.3 Settings tab
- **ShipStation integration:** API Key / API Secret inputs, "Test Connection" button, connected /
  failed indicator. Note shown: V1 API (`ssapi.shipstation.com`) is blocked by CORS in the
  browser in production — proxy through a backend; otherwise **demo mode** simulates responses.
- **Ship-From Address:** business address used on shipping labels (persisted only in
  component state).

---

## 11. ShipStation Integration (`src/services/shipstation.js`)

REST client for the ShipStation V1 API. **Every function has a demo fallback** when the network
call fails (or is blocked by CORS):

| Function | Purpose | Demo fallback |
| --- | --- | --- |
| `testConnection(key, secret)` | GET `/carriers` | returns `{ ok, error }` |
| `getRates(key, secret, to, weightLbs)` | POST `/shipments/getrates` | `mockRates()` — canned USPS/UPS/FedEx prices zoomed by origin-state |
| `createLabel(key, secret, order, rate, weightLbs, shipFrom)` | POST `/shipments/createlabel` (`testLabel: true`) | generated fake tracking number (USPS 94001…, UPS 1Z999…, FedEx 7749…) |
| `syncOrderToShipStation(key, secret, order)` | POST `/orders/createorder` | random numeric orderId |

Helpers: `trackingUrl(carrier, tracking)` (USPS/UPS/FedEx track pages), `carrierLabel(code)`
(USPS/UPS/FedEx). Order **weight is estimated**: `0.4 lbs × qty`, min 0.5 lbs.

> No real API keys ship with the app. With empty keys the admin auto-runs in demo mode and shows
> an amber "Demo mode" notice.

---

## 12. Cooking Guide System (Reusable)

Built as modular, reusable components — renderable on the standalone `/cooking` page and
embedded in the confirmation page (compact, filtered by purchased categories).

### 12.1 Data — `src/data/cooking.js`
`COOKING_GUIDES` — one entry per category (`churros`, `beignets`, `chimichangas`):
`category`, `label`, `headline`, `subtitle`, `color` (`gold`/`blue`/`orange`), `serving`,
`storage`, `proTip`, `bestMethod`, and `methods[]` (each: `label`, `method`, `temp`, `time`,
`tip`). `getGuide(category)` returns a guide or `null`.

### 12.2 Business logic — `src/lib/cooking.js`
- `getCategoriesFromOrder(items)` — reads item names (ignores case), maps:
  - contains **"beignet"** → `beignets`
  - contains **"chimichanga"** → `chimichangas`
  - otherwise → `churros`
  Dedupes, preserves first-appearance order, skips malformed entries, returns an array.
- `getAccentClasses(color)` — returns `{ text, border, background, badge, ring }` Tailwind
  classes for the accent color; unknown colors fall back to gold.

### 12.3 Components — `src/components/cooking/`
- **`CookingGuide.jsx`** — the reusable entry point. Props: `categories` (optional filter,
  defaults to all) and `compact` (stacked cards vs interactive sidebar).
- **`CookingSidebar.jsx`** — category nav with accent-tinted active state.
- **`GuideCard`** (internal) — category header + heating methods + additional information;
  shared by both interactive and compact modes to avoid duplicate JSX.
- **`CategoryHeader.jsx`, `CookingMethods.jsx`, `MethodCard.jsx`,
  `CookingInfoCards.jsx`** — presentational building blocks.
- **`CookingIcons.jsx`** — all custom inline SVG icons (`IconChurro`, `IconBeignet`,
  `IconChimichanga`, `IconAirFryer`, `IconOven`, `IconPan`, `IconMicrowave`, `IconClock`,
  `IconTemp`, `IconServe`, `IconBook`, `IconSnowflake`, `IconLightbulb`) plus `CATEGORY_ICONS`
  and `METHOD_ICONS` lookup maps. All share the same stroke style (1.8 width, rounded caps/joins).

### 12.4 Usage
```jsx
<CookingGuide />                        // /cooking page: sidebar + detail panel, all categories
<CookingGuide compact />
<CookingGuide categories={['churros']} />
<CookingGuide categories={['churros', 'beignets']} compact />   // confirmation page
```

On the confirmation page categories come from `getCategoriesFromOrder(orderItems)` so each
**category** in the order gets one guide card.

---

## 13. Connection & Config Files

- **`next.config.mjs`** — remote image patterns (Unsplash only).
- **`jsconfig.json`** — path alias `@/*` → `./src/*`.
- **`eslint.config.mjs`** — `eslint-config-next/core-web-vitals`, ignores `.next`, `figma`.
- **`package.json`** scripts: `dev`, `build`, `start`, `lint`.

---

## 14. Useful Demo Credentials & Facts

- **Admin:** log in with any email containing `admin` or `walt` (or click "Enter as Admin" on
  `/login`; or use `admin@unclewalts.com`).
- **Regular user:** any other email / "Enter as User".
- **Bulk discount:** 10% off at ≥ 6 items (plus per-line bulk pricing at qty ≥ 6 on product cards).
- **Shipping:** all real API calls fail (no keys, CORS) → the app silently uses demo data.
- **State:** everything lives in React context in the browser; **refreshing loses cart/orders/
  products you added**. Seed data always repopulates.
- **Images:** from Unsplash via `next/image` (domain allowlisted).