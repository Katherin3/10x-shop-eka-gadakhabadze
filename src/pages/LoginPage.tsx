import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { useAuth } from '../context/AuthContext';
import type { LoginFormErrors, LoginFormValues } from '../types/user';
import { hasErrors, validateLogin } from '../utils/validation';

/** Where to go after login: the page that sent us here, or the catalog. */
function getRedirectPath(state: unknown): string {
  if (typeof state === 'object' && state !== null && 'from' in state && typeof state.from === 'string') {
    return state.from;
  }
  return '/';
}

/** P1 — simulated login: any non-empty username + a 6+ character password. */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = getRedirectPath(location.state);

  const [values, setValues] = useState<LoginFormValues>({ username: '', password: '' });
  const [errors, setErrors] = useState<LoginFormErrors>({});

  function updateField(field: keyof LoginFormValues, value: string): void {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // no page reload

    const validationErrors = validateLogin(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    login(values.username.trim());
    // replace: the Back button should not return to the login form.
    navigate(redirectPath, { replace: true });
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Log in</h1>
        <p className="text-slate-600">
          {redirectPath === '/checkout'
            ? 'Log in to finish your order. Your cart is kept.'
            : 'Use any username and a password of at least 6 characters.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          id="login-username"
          label="Username"
          autoComplete="username"
          value={values.username}
          onChange={(event) => updateField('username', event.target.value)}
          error={errors.username}
        />
        <FormField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(event) => updateField('password', event.target.value)}
          error={errors.password}
        />
        <Button type="submit" fullWidth className="mt-2">
          Log In
        </Button>
      </form>

      <Link
        to="/"
        className="self-start rounded-sm text-sm font-medium text-indigo-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        ← Back to catalog
      </Link>
    </section>
  );
}
