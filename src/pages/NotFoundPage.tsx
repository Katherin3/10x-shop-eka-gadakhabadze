import { Link } from 'react-router';

/** * route, unknown product ids (P0.1). */
export default function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <p className="font-display text-7xl font-bold text-berry-soft" aria-hidden="true">
        404
      </p>
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="text-ink-soft">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-full bg-berry px-4 font-semibold text-white hover:bg-berry-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berry"
      >
        Go to catalog
      </Link>
    </section>
  );
}
