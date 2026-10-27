import type { CartItem, CartState } from '../types/cart';

const CART_KEY = 'shop_cart';

/**
 * Type guard: JSON.parse returns data with no real type, so every item read
 * from localStorage is checked before it is trusted as a CartItem.
 */
function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.productId === 'number' &&
    typeof v.title === 'string' &&
    typeof v.thumbnail === 'string' &&
    typeof v.price === 'number' &&
    typeof v.discountPercentage === 'number' &&
    typeof v.stock === 'number' &&
    typeof v.quantity === 'number'
  );
}

/** Read the saved cart. Broken or missing data never crashes the app. */
export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw === null) return [];

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && 'items' in parsed && Array.isArray(parsed.items)) {
      return parsed.items.filter(isCartItem);
    }
    return [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  const state: CartState = { items };
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state));
  } catch {
    // Storage can be full or disabled (private mode) — the cart still works in memory.
  }
}
