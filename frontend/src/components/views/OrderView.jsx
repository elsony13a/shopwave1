import { useEffect, useState } from 'react';
import { apiGet } from '../../api/client.js';
import { apiUrl } from '../../api/client.js';
import { money, formatDate, firstName } from '../../lib/format.js';
import { useNav } from '../../context/NavContext.jsx';
import { FullPageSpinner } from '../Skeletons.jsx';
import { ErrorState } from '../States.jsx';

const STATUS_STYLES = {
  Confirmed: 'bg-amber-100 text-amber-800',
  Processing: 'bg-sky-100 text-sky-800',
  Shipped: 'bg-violet-100 text-violet-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
};

export default function OrderView({ id }) {
  const nav = useNav();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    apiGet(`/api/orders/${id}`, { signal: ctrl.signal })
      .then((data) => {
        setOrder(data);
        setError(null);
      })
      .catch((err) => {
        if (err && err.name === 'AbortError') return;
        setError(err.message);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [id, tick]);

  if (loading) return <FullPageSpinner />;

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message={error || 'Order not found.'} onRetry={() => setTick((t) => t + 1)} />
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[order.status] || 'bg-stone-100 text-stone-700';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Confirmation header */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg" aria-hidden="true">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <path d="m4 12.5 5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">Order confirmed!</h1>
        <p className="mt-2 text-stone-600">
          Thanks{order.customer.name ? `, ${firstName(order.customer.name)}` : ''} — your order is on its way.
        </p>
        <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-bold ${statusStyle}`}>
          {order.status}
        </span>
      </div>

      {/* Meta */}
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Order number</dt>
          <dd className="mt-1 break-all font-mono text-sm font-bold text-slate-900">{order.id}</dd>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Placed on</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">{formatDate(order.createdAt)}</dd>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Estimated delivery</dt>
          <dd className="mt-1 text-sm font-semibold text-emerald-700">{formatDate(order.estimatedDelivery)}</dd>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Payment</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-900">
            {order.customer.paymentMethod === 'card' ? '💳 Card on delivery' : '💵 Cash on delivery'}
          </dd>
        </div>
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2" aria-label="Order items">
          <h2 className="text-lg font-bold text-slate-900">Items ({order.itemCount})</h2>
          <ul className="mt-4 space-y-4">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4">
                <img src={apiUrl(item.imageUrl)} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-stone-500">
                    {money(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-slate-900">{money(item.lineTotal)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-500">Subtotal</dt>
              <dd className="font-medium text-slate-900">{money(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Shipping</dt>
              <dd className={`font-medium ${order.shipping === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                {order.shipping === 0 ? 'FREE' : money(order.shipping)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Tax</dt>
              <dd className="font-medium text-slate-900">{money(order.tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 text-base">
              <dt className="font-bold text-slate-900">Total</dt>
              <dd className="font-bold text-slate-900">{money(order.total)}</dd>
            </div>
          </dl>
        </section>

        {/* Shipping address */}
        <aside className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm" aria-label="Shipping address">
          <h2 className="text-lg font-bold text-slate-900">Shipping to</h2>
          <address className="mt-3 space-y-0.5 text-sm not-italic leading-relaxed text-stone-600">
            <p className="font-semibold text-slate-900">{order.customer.name}</p>
            <p>{order.customer.address}</p>
            <p>
              {order.customer.city}, {order.customer.country}
            </p>
            <p className="pt-2 text-xs text-stone-400">{order.customer.email}</p>
            <p className="text-xs text-stone-400">{order.customer.phone}</p>
          </address>
        </aside>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={nav.goHome}
          className="inline-flex h-11 items-center rounded-md bg-amber-400 px-6 font-semibold text-slate-900 transition-colors hover:bg-amber-300"
        >
          Continue shopping
        </button>
        <button
          type="button"
          onClick={nav.goOrders}
          className="inline-flex h-11 items-center rounded-md border border-stone-300 bg-white px-6 font-semibold text-slate-700 transition-colors hover:border-stone-400"
        >
          View all orders
        </button>
      </div>
    </div>
  );
}
