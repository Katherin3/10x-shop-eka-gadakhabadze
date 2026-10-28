import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/** NavLink gives us isActive, so the current page is highlighted (P0.1). */
function navLinkClasses({ isActive }: { isActive: boolean }): string {
  const base =
    'inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
  return isActive ? `${base} bg-indigo-50 text-indigo-800` : `${base} text-slate-700 hover:bg-slate-100`;
}

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  function handleLogout(): void {
    logout(); // cart stays as it is
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* flex-wrap: on narrow phones the nav drops to a second row — no horizontal scroll */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="rounded-md font-['Bricolage_Grotesque',sans-serif] text-2xl font-extrabold tracking-tight text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
        >
          10X Shop
        </Link>

        <nav aria-label="Main" className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={navLinkClasses}>
            Catalog
          </NavLink>

          <NavLink to="/cart" className={navLinkClasses}>
            Cart
            {itemCount > 0 && (
              <span
                className="min-w-6 rounded-full bg-indigo-700 px-1.5 py-0.5 text-center text-xs font-bold text-white tabular-nums"
                aria-label={`${itemCount} items in cart`}
              >
                {itemCount}
              </span>
            )}
          </NavLink>

          {user.isLoggedIn ? (
            <>
              <span className="hidden px-2 text-sm text-slate-500 sm:inline">Hi, {user.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navLinkClasses}>
              Log in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
