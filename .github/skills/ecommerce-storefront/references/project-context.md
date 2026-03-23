# Project Context

## Current App Structure

- `src/main.tsx`: app entry, provider wiring, error boundary
- `src/App.tsx`: route shell
- `src/pages/Home.tsx`: featured products
- `src/pages/Categories.tsx`: listing page with search, sort, pagination, and category filters
- `src/pages/ProductDetails.tsx`: product detail view and add-to-cart
- `src/pages/Cart.tsx`: cart summary and editing
- `src/components/ProductCard.tsx`: listing card with quick add
- `src/components/Header.tsx`: top navigation and cart action
- `src/store/cartStore.ts`: persisted cart state

## Data Layer

- `src/providers/TrpcProvider.tsx` uses `unstable_localLink`
- tRPC procedures live in `src/api/routers/products.router.ts`
- UI reads products and categories through `trpc.products.*.useQuery`
- response validation is done with Zod in the router

## Styling Conventions

- shared variables in `src/styles/variables.scss`
- page/component styles under `src/styles/components/`
- `.btn`, `.btn-primary`, `.btn-secondary` are shared button primitives
- dark theme with green accents is already established

## Known Repository Notes

- `src/api/platziApi.ts` exists but is not the active path used by routed pages
- package metadata includes some packages not actively used in the main flow
- public API content is dynamic, especially categories and image data

## Practical Guardrails

- prefer fixing root-cause UI/data mismatches over adding console logging
- avoid rewriting layout structures unless necessary for the request
- preserve existing route structure and page responsibilities
- when adjusting interactions, check both desktop and mobile implications