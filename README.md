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

Next.js 16, TypeScript, Tailwind CSS, Zustand, React Hook Form, Zod, Lucide React and shadcn-style components.

## Run locally

```bash
npm install
npm run dev
```

## API

`GET /api/products?search=laptop&category=Electronics&sort=price-low&page=1&limit=12`

`GET /api/products/[id]`

Product data is accessed through `services/product.service.ts`; components do not read the dataset directly.
Invalid query values are normalized (page/limit are clamped, non-numeric values ignored) and the detail endpoint returns `404` for unknown ids.

## Structure

- `app/` — App Router pages, error/not-found boundaries and API routes
- `components/` — layout, product, cart and reusable UI components
- `data/products.json` — seed catalog expanded deterministically to 520 products
- `services/` — product querying and related-product logic
- `store/` — persistent Zustand cart
- `schemas/` — Zod checkout schema
- `lib/` — formatting and shared cart helpers

## Server and client components

Home, product listing, product detail and API routes use server-side data access. Interactive filters, cart controls, navigation and checkout use client components only where browser state is required.

The listing is server-rendered: `app/products/page.tsx` reads `searchParams`, queries the service, and passes the page of results to the client `ProductBrowser`. The browser only pushes new query strings through the Next router — it never fetches the API itself, so there is no duplicate request on mount or hydration.

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

Live demo URL: _add after deploying_ (Cannot verify — no deployment exists in this repository yet.)

## Verification

```bash
npm run lint
npm run build
```
