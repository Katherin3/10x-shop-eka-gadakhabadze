import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products.api';
import PageHeading from '../components/layout/PageHeading';
import ProductGrid from '../components/product/ProductGrid';
import StatusMessage from '../components/ui/StatusMessage';
import { useCart } from '../context/CartContext';
import type { Product } from '../types/product';

type LoadStatus = 'loading' | 'success' | 'error';

/** P2 — CORE catalog: GET /products, loading / error / empty states. */
export default function CatalogPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<LoadStatus>('loading');

  useEffect(() => {
    // If the component unmounts before the response arrives, `ignore`
    // stops us from writing stale data into state.
    let ignore = false;

    async function load(): Promise<void> {
      try {
        const data = await fetchProducts();
        if (ignore) return;
        setProducts(data.products);
        setTotal(data.total);
        setStatus('success');
      } catch {
        if (ignore) return;
        setStatus('error');
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []); // empty deps: load once, when the page mounts

  function handleAdd(product: Product): boolean {
    return addItem(product, 1);
  }

  return (
    <section>
      <PageHeading title="Catalog">
        {status === 'success' && products.length > 0 && (
          <p>
            Showing {products.length} of {total} products
          </p>
        )}
      </PageHeading>

      {status === 'loading' && <StatusMessage variant="loading">Loading products…</StatusMessage>}

      {status === 'error' && (
        <StatusMessage variant="error">
          <p className="font-semibold">Products couldn’t be loaded.</p>
          <p>Check your internet connection, then refresh the page.</p>
        </StatusMessage>
      )}

      {status === 'success' && products.length === 0 && (
        <StatusMessage variant="empty">No products found.</StatusMessage>
      )}

      {status === 'success' && products.length > 0 && <ProductGrid products={products} onAdd={handleAdd} />}
    </section>
  );
}
