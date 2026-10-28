import { Link } from 'react-router';

/** * route, unknown product ids (P0.1). */
export default function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <p className="font-['Bricolage_Grotesque',sans-serif] text-7xl font-extrabold text-indigo-200" aria-hidden="true">
        404
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight">Page not found</h1>
      <p className="text-slate-600">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-lg bg-indigo-700 px-4 font-semibold text-white hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Go to catalog
      </Link>
    </section>
  );
}
