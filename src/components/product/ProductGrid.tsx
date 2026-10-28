import type { Product } from '../../types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => boolean;
}

/**
 * TW3 — mobile-first grid: 1 column on phones, 2 from 640px, 3 from 768px,
 * 4 from 1024px. key = product.id: stable and unique (never the array index).
 */
export default function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
