# PLAN — 10X Shop

## Goal and scope

Deliver every CORE requirement of the PRD with a working deploy, then add FULL features only if time remains.

| Module | CORE (this plan) | FULL (later, optional) |
| --- | --- | --- |
| React | Router, Layout, Context (Auth, Cart), controlled Login and Checkout, map/key, conditional rendering | Search/filter/sort/pagination, Orders, Profile, Formik + Yup |
| TypeScript | strict mode, typed props/state/API, typecheck = 0 | Generics, ApiClient, OOP classes |
| Tailwind | v4 integration, utilities, flex/grid, responsive, hover/focus/disabled | `@theme`, dark mode |
| Optimization | Responsive at 375px, Error Boundary, DEBUG-LOG (3 bugs) | Lazy routes, Lighthouse before/after |
| Process | README, PLAN, REPORT, deploy, real Git history | Issues/Projects, PRs, progress notes |

## Work breakdown

| Week | Task | Estimate (h) |
| --- | --- | --- |
| 1 | Vite + React + TS + Tailwind setup, strict tsconfig, scripts, ESLint | 2 |
| 1 | Types: Product, ProductsResponse, CartItem, Login, Checkout | 1 |
| 1 | Layout, Header, Footer, router, 404, ScrollToTop | 3 |
| 1 | AuthContext + Login form + ProtectedRoute for /checkout | 3 |
| 1 | Catalog: fetch, loading/error/empty, ProductCard, ProductGrid | 4 |
| 2 | Product details: useParams, fetch by id, gallery, stepper | 4 |
| 2 | CartContext with immutable updates + localStorage | 3 |
| 2 | Cart page: rows, quantity, remove, clear, total | 3 |
| 2 | Checkout form, validation, confirmation, clear cart | 3 |
| 3 | Responsive pass at 375px / tablet / desktop, focus states | 3 |
| 3 | Error Boundary, DEBUG-LOG entries | 2 |
| 3 | Deploy to Vercel/Netlify, test refresh on /products/5 | 1 |
| 3 | README, REPORT, final QA, submit before 06 Nov 23:59 | 3 |

## Risks

| Risk | Mitigation |
| --- | --- |
| DummyJSON is down during development or the defense | Clear error state in the UI; keep a screenshot/video of the working flow |
| SPA routes 404 after refresh on the host | `vercel.json` / `_redirects` rewrite, tested right after the first deploy |
| Running out of time for FULL features | CORE checklist first; FULL only after CORE is deployed |
| Not being able to explain AI-written code | Read and comment every file; keep notes in an AI log |

## Definition of Done (per task)

- Works in the browser, including the error/empty case.
- `npm run typecheck`, `npm run lint` and `npm run build` pass.
- Looks correct at 375px and on desktop.
- Committed with a meaningful message.
