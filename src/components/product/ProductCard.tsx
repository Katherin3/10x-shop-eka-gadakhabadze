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

type Feedback = { kind: 'added' | 'limit'; id: number } | null;

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
    setFeedback({ kind: onAdd(product) ? 'added' : 'limit', id: Date.now() });
  }

  return (
    <article
      onClick={() => navigate(productPath)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-line"
    >
      <div className="relative bg-blush">
        {/* The "compact": a powder disc behind the product, like an open powder case */}
        <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-powder ring-1 ring-line" />
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          width={300}
          height={300}
          className="relative aspect-square w-full object-contain p-8"
        />
        <div className="absolute left-3 top-3">
          <DiscountBadge discountPercentage={product.discountPercentage} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-sm text-muted capitalize">
          {product.category}
          {product.brand ? `, ${product.brand}` : ''}
        </p>
        <h3 className="text-lg leading-snug font-semibold">
          {/* A real link keeps the card reachable with the keyboard (Tab + Enter). */}
          <Link
            to={productPath}
            onClick={(event) => event.stopPropagation()}
            className="rounded-sm text-ink group-hover:text-berry-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berry"
          >
            {product.title}
          </Link>
        </h3>

        <PriceTag price={product.price} discountPercentage={product.discountPercentage} />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ink-soft" aria-label={`Rating ${product.rating.toFixed(1)} out of 5`}>
            <span className="text-amber-500">★</span> {product.rating.toFixed(1)}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <Button fullWidth onClick={handleAdd} disabled={isOutOfStock}>
            {isOutOfStock ? 'Out of stock' : 'Add to cart'}
          </Button>
          <p role="status" className="min-h-5 text-center text-sm">
            {feedback?.kind === 'added' && <span className="text-sage">Added to cart ✓</span>}
            {feedback?.kind === 'limit' && <span className="text-red-700">No more in stock</span>}
          </p>
        </div>
      </div>
    </article>
  );
}
