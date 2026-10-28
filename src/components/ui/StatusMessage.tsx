import type { ReactNode } from 'react';

type StatusVariant = 'loading' | 'error' | 'empty' | 'info';

interface StatusMessageProps {
  variant: StatusVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  loading: 'border-slate-200 bg-white text-slate-600',
  error: 'border-red-200 bg-red-50 text-red-800',
  empty: 'border-dashed border-slate-300 bg-white text-slate-600',
  info: 'border-indigo-200 bg-indigo-50 text-indigo-900',
};

/** P0.6 — one component for every loading / error / empty message. */
export default function StatusMessage({ variant, children }: StatusMessageProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex flex-col items-center gap-3 rounded-xl border px-6 py-10 text-center ${VARIANT_CLASSES[variant]}`}
    >
      {variant === 'loading' && (
        <span
          aria-hidden="true"
          className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-700"
        />
      )}
      {children}
    </div>
  );
}
