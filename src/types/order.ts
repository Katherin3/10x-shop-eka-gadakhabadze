import type { CartItem } from './cart';

/** The four controlled Checkout fields (P5.2). */
export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

export type ShippingErrors = Partial<Record<keyof ShippingInfo, string>>;

/** Local order summary shown after "Place order" — never sent to a server. */
export interface OrderSummary {
  items: CartItem[];
  shipping: ShippingInfo;
  itemCount: number;
  total: number;
  placedAt: string;
}
