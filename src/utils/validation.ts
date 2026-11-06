import type { LoginFormErrors, LoginFormValues } from '../types/user';
import type { ShippingErrors, ShippingInfo } from '../types/order';

/** Simple email format check: something@something.something */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * P1.2 — the "required" and "at least 6" texts are copied verbatim from the PRD.
 * Extra rule (my addition): the password also needs an uppercase letter,
 * a number and a symbol. Checks run in order and only the first failing
 * rule is shown, so the user fixes one thing at a time.
 */
export function validateLogin(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (values.username.trim() === '') {
    errors.username = 'Username is required';
  }

  if (values.password === '') {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (!/[A-Z]/.test(values.password)) {
    errors.password = 'Password must contain at least one uppercase letter';
  } else if (!/[0-9]/.test(values.password)) {
    errors.password = 'Password must contain at least one number';
  } else if (!/[^A-Za-z0-9]/.test(values.password)) {
    errors.password = 'Password must contain at least one symbol (e.g. ! @ # $)';
  }

  return errors;
}

/** P5.2 — the four CORE Checkout fields. */
export function validateShipping(values: ShippingInfo): ShippingErrors {
  const errors: ShippingErrors = {};

  if (values.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters';
  }
  if (!isValidEmail(values.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }
  if (values.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters';
  }
  if (values.city.trim() === '') {
    errors.city = 'City is required';
  }

  return errors;
}

/** True when an errors object holds at least one message. */
export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((message) => message !== undefined);
}
