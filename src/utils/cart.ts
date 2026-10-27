import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';
import { discountedPrice } from './format';

/** Build a cart line from a product. */
export function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    stock: product.stock,
    quantity,
  };
}

/** Unit price the customer actually pays. */
export function getUnitPrice(item: CartItem): number {
  return discountedPrice(item.price, item.discountPercentage);
}

export function getLineTotal(item: CartItem): number {
  return Math.round(getUnitPrice(item) * item.quantity * 100) / 100;
}

/** Σ quantity — the number on the Header badge. */
export function getItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

/** P4.3 — total = Σ (discounted unit price × quantity). */
export function getCartTotal(items: CartItem[]): number {
  const total = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  return Math.round(total * 100) / 100;
}
