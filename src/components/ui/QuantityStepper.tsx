interface QuantityStepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  disabled?: boolean;
}

/** − / + control. The buttons are disabled at the edges (1 ≤ qty ≤ stock). */
export default function QuantityStepper({ value, min, max, onChange, label, disabled = false }: QuantityStepperProps) {
  const buttonClasses =
    'h-11 w-11 text-lg font-semibold text-slate-700 transition-colors hover:bg-slate-100 ' +
    'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-600 ' +
    'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

  return (
    <div role="group" aria-label={label} className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300 bg-white">
      <button
        type="button"
        className={buttonClasses}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-10 text-center font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={buttonClasses}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
