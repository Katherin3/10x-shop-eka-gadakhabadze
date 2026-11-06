# 10x-shop-eka-gadakhabadze

## About

An online store SPA built with React, TypeScript and Tailwind CSS v4 as the final project of the 10X Front-end course. Products come from the DummyJSON API; login and checkout are local simulations (no real authentication or payment).

## Features (CORE)

- **Catalog** — the first 12 products from `GET /products`, rendered as reusable `ProductCard` components in a responsive grid, with loading, error and empty states.
- **Product details** — `/products/:id` with photo gallery, discounted price, rating, stock status (In stock / Only N left! / Out of stock), a quantity stepper limited to stock, and Add to cart. Invalid or unknown ids show the 404 page.
- **Cart** — shared `CartContext` with immutable updates: add, change quantity, remove, clear, and a live total. The Header badge shows the item count. The cart is saved in `localStorage` (`shop_cart`) and survives reloads and logout.
- **Login (simulated)** — controlled form with required-field validation. Login state lives in `AuthContext`; any username plus a password of 6+ characters works.
- **Checkout** — guests are redirected to `/login` and returned to `/checkout` afterwards. Controlled form (full name, email, address, city) with inline errors; placing an order shows a "Thank you" summary and empties the cart.
- **Quality** — strict TypeScript with no `any`, an Error Boundary, scroll-to-top on navigation, a 404 route, and a responsive layout down to 375px.

## Tech Stack

- React 19 + React Router 7
- TypeScript (strict)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Vite
- DummyJSON products API
- ESLint with `typescript-eslint` and `eslint-plugin-react-hooks`

## Architecture

```
src/
  api/          products.api.ts — fetchProducts, fetchProductById
  types/        product.ts, user.ts, cart.ts, order.ts
  context/      AuthContext.tsx, CartContext.tsx
  components/
    layout/     Layout, Header, Footer, ScrollToTop, PageHeading
    ui/         Button, FormField, StatusMessage, QuantityStepper
    product/    ProductCard, ProductGrid, PriceTag, DiscountBadge, StockBadge
    cart/       CartItemRow, CartSummary
    checkout/   OrderConfirmation
    ErrorBoundary.tsx
  pages/        CatalogPage, ProductPage, CartPage, LoginPage, CheckoutPage, NotFoundPage
  routes/       AppRoutes.tsx, ProtectedRoute.tsx
  utils/        format.ts, validation.ts, cart.ts, stock.ts, storage.ts
```

Data flow: a user action calls an event handler, which updates state through `useState` or a Context function. The new immutable state makes React re-render the affected components. API requests run inside `useEffect`, and the loading, error and empty states are shown with conditional rendering. Cart changes are persisted to `localStorage` by an effect in `CartProvider`.

## How to Run

```bash
git clone https://github.com/Katherin3/10x-shop-eka-gadakhabadze
cd 10x-shop-eka-gadakhabadze
npm install
npm run dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck, then build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` — must report 0 errors |
| `npm run lint` | ESLint (`no-explicit-any` is an error) |

## Live Demo

https://10x-shop-eka-gadakhabadze.vercel.app/

SPA rewrites are configured in `vercel.json`, so refreshing `/products/5` works.

## Test Account

Login is simulated. Use any username. The password needs at least 6 characters, one uppercase letter, one number and one symbol, for example:

- **Username:** `ekaterine`
- **Password:** `Password1!`

## Limitations

- Login state is kept in memory only, so a page refresh logs you out (allowed by the PRD).
- Orders are not stored; there is no Orders or Profile page (FULL scope).
- The catalog shows the first 12 products; search, categories, sorting and pagination are FULL scope.

## Credits

- Product data: [DummyJSON](https://dummyjson.com)
