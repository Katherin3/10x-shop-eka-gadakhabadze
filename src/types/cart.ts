/**
 * A line in the cart. It copies the product fields the cart needs, so the
 * cart can be rendered (and saved to localStorage) without the full Product.
 */
export interface CartItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  stock: number;
  quantity: number;
}

/** Shape saved under the `shop_cart` localStorage key. */
export interface CartState {
  items: CartItem[];
}
