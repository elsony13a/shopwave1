import { useEffect, useState } from 'react';
import { apiGet } from '../../api/client.js';
import { money } from '../../lib/format.js';
import { useNav } from '../../context/NavContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import Rating from '../Rating.jsx';
import Price from '../Price.jsx';
import AddToCartButton from '../AddToCartButton.jsx';
import ProductCard from '../ProductCard.jsx';
import { FullPageSpinner } from '../Skeletons.jsx';
import { EmptyState, ErrorState } from '../States.jsx';

export default function ProductDetailView({ id }) {
  const nav = useNav();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setQty(1);
    setNotFound(false);
    setError(null);

    apiGet(`/api/products/${id}`, { signal: ctrl.signal })
      .then((p) => {
        setProduct(p);
        return apiGet(`/api/products?category=${encodeURIComponent(p.category)}&limit=4&sort=rating`, {
          signal: ctrl.signal,
        });
      })
      .then((payload) => {
        if (payload) setRelated((payload.products || []).filter((p) => p.id !== id).slice(0, 4));
      })
      .catch((err) => {
        if (err && err.name === 'AbortError') return;
        if (err && err.status === 404) setNotFound(true);
        else setError(err.message);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [id]);

  if (loading) return <FullPageSpinner />;

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon="🕵️"
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          actionLabel="Back to catalog"
          onAction={nav.goHome}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message={error} onRetry={() => nav.openProduct(id)} />
      </div>
    );
  }

  if (!product) return null;

  const maxQty = Math.min(10, product.stock);
  const savings = product.oldPrice && product.oldPrice > product.price ? product.oldPrice - product.price : 0;

  const buyNow = async () => {
    setBuyingNow(true);
    const ok = await addItem(product.id, qty);
    setBuyingNow(false);
    if (ok) nav.goCheckout();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-500" aria-label="Breadcrumb">
        <button type="button" onClick={nav.goHome} className="hover:text-amber-600">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <span className="hidden sm:inline">{product.category}</span>
        <span className="hidden sm:inline" aria-hidden="true">/</span>
        <span className="max-w-[50vw] truncate text-stone-700">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <img
            src={`${product.imageUrl}${product.imageUrl.includes('?') ? '&' : '?'}v=detail`}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">{product.name}</h1>

          <div className="mt-3">
            <Rating value={product.rating} reviews={product.reviews} size="lg" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Price price={product.price} oldPrice={product.oldPrice} size="lg" />
            {product.discountPct > 0 && (
              <span className="rounded bg-rose-600 px-2 py-1 text-xs font-bold text-white">
                -{product.discountPct}%
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="mt-1 text-sm font-medium text-emerald-700">You save {money(savings)}</p>
          )}

          <p className="mt-4 text-sm font-medium" aria-live="polite">
            {product.stock > 10 ? (
              <span className="text-emerald-700">✓ In stock — ships in 24 h</span>
            ) : product.stock > 0 ? (
              <span className="text-amber-600">Only {product.stock} left in stock — order soon</span>
            ) : (
              <span className="text-rose-600">Out of stock</span>
            )}
          </p>

          <p className="mt-4 leading-relaxed text-stone-600">{product.description}</p>

          <ul className="mt-4 space-y-1.5">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-stone-700">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="m4 12.5 5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          {/* Purchase row */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label htmlFor="qty" className="sr-only">
              Quantity
            </label>
            <select
              id="qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              disabled={product.stock === 0}
              className="h-12 rounded-md border border-stone-300 bg-white px-3 text-base font-medium focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50"
            >
              {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Qty: {n}
                </option>
              ))}
            </select>

            {product.stock > 0 ? (
              <>
                <AddToCartButton product={product} quantity={qty} size="lg" />
                <button
                  type="button"
                  onClick={buyNow}
                  disabled={buyingNow}
                  className="inline-flex h-12 items-center justify-center rounded-md border-2 border-slate-900 bg-white px-6 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {buyingNow ? 'Redirecting…' : 'Buy now'}
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex h-12 items-center rounded-md bg-stone-300 px-6 text-base font-semibold text-stone-500"
              >
                Currently unavailable
              </button>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-stone-200 pt-6 text-center text-xs text-stone-500">
            <div>
              <p className="text-xl" aria-hidden="true">🚚</p>
              <p className="mt-1 font-medium text-stone-700">Free shipping over $35</p>
            </div>
            <div>
              <p className="text-xl" aria-hidden="true">🔄</p>
              <p className="mt-1 font-medium text-stone-700">30-day free returns</p>
            </div>
            <div>
              <p className="text-xl" aria-hidden="true">🔒</p>
              <p className="mt-1 font-medium text-stone-700">Secure checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-14" aria-label="Related products">
          <h2 className="text-xl font-bold text-slate-900">You may also like</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
