import { useNav } from '../context/NavContext.jsx';

export default function Footer() {
  const nav = useNav();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-slate-900 text-stone-300" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-lg font-extrabold text-white">
            <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="#1e293b" />
              <path d="M10 40c6-14 12-14 18 0s12 14 18 0" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
              <circle cx="46" cy="18" r="6" fill="#fbbf24" />
            </svg>
            Shop<span className="text-amber-400">Wave</span>
          </p>
          <p className="mt-3 max-w-xs leading-relaxed text-stone-400">
            A demo storefront showing a full shopping flow — browse, cart and checkout — powered by a
            Node.js &amp; Express REST API.
          </p>
        </div>

        <nav aria-label="Shop links">
          <p className="font-semibold uppercase tracking-wide text-stone-400">Shop</p>
          <ul className="mt-3 space-y-2">
            <li><button type="button" onClick={nav.goHome} className="hover:text-amber-300">All products</button></li>
            <li><button type="button" onClick={nav.goCart} className="hover:text-amber-300">Your cart</button></li>
            <li><button type="button" onClick={nav.goOrders} className="hover:text-amber-300">Orders</button></li>
          </ul>
        </nav>

        <div>
          <p className="font-semibold uppercase tracking-wide text-stone-400">REST API</p>
          <ul className="mt-3 space-y-1.5 font-mono text-xs text-stone-400">
            <li>GET&ensp;/api/products</li>
            <li>GET&ensp;/api/products/:id</li>
            <li>GET&ensp;/api/categories</li>
            <li>GET·POST·PUT·DEL&ensp;/api/cart</li>
            <li>GET·POST&ensp;/api/orders</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold uppercase tracking-wide text-stone-400">Built with</p>
          <p className="mt-3 leading-relaxed text-stone-400">
            React + Vite on the front, Node.js + Express on the back, Tailwind CSS for styling.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-stone-400">
        © {year} ShopWave — demo store for portfolio purposes. No real transactions are processed.
      </div>
    </footer>
  );
}
