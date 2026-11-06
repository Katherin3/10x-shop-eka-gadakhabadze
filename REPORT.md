# REPORT — 10X Shop

Final report for the 10X Front-end graduation project.
Live: https://10x-shop-eka-gadakhabadze.vercel.app · Repository: https://github.com/Katherin3/10x-shop-eka-gadakhabadze

## Planned vs delivered

The plan (see `PLAN.md`) was to deliver every CORE requirement first and add FULL features only if time remained. All CORE functionality was delivered. Most FULL features were not implemented; on the last day I added a custom Tailwind theme and two small extras (listed below).

### CORE

| Requirement | Status |
| --- | --- |
| Vite + React 19 + TypeScript (strict) + Tailwind CSS v4 | ✅ |
| `npm run typecheck` / `lint` / `build` with 0 errors | ✅ |
| Layout + React Router: `/`, `/login`, `/products/:id`, `/cart`, `/checkout`, `*` (404) | ✅ |
| AuthContext + controlled Login form with validation | ✅ |
| Guest redirect `/checkout` → `/login` → back to `/checkout` | ✅ |
| Catalog: `GET /products`, loading / error / empty states | ✅ |
| ProductCard + ProductGrid with `map` and stable `key`, responsive grid | ✅ |
| Product details: gallery, price, stock states, quantity stepper, Add to cart, 404 on bad id | ✅ |
| CartContext with immutable updates, Header badge, `shop_cart` persistence | ✅ |
| Cart page: quantity, remove, clear, total, empty state | ✅ |
| Checkout: 4 controlled fields, validation, "Thank you" confirmation, cart cleared | ✅ |
| Error Boundary | ✅ |
| Responsive at 375px, no horizontal scroll | ✅ |
| `DEBUG-LOG.md` with 4 real bugs and fix commits | ✅ |
| Deploy on Vercel with SPA rewrites, link in README | ✅ |
| `README.md`, `PLAN.md`, `REPORT.md` | ✅ |

### Extras beyond CORE

| Addition | Status | Note |
| --- | --- | --- |
| Custom Tailwind theme with `@theme` design tokens (TW5, FULL) | ✅ | Colors and fonts defined once in `src/index.css` (`--color-berry`, `--color-powder`, `--font-display`, …) and used as utilities (`bg-berry`, `text-ink`, `font-display`). A cosmetics-inspired look: powder-pink background, berry buttons, Bodoni Moda headings |
| "Today’s best deal" banner on the catalog | ✅ | `getBestDeal()` in `src/utils/deals.ts` picks the in-stock product with the biggest discount (`filter` + `reduce`); shown by `FeaturedProduct.tsx`. Derived from the loaded products, no extra state |
| Stricter login password rule | ✅ | My addition beyond P1.2: at least 6 characters plus an uppercase letter, a number and a symbol. The PRD's own error texts ("Password is required", "Password must be at least 6 characters") are kept unchanged |
| Removed the unused Netlify `_redirects` file | ✅ | The app is deployed on Vercel; SPA rewrites live in `vercel.json` |

### FULL — not done, and why

Search, categories, sorting, pagination, URL state, Orders, Profile, Reviews, Promo code, dark/light theme switch, Formik + Yup, lazy routes and Lighthouse before/after comparison were not implemented. The PRD rules say to finish CORE first and add FULL only afterwards; I started late and used the remaining time to finish CORE, fix the bugs found in review, and prepare to explain the code.

## Metrics

| Metric | Value |
| --- | --- |
| Commits | 29 (including the initial GitHub commit) |
| Days with commits | 4 (27.10, 28.10, 05.11, 06.11) |
| Production bundle (JS, gzip) | 91.37 kB |
| Production bundle (CSS, gzip) | 5.42 kB |
| TypeScript errors (`tsc --noEmit`) | 0 |
| ESLint errors / warnings | 0 / 0 |
| Bugs documented in DEBUG-LOG | 4 |
| Lighthouse (Mobile, live site): Performance | 79 |
| Lighthouse: Accessibility | 96 |
| Lighthouse: Best Practices | 100 |
| Lighthouse: SEO | 92 |
| Lighthouse: CLS | 0.209 |

## The 3 hardest problems

Full details, reproduction steps and diffs are in `DEBUG-LOG.md`, which also covers a fourth bug: horizontal scroll on the Cart page at 375px.

1. **"Back to catalog" depended on browser history.** It used `navigate(-1)`, so in a new tab it did nothing and from the Cart it went back to the Cart. Fixed by linking to `/` with `<Link>`. Lesson: a button that names a destination should link to it.
2. **The "Added to cart ✓" timer did not restart.** Setting `feedback` to the same string `'added'` did not change state, so the `useEffect` with `[feedback]` did not re-run and the old timer hid the message too early. Fixed by storing an object with a unique `id`, so every click is a real change.
3. **The cart could exceed the product's stock.** `addItem` checked stock against `items` from the last render but updated from `prev`, so two calls before a re-render both passed the check. Fixed by re-checking stock inside the `setItems(prev => …)` updater.

## What I would do differently

- Start in week 1 and commit small pieces every day, so the Git history shows the real three-week process. My history covers only four days.
- Commit `PLAN.md` in the first week, before any code.
- Test edge cases (new tab, direct links, repeated clicks) while building each feature, not only at the end.
- After CORE, add the FULL features with the best value first: search with debounce, pagination, and a Retry button.

## AI usage summary

- I used Claude (Anthropic) throughout the project, which the PRD allows.
- Claude generated the base code from the PRD's CORE requirements. I added it to the repository in stages, ran each stage locally, and checked typecheck, lint and build before every commit.
- I used Claude to explain my own code file by file and to prepare for the theory test and the defense.
- Claude helped me find and fix three bugs. I reproduced each bug myself before fixing it and documented them in `DEBUG-LOG.md`. I found the fourth bug (Cart page overflow at 375px) myself while testing on a phone-sized screen.
- I did not use AI to fake the Git history: commit dates are real, which is why the history covers only four days.
- On the last day I used Claude to restyle the UI (cosmetics theme with `@theme`, best-deal banner) and to add the stricter password rule.Tested each change in the browser at 375px and on desktop, and checked typecheck, lint and build before committing.
- Main lesson: AI can produce working code quickly, but I am responsible for understanding it, so I studied every file before submitting.
