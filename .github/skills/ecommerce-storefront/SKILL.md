---
name: ecommerce-storefront
description: 'Use when working on this Platzi Store frontend: product listing pages, category filters, product detail pages, cart UX, header/navigation, accessibility improvements, image handling, React Query/tRPC data flow, Zustand cart state, and SCSS styling in this repo. Keywords: storefront, PLP, PDP, cart, categories, filters, header, product card, accessibility, public API, EscuelaJS.'
argument-hint: 'Describe the storefront task, affected pages, and any UX or accessibility constraints.'
user-invocable: true
---

# E-commerce Storefront

Project-specific workflow for the Platzi Store frontend.

## When To Use

Use this skill when the task involves:

- product listing page work on `src/pages/Categories.tsx`
- product details work on `src/pages/ProductDetails.tsx`
- cart or header interactions
- accessibility updates to filters, nav, buttons, or forms
- adapting the UI to changes in the public EscuelaJS API
- SCSS styling changes within the existing design system
- data fetching changes that should stay within the current tRPC + React Query pattern

## Project Constraints

This repo already has a clear stack and should not be redesigned around a new one without an explicit request.

- Framework: React + TypeScript + Vite
- Routing: React Router
- Data layer: local tRPC procedures + TanStack React Query
- Validation: Zod in the tRPC router
- State: Zustand with persisted cart state
- Styling: SCSS with shared variables in `src/styles/variables.scss`
- API source: EscuelaJS public API

Default approach:

- preserve the current architecture
- prefer minimal, targeted edits
- reuse existing utilities before adding new ones
- keep accessibility improvements additive and practical
- do not introduce Tailwind, Redux, component libraries, or a new design system unless asked

## Required Discovery For Storefront Changes

Before making non-trivial storefront changes, identify:

1. Which surface is being changed: home, categories, product details, cart, header, or shared component.
2. Whether the change touches data flow, styling only, or both.
3. Whether the public API shape can vary in a way that affects the UI.
4. Whether the request implies an accessibility expectation: keyboard, labels, focus states, visible text, or motion.

## Repo-Specific Implementation Rules

### 1. Respect the current data flow

- UI components should use `trpc` hooks for product/category data.
- Product and category fetch logic belongs in `src/api/routers/products.router.ts` unless the task is strictly presentational.
- Treat `src/api/platziApi.ts` as legacy unless the user explicitly asks to revive or repair it.

### 2. Respect the current cart model

- Cart state lives in `src/store/cartStore.ts`.
- Cart items use `title`, not `name`.
- Adding an existing product should increment quantity rather than duplicate the item.
- Be careful with persisted cart migrations when changing cart shape.

### 3. Public API data is unstable

Because EscuelaJS is public, categories and image values may change unexpectedly.

- expect category counts and names to grow or shift
- do not hardcode assumptions about catalog size
- guard against empty or malformed `images`
- preserve or extend fallback logic for invalid images
- prefer resilient UIs over fixed content assumptions

### 4. Follow the existing design system

Use variables from `src/styles/variables.scss`:

- accent greens for primary actions
- dark surfaces and light text
- `Limelight` as display font and `Inter` as body font
- spacing, breakpoints, radii, and transitions from shared variables

Do not replace established button classes, card patterns, or layout primitives unless the task requires it.

### 5. Accessibility is not optional

For storefront UI changes:

- prefer visible text labels over icon-only controls
- add `aria-label`, `aria-pressed`, `aria-expanded`, and `aria-controls` when interaction semantics need them
- preserve focus-visible styles or improve them
- keep touch targets usable on mobile
- avoid motion that feels abrupt or conflicts with load animations
- consider public API growth when building filter panels and lists

## Storefront Workflow

1. Inspect the current component, its styles, and any related store or API files.
2. Identify whether the problem is UI-only, data-only, or a contract mismatch between them.
3. Patch the smallest number of files needed.
4. Reuse the existing utilities and visual language.
5. Validate edited files with errors/tooling checks.
6. Mention any unrelated repo issues separately instead of folding them into the fix.

## Page-Specific Guidance

### Categories / PLP

- Keep search and sort easy to reach.
- Assume category counts can grow over time.
- Prefer capped lists, progressive disclosure, sticky layouts, and keyboard-friendly controls.
- Product cards should remain scannable and fast to act on.

### Product Details / PDP

- Keep image transitions smooth and not in conflict with load animations.
- Preserve add-to-cart clarity and visible feedback.
- Keep the main CTA prominent.

### Cart

- Quantity updates and removal must work without reloads.
- Totals should be derived safely even if price data is inconsistent.
- Persistent state behavior matters more than decorative changes.

### Header / Navigation

- Keep the logo stable as a brand anchor.
- Prefer text + icon combinations for key navigation actions.
- Preserve mobile usability when adjusting layout.

## Validation Checklist

Before finishing a storefront task, verify:

- the edited component still matches the current store and data contracts
- interactive controls are keyboard reachable
- focus styles are still visible
- hover/motion changes are smooth and not jarring
- empty, loading, and error states still make sense
- no new editor errors were introduced in touched files

## References

- [Project Context](./references/project-context.md)
