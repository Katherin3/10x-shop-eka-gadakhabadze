import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router';
import CartSummary from '../components/cart/CartSummary';
import OrderConfirmation from '../components/checkout/OrderConfirmation';
import PageHeading from '../components/layout/PageHeading';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { OrderSummary, ShippingErrors, ShippingInfo } from '../types/order';
import { hasErrors, validateShipping } from '../utils/validation';

/** P5 — controlled checkout form + local order simulation (no payment). */
export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, itemCount, total, clearCart } = useCart();

  // The form can be pre-filled with the username from AuthContext (P5.1).
  const [values, setValues] = useState<ShippingInfo>({
    fullName: user.username,
    email: '',
    address: '',
    city: '',
  });
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderSummary | null>(null);

  // Order placed -> show the confirmation (checked before the empty-cart rule,
  // because placing the order is exactly what empties the cart).
  if (order !== null) {
    return <OrderConfirmation order={order} />;
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace state={{ message: 'Add products to your cart before checking out.' }} />;
  }

  function updateField(field: keyof ShippingInfo, value: string): void {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateShipping(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return; // invalid form never places an order

    setIsSubmitting(true); // disables "Place order" against double clicks

    const summary: OrderSummary = {
      items,
      shipping: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
      },
      itemCount,
      total,
      placedAt: new Date().toISOString(),
    };

    // Both updates are batched into one render: confirmation appears and the
    // Header badge drops to 0 at the same time.
    setOrder(summary);
    clearCart();
  }

  return (
    <section>
      <PageHeading title="Checkout">
        <p>Where should we send your order?</p>
      </PageHeading>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
        >
          <h2 className="text-xl font-bold">Shipping details</h2>
          <FormField
            id="checkout-fullname"
            label="Full name"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            error={errors.fullName}
          />
          <FormField
            id="checkout-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            error={errors.email}
          />
          <FormField
            id="checkout-address"
            label="Address"
            autoComplete="street-address"
            value={values.address}
            onChange={(event) => updateField('address', event.target.value)}
            error={errors.address}
          />
          <FormField
            id="checkout-city"
            label="City"
            autoComplete="address-level2"
            value={values.city}
            onChange={(event) => updateField('city', event.target.value)}
            error={errors.city}
          />
          <Button type="submit" fullWidth disabled={isSubmitting} className="mt-2">
            {isSubmitting ? 'Placing order…' : 'Place order'}
          </Button>
        </form>

        <CartSummary itemCount={itemCount} total={total}>
          <ul className="flex flex-col gap-2 border-t border-slate-200 pt-3 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span className="text-slate-700">{item.title}</span>
                <span className="shrink-0 text-slate-500">× {item.quantity}</span>
              </li>
            ))}
          </ul>
        </CartSummary>
      </div>
    </section>
  );
}
