import { useEffect, useState } from 'react';
import { apiGet, apiUrl } from '../../api/client.js';
import { money, formatDate } from '../../lib/format.js';
import { useNav } from '../../context/NavContext.jsx';
import { SkeletonRows } from '../Skeletons.jsx';
import { EmptyState, ErrorState } from '../States.jsx';

const STATUS_STYLES = {
  Confirmed: 'bg-amber-100 text-amber-800',
  Processing: 'bg-sky-100 text-sky-800',
  Shipped: 'bg-violet-100 text-violet-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
};

export default function OrdersView() {
  const nav = useNav();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    apiGet('/api/orders?limit=20', { signal: ctrl.signal })
      .then((data) => {
        setOrders(data.orders || []);
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
  }, [tick]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <SkeletonRows count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message={error} onRetry={() => setTick((t) => t + 1)} />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="Orders placed through checkout will appear here. The API also ships with sample orders."
          actionLabel="Start shopping"
          onAction={nav.goHome}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Orders</h1>
      <p className="mt-1 text-sm text-stone-500">
        The latest orders placed through the ShopWave API — including seeded sample data
        (served by <span className="font-mono text-xs">GET /api/orders</span>).
      </p>

      <ul className="mt-6 space-y-4 pb-8">
        {orders.map((order) => {
          const statusStyle = STATUS_STYLES[order.status] || 'bg-stone-100 text-stone-700';
          const thumbs = order.items.slice(0, 4);
          return (
            <li key={order.id}>
              <button
                type="button"
                onClick={() => nav.showOrder(order.id)}
                className="flex w-full flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">{order.id}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusStyle}`}>
                      {order.status}
                    </span>
                    {order.sample && (
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-500">
                        sample
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    {formatDate(order.createdAt)} · {order.customer.name} · {order.city || order.customer.city}, {order.customer.country}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:shrink-0">
                  <div className="flex -space-x-2" aria-hidden="true">
                    {thumbs.map((item) => (
                      <span
                        key={item.productId}
                        className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg border-2 border-white bg-stone-100 text-lg shadow-sm"
                      >
                        <img src={apiUrl(item.imageUrl)} alt="" className="h-full w-full object-cover" />
                      </span>
                    ))}
                    {order.items.length > thumbs.length && (
                      <span className="grid h-10 w-10 place-items-center rounded-lg border-2 border-white bg-stone-900 text-[11px] font-bold text-white shadow-sm">
                        +{order.items.length - thumbs.length}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900">{money(order.total)}</p>
                    <p className="text-xs text-stone-500">
                      {order.itemCount} item{order.itemCount === 1 ? '' : 's'}
                    </p>
                  </div>
                  <svg className="hidden h-5 w-5 text-stone-400 sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
