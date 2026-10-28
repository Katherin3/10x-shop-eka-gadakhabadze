import type { ReactNode } from 'react';
import { formatPrice } from '../../utils/format';

interface CartSummaryProps {
  itemCount: number;
  total: number;
  /** props.children composition: the page decides which action goes at the bottom. */
  children?: ReactNode;
}

export default function CartSummary({ itemCount, total, children }: CartSummaryProps) {
  return (
    <aside className="flex h-fit flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
      <h2 className="text-xl font-bold">Order summary</h2>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-600">Items</dt>
          <dd className="tabular-nums">{itemCount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-600">Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(total)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>
      {children}
    </aside>
  );
}
