import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost-danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const BASE_CLASSES =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ' +
  'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

// TW4 — hover / focus / disabled variants on a real, reused component.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-700 text-white hover:bg-indigo-800 disabled:hover:bg-indigo-700',
  secondary: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:hover:bg-white',
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
