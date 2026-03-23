# Platzi Store Frontend

A React + TypeScript e-commerce storefront built with Vite. The app uses the EscuelaJS public API for products and categories, renders product browsing and detail pages, and manages a persistent shopping cart in local storage.

## Overview

This project is a client-rendered storefront with:

- a home page with featured products
- a categories page with search, sorting, pagination, and expandable category filters
- a product details page with image handling and add-to-cart feedback
- a cart page with quantity updates, removal, totals, and persisted state
- shared loading, error, and not-found states

## Tech Stack

### Core runtime

- React 19
- React DOM 19
- TypeScript 5
- Vite 8

### Routing

- React Router DOM 7

### Data fetching and API layer

- tRPC 11
- TanStack React Query 5
- Zod 4 for runtime validation
- `fetch` against the EscuelaJS public API: `https://api.escuelajs.co/api/v1`

### State management

- Zustand 5
- Zustand `persist` middleware for cart storage in local storage

### Styling

- SCSS / Sass
- Centralized variables and component-level SCSS files

### Tooling

- Vite React plugin
- PostCSS
- Autoprefixer
- Vercel rewrites for SPA routing

## Features

- Browse products from the public API
- View featured products on the home page
- Filter products by category
- Search products by title
- Sort products by name and price
- Paginate category results on the client
- View product details
- Add items to cart from product cards and product details
- Persist cart contents across reloads
- Update cart quantities
- Remove items from cart
- Show empty, loading, error, and not-found states
- Responsive layout for desktop and mobile
- Accessibility improvements in filters and cart navigation

## Current Architecture

### App shell

- `src/main.tsx`: React entry point, app bootstrap, provider wiring, error boundary
- `src/App.tsx`: route tree and top-level layout

### Routes

- `/` → Home
- `/categories` → Product listing with filters
- `/products/:id` → Product details
- `/cart` → Shopping cart
- `*` → Not found

### Data layer

The app uses local tRPC procedures on the client through `unstable_localLink`, which means:

- tRPC procedures are defined in the project itself
- React Query manages query caching and refetching
- Zod validates API responses at the procedure level
- the browser still fetches data from EscuelaJS, but the app keeps a typed procedure layer between UI and API calls

Relevant files:

- `src/api/trpc.ts`
- `src/api/root.ts`
- `src/api/context.ts`
- `src/api/routers/products.router.ts`
- `src/providers/TrpcProvider.tsx`

### Cart state

The cart uses Zustand with persistence:

- add items
- merge duplicate items by increasing quantity
- update quantity
- remove items
- clear cart
- normalize older persisted cart data during hydration

Relevant file:

- `src/store/cartStore.ts`

## Styling Structure

Global and shared styles:

- `src/App.scss`
- `src/styles/globals.scss`
- `src/styles/variables.scss`

Component/page styles live in:

- `src/styles/components/*.scss`


## Development Commands

Install dependencies:

```bash
pnpm install
```

Start development server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

Run TypeScript checks:

```bash
pnpm typecheck
```

## Deployment

The project includes a Vercel rewrite rule so client-side routes resolve correctly in production.

Relevant file:

- `vercel.json`

## Environment Variables

No environment variables are currently required.

## Notes On Installed Packages

These packages are installed and visible in `package.json`, but they are not part of the current main UI flow or are not actively referenced by the routed app:

- `tailwindcss`: installed, but styling is currently SCSS-based
- `clsx`: installed, but not currently referenced in the active source files
- `superjson`: installed, but not currently used in the active tRPC setup
- `src/api/platziApi.ts`: legacy helper file that is currently not used by the routed app

## Known Repository Issue

At the time of writing, full typecheck is not completely clean because `src/api/platziApi.ts` imports `axios`, but `axios` is not listed in the current dependencies and that file is not part of the active data flow.

## Accessibility Work Already Present

- labeled search and sort controls on the categories page
- expandable category list to reduce excessive vertical scrolling
- visible focus states for filter controls
- text label for the cart action in the header instead of icon-only navigation

## Future Improvements

- add automated tests
- remove or refactor unused legacy API files
- add product recommendations using the related products endpoint
- improve mobile header behavior
- add checkout flow and order confirmation

## License

No license file is currently included in the repository.
