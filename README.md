# Uncle Walt's Churros

Next.js (App Router) storefront migrated from the Figma Make prototype in [`figma/`](figma/) (kept as the original reference).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint (Next.js core-web-vitals config; `figma/` is ignored)

## Routes

| Route           | Page                                |
| --------------- | ----------------------------------- |
| `/`             | Home (hero, features, BOGO banner)  |
| `/shop`         | Product catalog                     |
| `/cart`         | Cart (bulk discount rules)          |
| `/checkout`     | Checkout (Stripe demo, flat rate)   |
| `/confirmation` | Order confirmation                  |
| `/login`        | Sign in (demo: any email + 6 chars) |
| `/signup`       | Create account                      |
| `/admin`        | Admin dashboard (orders/products)   |
| `/contact`      | Contact + bulk order request        |

The Nav bar is hidden on `/admin`, `/login`, and `/signup` (they render their own full-screen layouts).

## Structure

- `src/app/` — routes, root layout (Fraunces/Inter via `next/font`), global Tailwind v4 theme (`globals.css`)
- `src/components/StoreProvider.jsx` — client-side store (cart, orders, products, user) replacing `App.tsx` state
- `src/components/` — Nav, ProductCard, HeroBackground, LoginForm, SiteShell, RevealBlock, ui
- `src/data/` — seed products and orders
- `src/services/shipstation.js` — ShipStation client (demo fallbacks when no API keys are set)
- `src/utils/cart.js` — pricing helpers (subtotal, bulk discount, totals)

## Notes

- Product/order images load from Unsplash (`images.unsplash.com` is allowlisted in `next.config.mjs`).
- Admin access: sign in with any email containing `admin` or `walt`, or use the "Enter as Admin" demo button on `/login`.
- No real ShipStation or Stripe API keys are configured; all flows work with demo data.
