import type { Product } from '../types/product';

/**
 * The in-stock product with the biggest discount, or null if there is none.
 * reduce walks the list once and keeps the best product seen so far.
 */
export function getBestDeal(products: Product[]): Product | null {
  return products
    .filter((product) => product.stock > 0)
    .reduce<Product | null>(
      (best, product) => (best === null || product.discountPercentage > best.discountPercentage ? product : best),
      null,
    );
}
