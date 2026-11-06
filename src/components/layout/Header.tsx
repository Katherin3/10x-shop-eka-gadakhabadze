import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

/** NavLink gives us isActive, so the current page is highlighted (P0.1). */
function navLinkClasses({ isActive }: { isActive: boolean }): string {
  const base =
    'inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berry';
  return isActive ? `${base} bg-berry-soft text-berry-dark` : `${base} text-ink-soft hover:bg-blush`;
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
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      {/* flex-wrap: on narrow phones the nav drops to a second row — no horizontal scroll */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="rounded-md font-display text-2xl font-bold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-berry"
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
                className="min-w-6 rounded-full bg-berry px-1.5 py-0.5 text-center text-xs font-bold text-white tabular-nums"
                aria-label={`${itemCount} items in cart`}
              >
                {itemCount}
              </span>
            )}
          </NavLink>

          {user.isLoggedIn ? (
            <>
              <span className="hidden px-2 text-sm text-muted sm:inline">Hi, {user.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-blush focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berry"
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
