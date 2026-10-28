import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

/** P0.1 — one shared layout: Header and Footer are written once, pages render in <Outlet />. */
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <ScrollToTop />
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
