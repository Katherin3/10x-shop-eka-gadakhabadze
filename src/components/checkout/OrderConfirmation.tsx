import { Link } from 'react-router';
import type { OrderSummary } from '../../types/order';
import { getLineTotal } from '../../utils/cart';
import { formatPrice } from '../../utils/format';

interface OrderConfirmationProps {
  order: OrderSummary;
}

/** P5.3 — "Thank you" screen built from the local order summary. */
export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <section className="mx-auto flex max-w-xl flex-col gap-6 rounded-2xl border border-emerald-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-2" role="status">
        <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          ✓
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Thank you! Your order has been placed.</h1>
        <p className="text-slate-600">
          We’ll ship {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} to {order.shipping.fullName},{' '}
          {order.shipping.address}, {order.shipping.city}. A confirmation goes to {order.shipping.email}.
        </p>
      </div>

      <ul className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-200">
        {order.items.map((item) => (
          <li key={item.productId} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
            <span>
              {item.title} <span className="text-slate-500">× {item.quantity}</span>
            </span>
            <span className="font-semibold tabular-nums">{formatPrice(getLineTotal(item))}</span>
          </li>
        ))}
      </ul>

      <p className="flex justify-between text-lg font-bold">
        <span>Order total</span>
        <span className="tabular-nums">{formatPrice(order.total)}</span>
      </p>

      <Link
        to="/"
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-700 px-4 font-semibold text-white transition-colors hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Continue shopping
      </Link>
    </section>
  );
}
