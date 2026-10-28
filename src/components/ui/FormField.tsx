import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

/**
 * Label + controlled input + inline error (P0.5). The parent owns the value
 * and passes `value` / `onChange` through the rest props.
 */
export default function FormField({ id, label, error, className = '', ...inputProps }: FormFieldProps) {
  const errorId = `${id}-error`;
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-200'
    : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100';

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-11 rounded-lg border bg-white px-3 py-2 text-base outline-none transition focus:ring-4 ${stateClasses} ${className}`}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
