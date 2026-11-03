import { apiUrl } from '../../api/client.js';
import { money } from '../../lib/format.js';
import { useNav } from '../../context/NavContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { SkeletonRows } from '../Skeletons.jsx';
import { EmptyState } from '../States.jsx';

function QtyStepper({ item, busy, onUpdate }) {
  return (
    <div className="inline-flex h-9 items-center rounded-md border border-stone-300 bg-white" role="group" aria-label={`Quantity for ${item.name}`}>
      <button
        type="button"
        onClick={() => onUpdate(item.quantity - 1)}
        disabled={busy}
        className="grid h-full w-9 place-items-center rounded-l-md text-lg text-stone-600 hover:bg-stone-100 disabled:opacity-40"
        aria-label={`Decrease quantity of ${item.name}`}
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold text-slate-800" aria-live="polite">
        {item.quantity}
      </span>
      <button
        type="button"
        onClick={() => onUpdate(item.quantity + 1)}
        disabled={busy || item.quantity >= item.stock}
        className="grid h-full w-9 place-items-center rounded-r-md text-lg text-stone-600 hover:bg-stone-100 disabled:opacity-40"
        aria-label={`Increase quantity of ${item.name}`}
      >
        +
      </button>
    </div>
  );
}

export default function CartView() {
  const nav = useNav();
  const { cart, ready, busy, updateItem, removeItem, clearCart } = useCart();

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <SkeletonRows count={3} />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse the catalog to find something you love."
          actionLabel="Browse products"
          onAction={nav.goHome}
        />
      </div>
    );
  }

  const remaining = Math.max(0, cart.freeShippingThreshold - cart.subtotal);
  const progress = Math.min(100, Math.round((cart.subtotal / cart.freeShippingThreshold) * 100));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Shopping cart</h1>
      <p className="mt-1 text-sm text-stone-500">
        {cart.itemCount} item{cart.itemCount === 1 ? '' : 's'} in your cart
      </p>

      {/* Free shipping progress */}
      <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
        {remaining > 0 ? (
          <p className="text-sm text-stone-600">
            Add <span className="font-bold text-slate-900">{money(remaining)}</span> more to get{' '}
            <span className="font-semibold text-emerald-700">FREE shipping</span>
          </p>
        ) : (
          <p className="text-sm font-semibold text-emerald-700">
            ✓ Your order qualifies for FREE shipping
          </p>
        )}
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200" role="presentation">
          <div
            className={`h-full rounded-full transition-all duration-500 ${remaining > 0 ? 'bg-amber-400' : 'bg-emerald-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <section className="lg:col-span-2" aria-label="Cart items">
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => nav.openProduct(item.productId)}
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24"
                  aria-label={`View ${item.name}`}
                >
                  <img
                    src={apiUrl(item.imageUrl)}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </button>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                        {item.brand}
                      </p>
                      <button
                        type="button"
                        onClick={() => nav.openProduct(item.productId)}
                        className="line-clamp-2 text-left text-sm font-medium text-slate-800 hover:text-amber-600 sm:text-base"
                      >
                        {item.name}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      disabled={busy}
                      className="shrink-0 rounded-md p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M4 7h16M10 11v6m4-6v6M6 7l1 13a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9L18 7M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-xs text-emerald-700">
                    {item.stock > 0 ? 'In stock' : 'Out of stock'}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
                    <QtyStepper
                      item={item}
                      busy={busy}
                      onUpdate={(q) => updateItem(item.productId, q)}
                    />
                    <p className="text-base font-bold text-slate-900 sm:text-lg">{money(item.lineTotal)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={nav.goHome}
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              ← Continue shopping
            </button>
            <button
              type="button"
              onClick={clearCart}
              disabled={busy}
              className="text-sm font-medium text-stone-400 hover:text-rose-600 disabled:opacity-40"
            >
              Clear cart
            </button>
          </div>
        </section>

        {/* Summary */}
        <aside className="lg:col-span-1" aria-label="Order summary">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Subtotal ({cart.itemCount} items)</dt>
                <dd className="font-medium text-slate-900">{money(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Shipping</dt>
                <dd className={`font-medium ${cart.shipping === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {cart.shipping === 0 ? 'FREE' : money(cart.shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Estimated tax (5%)</dt>
                <dd className="font-medium text-slate-900">{money(cart.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
                <dt className="font-bold text-slate-900">Order total</dt>
                <dd className="font-bold text-slate-900">{money(cart.total)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={nav.goCheckout}
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-md bg-amber-400 font-bold text-slate-900 transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              Proceed to checkout
            </button>
            <p className="mt-3 text-center text-xs text-stone-400">
              Free delivery on orders over {money(cart.freeShippingThreshold)}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
