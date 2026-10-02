# Ecommerce Task

Falcon-inspired ecommerce storefront built with Next.js App Router and TypeScript.

## Features

- Responsive Falcon-style storefront, navigation, footer and promotional sections
- 520 deterministic local products
- Product API with search, category, price, rating, sorting and pagination
- Product detail pages with SEO metadata and related products
- Persistent Zustand cart with quantity controls
- React Hook Form + Zod validated checkout
- Loading skeletons, empty states, invalid-product handling and responsive layouts
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

## Structure

- `app/` — App Router pages and API routes
- `components/` — layout, product, cart and reusable UI components
- `data/products.json` — seed catalog expanded deterministically to 520 products
- `services/` — product querying and related-product logic
- `store/` — persistent Zustand cart
- `schemas/` — Zod checkout schema

## Server and client components

Home, product listing, product detail and API routes use server-side data access. Interactive filters, cart controls, navigation and checkout use client components only where browser state is required.

## Verification

```bash
npm run lint
npm run build
```
