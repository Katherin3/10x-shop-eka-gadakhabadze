import type { Product, ProductsResponse } from '../types/product';

const API_BASE = 'https://dummyjson.com';
const CATALOG_LIMIT = 12;

/**
 * P2.2 — GET /products?limit=12&skip=0.
 * fetch() only rejects on network failure, NOT on HTTP errors (404, 500),
 * so response.ok has to be checked by hand.
 */
export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${API_BASE}/products?limit=${CATALOG_LIMIT}&skip=0`);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  return (await response.json()) as ProductsResponse;
}

/**
 * P3.2 — GET /products/{id}.
 * Returns null when the product does not exist (404), so the page can show
 * NotFound instead of a generic error. Any other failure throws.
 */
export async function fetchProductById(id: number): Promise<Product | null> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  return (await response.json()) as Product;
}
