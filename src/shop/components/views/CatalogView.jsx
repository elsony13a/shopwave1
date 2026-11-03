import { useEffect, useState } from 'react';
import { apiGet } from '../../api/client.js';
import { useCatalog } from '../../context/CatalogContext.jsx';
import ProductCard from '../ProductCard.jsx';
import { SkeletonGrid } from '../Skeletons.jsx';
import { EmptyState, ErrorState } from '../States.jsx';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name A–Z' },
];

export default function CatalogView() {
  const { search, setSearch, category, setCategory, sort, setSort, categories } = useCatalog();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0); // bumped by "Try again"

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    const params = new URLSearchParams({ sort, limit: '12', page: String(page) });
    if (search) params.set('search', search);
    if (category && category !== 'All') params.set('category', category);

    apiGet(`/api/products?${params.toString()}`, { signal: ctrl.signal })
      .then((payload) => {
        setData(payload);
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
  }, [search, category, sort, page, tick]);

  // A new search / category / sort always jumps back to page 1.
  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const chips = ['All', ...categories.map((c) => c.name)];
  const results = data && data.products;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero banner */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-700 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Summer sale</p>
        <h1 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
          Everything you love, one wave away.
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-stone-300 sm:text-base">
          Up to 30% off across electronics, home, fashion and more. Free shipping on orders over $35.
        </p>
        <button
          type="button"
          onClick={() => {
            setSearch('');
            setCategory('All');
          }}
          className="mt-6 inline-flex h-11 items-center rounded-md bg-amber-400 px-6 font-semibold text-slate-900 transition-colors hover:bg-amber-300"
        >
          Shop all deals
        </button>
      </section>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {chips.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              className={`h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
                category === name
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-stone-300 bg-white text-stone-600 hover:border-stone-400 hover:text-slate-900'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="hidden text-sm text-stone-500 sm:block">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-md border border-stone-300 bg-white px-3 text-sm text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result meta */}
      <div className="mt-4 flex items-baseline justify-between gap-4" aria-live="polite">
        <p className="text-sm text-stone-500">
          {loading
            ? 'Loading products…'
            : results && results.length > 0
              ? `${data.total} product${data.total === 1 ? '' : 's'}${search ? ` for "${search}"` : ''}${category !== 'All' ? ` in ${category}` : ''}`
              : ''}
        </p>
        {search && !loading && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="mt-4 pb-8">
        {loading && <SkeletonGrid count={8} />}

        {!loading && error && (
          <ErrorState
            message={error}
            onRetry={() => {
              setError(null);
              setTick((t) => t + 1);
            }}
          />
        )}

        {!loading && !error && results && results.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No products found"
            description={`Nothing matches ${search ? `"${search}"` : 'this filter'}. Try a different keyword or browse all categories.`}
            actionLabel="Clear filters"
            onAction={() => {
              setSearch('');
              setCategory('All');
            }}
          />
        )}

        {!loading && !error && results && results.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {data.pages > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={data.page <= 1}
                  className="h-10 rounded-md border border-stone-300 bg-white px-4 text-sm font-medium disabled:opacity-40 enabled:hover:border-stone-400"
                >
                  ← Prev
                </button>
                <span className="px-3 text-sm text-stone-500">
                  Page {data.page} of {data.pages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                  disabled={data.page >= data.pages}
                  className="h-10 rounded-md border border-stone-300 bg-white px-4 text-sm font-medium disabled:opacity-40 enabled:hover:border-stone-400"
                >
                  Next →
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
