import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { fetchProductById } from '../api/products.api';
import DiscountBadge from '../components/product/DiscountBadge';
import PriceTag from '../components/product/PriceTag';
import StockBadge from '../components/product/StockBadge';
import Button from '../components/ui/Button';
import QuantityStepper from '../components/ui/QuantityStepper';
import StatusMessage from '../components/ui/StatusMessage';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/product';
import NotFoundPage from './NotFoundPage';

/** Each status carries exactly the data it needs (a discriminated union). */
type ProductLoadState =
  | { status: 'loading' }
  | { status: 'success'; product: Product }
  | { status: 'not-found' }
  | { status: 'error' };

type AddFeedback = { kind: 'success' | 'error'; text: string } | null;

/** P3 — /products/:id */
export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, getQuantityInCart } = useCart();

  const productId = Number(id);
  const isValidId = Number.isInteger(productId) && productId > 0;

  const [loadState, setLoadState] = useState<ProductLoadState>({ status: 'loading' });
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<AddFeedback>(null);

  useEffect(() => {
    if (!isValidId) return; // /products/abc -> NotFound without a request

    let ignore = false;
    setLoadState({ status: 'loading' });

    async function load(): Promise<void> {
      try {
        const product = await fetchProductById(productId);
        if (ignore) return;
        if (product === null) {
          setLoadState({ status: 'not-found' });
          return;
        }
        // A new product starts with the first photo, quantity 1, no message.
        setSelectedImage(0);
        setQuantity(1);
        setFeedback(null);
        setLoadState({ status: 'success', product });
      } catch {
        if (!ignore) setLoadState({ status: 'error' });
      }
    }

    load();
    return () => {
      ignore = true;
    };
    // productId MUST be a dependency: when the URL id changes the page has
    // to fetch again, otherwise the old product would stay on screen.
  }, [productId, isValidId]);

  if (!isValidId || loadState.status === 'not-found') {
    return <NotFoundPage />;
  }

  if (loadState.status === 'loading') {
    return <StatusMessage variant="loading">Loading product…</StatusMessage>;
  }

  if (loadState.status === 'error') {
    return (
      <StatusMessage variant="error">
        <p className="font-semibold">This product couldn’t be loaded.</p>
        <p>Check your internet connection, then refresh the page.</p>
      </StatusMessage>
    );
  }

  const { product } = loadState;
  const isOutOfStock = product.stock === 0;
  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const mainImage = images[selectedImage] ?? product.thumbnail;

  function handleAddToCart(): void {
    const inCart = getQuantityInCart(product.id);
    if (addItem(product, quantity)) {
      setFeedback({ kind: 'success', text: `Added ${quantity} to cart ✓` });
    } else {
      const left = product.stock - inCart;
      setFeedback({
        kind: 'error',
        text:
          left > 0
            ? `You already have ${inCart} in your cart. Only ${left} more can be added.`
            : `All ${product.stock} available items are already in your cart.`,
      });
    }
  }

  return (
    <article className="flex flex-col gap-6">
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="min-h-11 rounded-lg px-1 text-sm font-medium text-indigo-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          ← Back to catalog
        </button>
      </div>

      {/* Two columns on desktop, one on mobile (P3.1) */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="relative rounded-2xl border border-slate-200 bg-white">
            <img
              src={mainImage}
              alt={product.title}
              width={600}
              height={600}
              className="aspect-square w-full object-contain p-6"
            />
            <div className="absolute left-4 top-4">
              <DiscountBadge discountPercentage={product.discountPercentage} />
            </div>
          </div>

          {images.length > 1 && (
            <ul className="flex flex-wrap gap-2" aria-label="Product photos">
              {images.map((image, index) => (
                <li key={image}>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Show photo ${index + 1}`}
                    aria-pressed={index === selectedImage}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                      index === selectedImage ? 'border-indigo-700' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={image} alt="" loading="lazy" width={64} height={64} className="h-full w-full object-contain p-1" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-slate-500 capitalize">
              {product.brand ? `${product.brand}, ` : ''}
              {product.category}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{product.title}</h1>
          </div>

          <PriceTag price={product.price} discountPercentage={product.discountPercentage} size="lg" />

          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium text-slate-700">
              <span className="text-amber-500">★</span> {product.rating.toFixed(1)}
            </span>
            <StockBadge stock={product.stock} />
          </div>

          <p className="max-w-prose leading-relaxed text-slate-700">{product.description}</p>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center">
            <QuantityStepper
              label="Quantity"
              value={quantity}
              min={1}
              max={Math.max(1, product.stock)}
              onChange={setQuantity}
              disabled={isOutOfStock}
            />
            <Button onClick={handleAddToCart} disabled={isOutOfStock} className="sm:min-w-48">
              {isOutOfStock ? 'Out of stock' : 'Add to cart'}
            </Button>
          </div>

          {feedback && (
            <p role="status" className={`text-sm font-medium ${feedback.kind === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
              {feedback.text}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
