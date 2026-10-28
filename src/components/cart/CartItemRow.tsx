import { Link } from 'react-router';
import type { CartItem } from '../../types/cart';
import { getLineTotal, getUnitPrice } from '../../utils/cart';
import { formatPrice } from '../../utils/format';
import Button from '../ui/Button';
import QuantityStepper from '../ui/QuantityStepper';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <li className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-4">
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          width={80}
          height={80}
          className="h-20 w-20 shrink-0 rounded-lg bg-slate-100 object-contain p-1"
        />
        <div className="min-w-0">
          <Link
            to={`/products/${item.productId}`}
            className="rounded-sm font-semibold text-slate-900 hover:text-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {item.title}
          </Link>
          <p className="text-sm text-slate-500 tabular-nums">{formatPrice(getUnitPrice(item))} each</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <QuantityStepper
          label={`Quantity of ${item.title}`}
          value={item.quantity}
          min={1}
          max={item.stock}
          onChange={(quantity) => onQuantityChange(item.productId, quantity)}
        />
        <p className="w-24 text-right font-bold tabular-nums">{formatPrice(getLineTotal(item))}</p>
        <Button variant="ghost-danger" onClick={() => onRemove(item.productId)} aria-label={`Remove ${item.title}`}>
          Remove
        </Button>
      </div>
    </li>
  );
}
