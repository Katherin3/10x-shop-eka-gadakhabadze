import { Link, useLocation, useNavigate } from 'react-router';
import CartItemRow from '../components/cart/CartItemRow';
import CartSummary from '../components/cart/CartSummary';
import PageHeading from '../components/layout/PageHeading';
import Button from '../components/ui/Button';
import StatusMessage from '../components/ui/StatusMessage';
import { useCart } from '../context/CartContext';

/** location.state is `unknown` — narrow it before reading `message`. */
function getRedirectMessage(state: unknown): string | null {
  if (typeof state === 'object' && state !== null && 'message' in state && typeof state.message === 'string') {
    return state.message;
  }
  return null;
}

/** P4 — cart page. */
export default function CartPage() {
  const { items, itemCount, total, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = getRedirectMessage(location.state);

  function handleClear(): void {
    if (window.confirm('Clear the cart? This cannot be undone.')) {
      clearCart();
    }
  }

  if (items.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <PageHeading title="Cart" />
        {redirectMessage && <StatusMessage variant="info">{redirectMessage}</StatusMessage>}
        <StatusMessage variant="empty">
          <p className="text-lg font-semibold text-slate-800">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-lg bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Browse products
          </Link>
        </StatusMessage>
      </section>
    );
  }

  return (
    <section>
      <PageHeading title="Cart">
        <p>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </PageHeading>

      {/* List on the left, summary on the right; stacked on mobile (P4.1) */}
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <CartItemRow key={item.productId} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
            ))}
          </ul>
          <div>
            <Button variant="secondary" onClick={handleClear}>
              Clear cart
            </Button>
          </div>
        </div>

        <CartSummary itemCount={itemCount} total={total}>
          {/* The guest check lives in ProtectedRoute — no second check here. */}
          <Button fullWidth onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </Button>
        </CartSummary>
      </div>
    </section>
  );
}
