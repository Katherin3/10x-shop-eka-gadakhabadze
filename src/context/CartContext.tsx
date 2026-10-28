import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';
import { getCartTotal, getItemCount, toCartItem } from '../utils/cart';
import { loadCart, saveCart } from '../utils/storage';

/**
 * P4.2 — shared cart state. Every update is immutable: a new array / new
 * objects are created (map, filter, spread), the old state is never mutated.
 * Golden cycle: user action -> handler -> setItems -> new state -> re-render.
 */
interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  /** Returns false (and changes nothing) when the stock limit would be exceeded. */
  addItem: (product: Product, quantity: number) => boolean;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  getQuantityInCart: (productId: number) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Lazy initial state: localStorage is read once, on the first render only.
  const [items, setItems] = useState<CartItem[]>(loadCart);

  // Persist after every change (shop_cart key).
  useEffect(() => {
    saveCart(items);
  }, [items]);

  function getQuantityInCart(productId: number): number {
    const line = items.find((item) => item.productId === productId);
    return line ? line.quantity : 0;
  }

  function addItem(product: Product, quantity: number): boolean {
    const alreadyInCart = getQuantityInCart(product.id);
    if (quantity < 1 || alreadyInCart + quantity > product.stock) {
      return false;
    }

    setItems((prev) =>
      prev.some((item) => item.productId === product.id)
        ? prev.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [...prev, toCartItem(product, quantity)],
    );
    return true;
  }

  function updateQuantity(productId: number, quantity: number): void {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(Math.max(1, Math.floor(quantity)), item.stock) }
          : item,
      ),
    );
  }

  function removeItem(productId: number): void {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }

  function clearCart(): void {
    setItems([]);
  }

  const value: CartContextValue = {
    items,
    itemCount: getItemCount(items),
    total: getCartTotal(items),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getQuantityInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return context;
}
