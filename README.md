# Ecommerce Task

Falcon-inspired ecommerce storefront built with Next.js App Router and TypeScript.

## Features

- Responsive Falcon-style storefront, navigation, footer and promotional sections
- 520 deterministic local products
- Product API with search, category, price, rating, sorting and pagination
- URL-driven listing: search, filters, sort and page all live in query params and survive refresh
- Full pagination with page windowing and previous/next controls
- Product detail pages with SEO metadata, reviews, stock, related products and 404 handling
- Persistent Zustand cart with quantity controls and live totals
- React Hook Form + Zod validated checkout
- Loading skeletons, empty/error/not-found states and responsive layouts
- Reusable shadcn-style UI primitives with Tailwind CSS

## Tech stack

- **Next.js 16** — App Router, Server/Client Components, Turbopack
- **TypeScript 5** — strict mode
- **Tailwind CSS 4** — utility-first CSS with custom design tokens
- **Zustand 5** — persistent cart state management
- **React Hook Form 7** — form state management
- **Zod 4** — schema validation
- **Lucide React** — icon library
- **shadcn/ui style** — Radix UI primitives with custom styling

## Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## API

### `GET /api/products`

Query parameters:

| Parameter  | Type   | Description                          | Example            |
|------------|--------|--------------------------------------|--------------------|
| `search`   | string | Full-text search across name, category, description | `?search=laptop` |
| `category` | string | Filter by exact category name        | `?category=Audio`  |
| `minPrice` | number | Minimum price filter                 | `?minPrice=1000`   |
| `maxPrice` | number | Maximum price filter                 | `?maxPrice=50000`  |
| `rating`   | number | Minimum rating filter                | `?rating=4.5`      |
| `sort`     | string | Sort order: `price-low`, `price-high`, `rating` | `?sort=price-low` |
| `page`     | number | Page number (default: 1)             | `?page=2`          |
| `limit`    | number | Items per page (default: 12, max: 48)| `?limit=24`        |

Example: `GET /api/products?search=laptop&category=Electronics&sort=price-low&page=1&limit=12`

Response:
```json
{
  "items": [...],
  "total": 520,
  "page": 1,
  "limit": 12,
  "totalPages": 44,
  "categories": ["Audio", "Electronics", "Lifestyle", "Accessories", ...]
}
```

### `GET /api/products/[id]`

Returns a single product by `id` or `slug`. Returns 404 for unknown ids.

## Structure

```
app/                    — App Router pages, error/not-found boundaries and API routes
  layout.tsx            — Root layout with global metadata
  page.tsx              — Home page with hero, featured products
  products/page.tsx     — Server-rendered product listing
  products/[id]/page.tsx— Product detail with reviews, related products
  cart/page.tsx         — Cart page
  checkout/page.tsx     — Checkout with React Hook Form + Zod
  api/products/route.ts — Products listing API
  api/products/[id]/route.ts — Product detail API
  not-found.tsx         — 404 boundary
  error.tsx             — Error boundary

components/
  layout/               — StoreHeader, StoreFooter (client components for interactivity)
  products/             — ProductCard, ProductGrid, ProductActions, ProductBrowser
  cart/                 — CartView
  ui/                   — Button, Input, Select, Pagination, Breadcrumb, Tooltip, Badge, Skeleton
  styles/               — globals.css, variables.css, button-overrides.css

data/products.json      — Seed catalog expanded deterministically to 520 products
services/               — Product querying and related-product logic
store/                  — Persistent Zustand cart
schemas/                — Zod checkout schema
lib/                    — Formatting and shared cart helpers
types/                  — TypeScript type definitions
```

## Server and client components

Home, product listing, product detail and API routes use server-side data access. Interactive filters, cart controls, navigation and checkout use client components only where browser state is required.

The listing is server-rendered: `app/products/page.tsx` reads `searchParams`, queries the service, and passes the page of results to the client `ProductBrowser`. The browser only pushes new query strings through the Next router — it never fetches the API itself, so there is no duplicate request on mount or hydration.

## Zustand cart architecture

The cart uses Zustand 5 with the `persist` middleware, storing state in `localStorage` under the key `ecommerce-task-cart`. The store provides:

- `add(product, quantity)` — adds a product or increases quantity (capped at stock)
- `remove(id)` — removes an item
- `inc(id)` — increases quantity by 1 (capped at stock)
- `dec(id)` — decreases quantity by 1 (minimum 1)
- `clear()` — empties the cart

Components use targeted selectors (`useCartStore((s) => s.items)`) so re-renders only happen when the relevant slice changes.

## React Hook Form and Zod validation

The checkout form uses React Hook Form with the Zod resolver. The schema (`schemas/checkout.schema.ts`) validates:

- `fullName` — minimum 2 characters
- `email` — valid email format
- `phone` — minimum 7 characters
- `address` — minimum 5 characters
- `city` — minimum 2 characters
- `postalCode` — minimum 3 characters

Error messages are displayed via `role="alert"` for screen reader accessibility.

## Data-fetching approach

Product data is accessed through `services/product.service.ts`. Components never read the dataset directly. The service layer handles:

- Full-text search (name, category, description)
- Category filtering
- Price range filtering
- Rating filtering
- Sorting (price low/high, rating)
- Pagination with configurable limit (default 12, max 48)

Invalid query values are normalized: page and limit are clamped, non-numeric values are ignored, and the detail endpoint returns 404 for unknown ids.

## Responsive strategy

The app is responsive from 280px to 1440px+ using Tailwind CSS breakpoint prefixes:

- **Mobile (280px–800px)**: Single-column layouts, stacked filters, hamburger menu, full-width cards
- **Tablet (801px–1079px)**: 2-column product grid, side-by-side product detail
- **Desktop (1080px+)**: 3-4 column grid, sidebar filters, full navigation

Key responsive breakpoints: `max-[800px]`, `min-[601px]`, `min-[801px]`, `min-[1080px]`, `min-[1200px]`, `min-[1280px]`

## Performance decisions

- **Server-rendered listing data.** The dataset query runs on the server; the client receives one page of items. No client-side fetch, no duplicate mount request, and no unnecessary payload.
- **URL as the single source of truth.** Filters, sort and page are read from `useSearchParams` and written with `useTransition`, so navigation stays responsive and state survives refresh without duplicated React state.
- **Debounced free-text inputs.** Search and price fields debounce URL updates (~350ms) instead of firing a request per keystroke.
- **Minimal client bundle.** Only components that need interactivity (`StoreHeader`, `ProductCard`, `ProductBrowser`, `ProductActions`, `CartView`, checkout) are client components; layout, footer, grid and detail pages stay on the server.
- **Targeted Zustand selectors** (`useCartStore((s) => s.items)`) so cart components re-render only when their slice changes.
- **`useMemo`/`useCallback`/`React.memo` are intentionally avoided** where there is no measured need; they are used only where a stable identity matters (the debounce commit callback).
- **Cleanup** of timers (`ProductActions`) prevents state updates after unmount.

## Deployment

The app builds with `npm run build` and runs with `npm start`.

Deploy to Vercel:

1. Push the repository to GitHub.
2. Import it at vercel.com/new (framework preset: Next.js).
3. No environment variables are required.

## Verification

```bash
npm run lint    # ESLint passes
npm run build   # Production build succeeds
```