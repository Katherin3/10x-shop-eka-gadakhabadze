# DEBUG-LOG — 10X Shop

Three real bugs found while testing the deployed app and reviewing the code before submission. Each one was reproduced, traced to its root cause, and fixed in its own commit.

| # | Bug | Area | Fix commit |
| --- | --- | --- | --- |
| 1 | "← Back to catalog" does not go to the catalog | Routing | [`be274f5`](https://github.com/Katherin3/10x-shop-eka-gadakhabadze/commit/be274f50b8cd57605dad143bfb792df1fa03e0fe) |
| 2 | "Added to cart ✓" disappears too early on a second click | useEffect / timers | [`4293122`](https://github.com/Katherin3/10x-shop-eka-gadakhabadze/commit/4293122b31df2cf31ffb1601ce504b26f0525584) |
| 3 | Cart can hold more items than the product's stock | State updates | [`2149a37`](https://github.com/Katherin3/10x-shop-eka-gadakhabadze/commit/2149a37a9455ee8008a9e5f60d1bd7a97539d824) |

---

## Bug 1 — "← Back to catalog" does not go to the catalog

**Symptom**
On the product page, the "← Back to catalog" button did not always open the catalog. When the product was opened in a new tab or from a direct link, clicking it left the site. When I came to the product from the Cart page, it sent me back to the Cart instead of the catalog.

**Reproduction**
1. Open `https://10x-shop-eka-gadakhabadze.vercel.app/products/5` in a new browser tab.
2. Click "← Back to catalog".
3. Expected: the catalog (`/`). Actual: left the site, because the tab has no previous page.
4. Second case: go to Cart → click a product title → click "← Back to catalog" → you land on `/cart`, not `/`.

**Tool**
Code review of `src/pages/ProductPage.tsx`, plus the browser's Back history: in a fresh tab the Back arrow is greyed out, which showed there was no history entry to go back to. After the fix, `npm run typecheck` reported the now-unused `navigate` variable (`noUnusedLocals`), which I removed.

**Root cause**
The button called `navigate(-1)`, which means "go one step back in browser history", not "go to the catalog". The result depends on where the user came from: an empty history (new tab) has nowhere to go, and coming from the Cart goes back to the Cart. The label promised a fixed destination, but the code used a relative one.

**Fix** — [`be274f5`](https://github.com/Katherin3/10x-shop-eka-gadakhabadze/commit/be274f50b8cd57605dad143bfb792df1fa03e0fe)
Replaced the `<button onClick={() => navigate(-1)}>` with `<Link to="/">`, removed the `useNavigate` import and the unused `navigate` constant. Added `inline-flex items-center` so the link keeps the 44px tap height the button had.

```diff
-import { useNavigate, useParams } from 'react-router';
+import { Link, useParams } from 'react-router';
 ...
-  const navigate = useNavigate();
 ...
-        <button type="button" onClick={() => navigate(-1)} className="min-h-11 ...">
+        <Link to="/" className="inline-flex min-h-11 items-center ...">
           ← Back to catalog
-        </button>
+        </Link>
```

**What I learned**
- `navigate(-1)` depends on history, so it is only right for a real "Back" action. A button whose text names a destination should link to that destination.
- A real `<Link>` is also better for accessibility: it is announced as a link, can be opened in a new tab, and shows the target URL on hover.
- Strict TypeScript (`noUnusedLocals`) caught the leftover `navigate` variable right after the change.

---

## Bug 2 — "Added to cart ✓" disappears too early on a second click

**Symptom**
On a product card, the "Added to cart ✓" message should stay visible for 2 seconds after each click. When I clicked "Add to cart" a second time shortly after the first, the message disappeared almost immediately after the second click.

**Reproduction**
1. Open the catalog.
2. Click "Add to cart" on any product. The message appears.
3. Wait about 1.5 seconds and click "Add to cart" on the same card again.
4. Expected: the message stays for 2 more seconds. Actual: it vanishes about 0.5 seconds after the second click.

**Tool**
React DevTools → Components → `ProductCard`. Watching the `feedback` state while clicking showed that it stayed `"added"` after both clicks. The value never changed, so the effect that hides the message had no reason to run again.

**Root cause**
The timer lives in a `useEffect` with `[feedback]` as its dependency:

```ts
useEffect(() => {
  if (feedback === null) return;
  const timerId = window.setTimeout(() => setFeedback(null), 2000);
  return () => window.clearTimeout(timerId);
}, [feedback]);
```

The second click called `setFeedback('added')` while the state was already `'added'`. React compares the old and new values with `Object.is`; since the string is the same, it skips the update, the effect does not re-run, and no new timer starts. The first timer kept running and hid the message 2 seconds after the *first* click.

**Fix** — [`4293122`](https://github.com/Katherin3/10x-shop-eka-gadakhabadze/commit/4293122b31df2cf31ffb1601ce504b26f0525584)
`feedback` is now an object with a unique `id` (a timestamp). Every click creates a new object with a new reference, so React sees a change, the effect re-runs, its cleanup clears the old timer and a fresh 2-second timer starts.

```diff
-type Feedback = 'added' | 'limit' | null;
+type Feedback = { kind: 'added' | 'limit'; id: number } | null;
 ...
-    setFeedback(onAdd(product) ? 'added' : 'limit');
+    setFeedback({ kind: onAdd(product) ? 'added' : 'limit', id: Date.now() });
 ...
-            {feedback === 'added' && <span ...>Added to cart ✓</span>}
-            {feedback === 'limit' && <span ...>No more in stock</span>}
+            {feedback?.kind === 'added' && <span ...>Added to cart ✓</span>}
+            {feedback?.kind === 'limit' && <span ...>No more in stock</span>}
```

**What I learned**
- Setting state to the same primitive value does not trigger a re-render, and an effect only re-runs when a dependency actually changes.
- When an action can repeat with the same result, the state needs something that changes each time (an id or timestamp) if an effect has to react to every occurrence.
- The effect's cleanup (`clearTimeout`) matters here: it is what cancels the old timer when the new one starts.

---

## Bug 3 — Cart can hold more items than the product's stock

**Symptom**
It was possible to end up with more units of a product in the cart than the product's `stock`, even though `addItem` is supposed to refuse that. The cart's `+` button was then already disabled and the Header badge showed the inflated count.

**Reproduction**
Normal clicking does not trigger it, because React re-renders between two separate click events. To reproduce it reliably:
1. In `ProductPage.tsx`, temporarily call `addItem(product, quantity)` twice in a row inside `handleAddToCart`.
2. Open a product with low stock (for example stock 5) and set the quantity to 3.
3. Click "Add to cart" once.
4. Expected: 3 in the cart (the second call refused, 3 + 3 > 5). Actual: 6 in the cart, more than the stock of 5.
5. Remove the temporary second call.

**Tool**
A breakpoint in Chrome DevTools → Sources inside `addItem` in `src/context/CartContext.tsx`. On both calls, `getQuantityInCart(product.id)` returned 0, because `items` was the same array both times.

**Root cause**
The stock check and the update read from two different versions of the state:

```ts
const alreadyInCart = getQuantityInCart(product.id);   // reads `items` from this render
if (quantity < 1 || alreadyInCart + quantity > product.stock) return false;

setItems((prev) => /* updates using `prev`, the newest state */);
```

`items` is the value captured when the component last rendered. Two calls before the next render both see the same old `items`, so both pass the check. The updates themselves use `prev`, which does include the first call's change, so the second update stacks on top of it and exceeds the stock.

**Fix** — [`2149a37`](https://github.com/Katherin3/10x-shop-eka-gadakhabadze/commit/2149a37a9455ee8008a9e5f60d1bd7a97539d824)
The stock is now re-checked inside the `setItems` callback, against `prev`, the newest state. If adding would exceed the stock, the callback returns `prev` unchanged.

```diff
-    setItems((prev) =>
-      prev.some((item) => item.productId === product.id)
+    setItems((prev) => {
+      // Re-check against the newest state, not the items captured in this render
+      const current = prev.find((item) => item.productId === product.id);
+      const currentQty = current ? current.quantity : 0;
+      if (currentQty + quantity > product.stock) return prev;
+
+      return current
         ? prev.map((item) =>
             item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
           )
-        : [...prev, toCartItem(product, quantity)],
-    );
+        : [...prev, toCartItem(product, quantity)];
+    });
```

The first check (outside `setItems`) stays, because it gives the page an immediate `false` for the normal case to show the "only N more can be added" message.

**What I learned**
- State read in a handler is a snapshot from the last render. A functional update (`setState(prev => …)`) always receives the latest state, so any rule that depends on the current state belongs inside it.
- Returning `prev` unchanged from the updater is a clean way to say "no change".
- Known limitation: in the double-call case the second `addItem` still returns `true`, because its return value is decided before the updater runs. The cart state can no longer go over the stock, which was the real bug; making the return value exact would need a ref holding the latest items or a `useReducer`.
