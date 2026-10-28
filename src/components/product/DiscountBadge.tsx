import { hasVisibleDiscount } from '../../utils/format';

interface DiscountBadgeProps {
  discountPercentage: number;
}

/** Green "−9%" badge, only for discounts of 1% or more. */
export default function DiscountBadge({ discountPercentage }: DiscountBadgeProps) {
  if (!hasVisibleDiscount(discountPercentage)) return null;
  return (
    <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white tabular-nums">
      −{Math.round(discountPercentage)}%
    </span>
  );
}
