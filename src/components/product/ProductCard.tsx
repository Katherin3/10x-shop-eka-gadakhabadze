import { useEffect, useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Product } from '../../types/product';
import Button from '../ui/Button';
import DiscountBadge from './DiscountBadge';
import PriceTag from './PriceTag';
import StockBadge from './StockBadge';

interface ProductCardProps {
  product: Product;
  /** Callback prop: the parent decides how to add. Returns false if stock is exceeded. */
  onAdd: (product: Product) => boolean;
}

type Feedback = 'added' | 'limit' | null;

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback>(null);
  const isOutOfStock = product.stock === 0;
  const productPath = `/products/${product.id}`;

  // Hide the inline message after 2 s. Cleanup clears the timer if the
  // card unmounts first (no state update on an unmounted component).
  useEffect(() => {
    if (feedback === null) return;
    const timerId = window.setTimeout(() => setFeedback(null), 2000);
    return () => window.clearTimeout(timerId);
  }, [feedback]);

  function handleAdd(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation(); // the button must not open the details page
    setFeedback(onAdd(product) ? 'added' : 'limit');
  }

  return (
    <article
      onClick={() => navigate(productPath)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg hover:shadow-slate-200"
    >
      <div className="relative bg-slate-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          width={300}
          height={300}
          className="aspect-square w-full object-contain p-6"
        />
        <div className="absolute left-3 top-3">
          <DiscountBadge discountPercentage={product.discountPercentage} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-sm text-slate-500 capitalize">
          {product.category}
          {product.brand ? `, ${product.brand}` : ''}
        </p>
        <h3 className="text-lg leading-snug font-semibold">
          {/* A real link keeps the card reachable with the keyboard (Tab + Enter). */}
          <Link
            to={productPath}
            onClick={(event) => event.stopPropagation()}
            className="rounded-sm text-slate-900 group-hover:text-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {product.title}
          </Link>
        </h3>

        <PriceTag price={product.price} discountPercentage={product.discountPercentage} />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700" aria-label={`Rating ${product.rating.toFixed(1)} out of 5`}>
            <span className="text-amber-500">★</span> {product.rating.toFixed(1)}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <Button fullWidth onClick={handleAdd} disabled={isOutOfStock}>
            {isOutOfStock ? 'Out of stock' : 'Add to cart'}
          </Button>
          <p role="status" className="min-h-5 text-center text-sm">
            {feedback === 'added' && <span className="text-emerald-700">Added to cart ✓</span>}
            {feedback === 'limit' && <span className="text-red-700">No more in stock</span>}
          </p>
        </div>
      </div>
    </article>
  );
}
