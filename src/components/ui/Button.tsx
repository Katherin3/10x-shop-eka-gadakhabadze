import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost-danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const BASE_CLASSES =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold ' +
  'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berry ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

// TW4 — hover / focus / disabled variants on a real, reused component.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-berry text-white hover:bg-berry-dark disabled:hover:bg-berry',
  secondary: 'border border-line-strong bg-white text-ink hover:bg-blush disabled:hover:bg-white',
  'ghost-danger': 'text-red-700 hover:bg-red-50',
};

export default function Button({
  variant = 'primary',
  fullWidth = false,
  type = 'button',
  className = '',
  ...rest
}: ButtonProps) {
  const width = fullWidth ? 'w-full' : '';
  return (
    <button type={type} className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${width} ${className}`} {...rest} />
  );
}
