import { useState } from 'react';
import { useNav } from '../context/NavContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useCatalog } from '../context/CatalogContext.jsx';

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="21" r="1" />
      <circle cx="17" cy="21" r="1" />
    </svg>
  );
}

export default function Header() {
  const nav = useNav();
  const { cart } = useCart();
  const { categories, setSearch, setCategory } = useCatalog();
  const [query, setQuery] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    setSearch(query.trim());
    setCategory('All');
    nav.goHome();
  };

  const pickCategory = (name) => {
    setCategory(name);
    setQuery('');
    setSearch('');
    nav.goHome();
  };

  const chips = ['All', ...categories.map((c) => c.name)];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center gap-3 sm:h-16 sm:gap-5">
          <button
            type="button"
            onClick={nav.goHome}
            className="flex shrink-0 items-center gap-2 rounded-md px-1 py-1"
            aria-label="ShopWave home"
          >
            <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="#1e293b" />
              <path d="M10 40c6-14 12-14 18 0s12 14 18 0" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
              <circle cx="46" cy="18" r="6" fill="#fbbf24" />
            </svg>
            <span className="text-lg font-extrabold tracking-tight sm:text-xl">
              Shop<span className="text-amber-400">Wave</span>
            </span>
          </button>

          <form role="search" onSubmit={submitSearch} className="flex min-w-0 flex-1">
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              id="site-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands…"
              className="h-10 min-w-0 flex-1 rounded-l-md border-0 bg-white px-3 text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:h-11 sm:text-base"
              autoComplete="off"
            />
            <button
              type="submit"
              className="grid h-10 w-11 shrink-0 place-items-center rounded-r-md bg-amber-400 text-slate-900 transition-colors hover:bg-amber-300 sm:h-11"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </form>

          <button
            type="button"
            onClick={nav.goOrders}
            className="hidden shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 md:inline-flex"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" strokeLinejoin="round" />
              <path d="M3.3 8.3 12 13l8.7-4.7M12 13v8" strokeLinejoin="round" />
            </svg>
            Orders
          </button>

          <button
            type="button"
            onClick={nav.goCart}
            className="relative flex shrink-0 items-center gap-2 rounded-md px-2.5 py-2 hover:bg-white/10"
            aria-label={`Shopping cart, ${cart.itemCount} item${cart.itemCount === 1 ? '' : 's'}`}
          >
            <CartIcon />
            <span className="hidden font-semibold sm:inline">Cart</span>
            {cart.itemCount > 0 && (
              <span
                className="absolute -right-0.5 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-xs font-bold text-slate-900"
                aria-hidden="true"
              >
                {cart.itemCount}
              </span>
            )}
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-2 text-sm" aria-label="Product categories">
          {chips.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => pickCategory(name)}
              className="shrink-0 rounded-full px-3 py-1 text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
