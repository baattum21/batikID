import { NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const totalQty = cart.reduce((a, b) => a + b.qty, 0);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition ${isActive ? "text-amber-700 font-semibold" : "text-stone-600 hover:text-amber-700"}`;

  return (
    <header className="sticky top-0 z-20 border-b border-amber-100 bg-white/85 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-lg font-bold tracking-wide text-stone-900">
          Batik Id
        </NavLink>

        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/cart" className={({ isActive }) => `${linkClass({ isActive })} relative`}>
            Cart
            {totalQty > 0 && (
              <span className="absolute -right-4 -top-2 rounded-full bg-amber-600 px-2 text-xs text-white">
                {totalQty}
              </span>
            )}
          </NavLink>

          {!isAuthenticated && (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          )}

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <span className="hidden text-stone-600 sm:inline">Hi, {user?.name}</span>
              <button
                onClick={logout}
                className="rounded-lg border border-amber-200 px-3 py-1.5 text-stone-700 transition hover:bg-amber-50"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}