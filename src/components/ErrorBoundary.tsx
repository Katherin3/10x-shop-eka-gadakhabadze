import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * O2 — catches render errors anywhere below it and shows a fallback instead
 * of a blank white page. Error boundaries must be class components: there is
 * no hook equivalent of getDerivedStateFromError / componentDidCatch.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">Something went wrong.</h1>
          <p className="text-slate-600">Reload the page to continue shopping. Your cart is saved.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-11 rounded-lg bg-indigo-700 px-5 font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
