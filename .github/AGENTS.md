# Workspace Agents

This workspace includes a project-specific storefront customization layer.

## Default Guidance

- Prefer the `Platzi Storefront` agent for changes to the user-facing storefront.
- Prefer the `ecommerce-storefront` skill for product listing, product detail, cart, header, filter, accessibility, image handling, and SCSS tasks.
- Keep the current stack intact unless a task explicitly asks for architectural change.

## Current Project Architecture

- React + TypeScript + Vite
- React Router for page routing
- tRPC + React Query for product and category data
- Zustand for persisted cart state
- SCSS with shared variables in `src/styles/variables.scss`
- EscuelaJS public API as the external catalog source

## Expectations For Changes

- Make the smallest coherent fix.
- Preserve accessibility and responsive behavior.
- Assume the public API can change, especially category counts and image values.
- Reuse existing utilities, shared styles, and button classes.
- Validate touched files after edits.

## Agent Selection

Use `Platzi Storefront` when the task involves:

- `src/pages/Categories.tsx`
- `src/pages/ProductDetails.tsx`
- `src/pages/Cart.tsx`
- `src/components/ProductCard.tsx`
- `src/components/Header.tsx`
- `src/store/cartStore.ts`
- SCSS updates in `src/styles/components/`

Use the default agent for:

- general repository cleanup
- documentation work not tied to storefront behavior
- broad debugging outside the storefront surface

## Workspace Hooks

This workspace includes hooks for:

- session context injection
- destructive command review
- post-edit validation reminders
- optional auto-commit on session stop

The auto-commit hook is intentionally batched on `Stop` so it can add and commit new or modified files without creating a commit after every single edit.