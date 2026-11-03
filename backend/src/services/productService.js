import { products, findProduct } from '../data/products.js';

/** Shape a catalog product for API responses. */
export function toProductView(p) {
  return {
    ...p,
    imageUrl: `/api/images/${p.id}.svg`,
    discountPct: p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0,
  };
}

export function getProduct(id) {
  const product = findProduct(id);
  if (!product) {
    const err = new Error(`Product "${id}" not found`);
    err.status = 404;
    throw err;
  }
  return toProductView(product);
}

const SORTERS = {
  popular: (a, b) => b.reviews - a.reviews,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
};

/**
 * List products with filtering, search, sorting and pagination.
 * Returns a page payload the storefront consumes directly.
 */
export function listProducts(query = {}) {
  const { category, search, sort = 'popular' } = query;
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 12));

  let items = [...products];
  if (category && category !== 'All') {
    items = items.filter((p) => p.category === category);
  }
  if (search) {
    const q = String(search).toLowerCase().trim();
    if (q) {
      items = items.filter((p) =>
        [p.name, p.brand, p.category, p.description].join(' ').toLowerCase().includes(q)
      );
    }
  }
  items.sort(SORTERS[sort] || SORTERS.popular);

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const paged = items.slice((safePage - 1) * limit, safePage * limit);

  return {
    products: paged.map(toProductView),
    total,
    page: safePage,
    pages,
    limit,
    sort: SORTERS[sort] ? sort : 'popular',
  };
}
