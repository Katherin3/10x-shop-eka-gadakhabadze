import { discountedPrice, formatPrice, hasVisibleDiscount } from '../../utils/format';

interface PriceTagProps {
  price: number;
  discountPercentage: number;
  size?: 'md' | 'lg';
}

/** Discounted price large + original price struck through (P2.3). */
export default function PriceTag({ price, discountPercentage, size = 'md' }: PriceTagProps) {
  const finalPrice = discountedPrice(price, discountPercentage);
  const showDiscount = hasVisibleDiscount(discountPercentage);

  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-bold text-slate-900 tabular-nums ${size === 'lg' ? 'text-3xl' : 'text-xl'}`}>
        {formatPrice(finalPrice)}
      </span>
      {showDiscount && (
        <>
          <span className="sr-only">Original price:</span>
          <s className={`text-slate-400 tabular-nums ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>{formatPrice(price)}</s>
        </>
      )}
    </p>
  );
}
