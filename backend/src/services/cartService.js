import { config } from '../config.js';
import { round2, httpError } from '../utils/helpers.js';
import { products } from '../data/products.js';
import { store } from '../store/store.js';

const MIN_QTY = 1;
const MAX_QTY = 99;

function sanitizeQty(quantity) {
  const qty = parseInt(quantity, 10);
  if (Number.isNaN(qty) || qty < MIN_QTY || qty > MAX_QTY) {
    throw httpError(400, `Quantity must be between ${MIN_QTY} and ${MAX_QTY}`);
  }
  return qty;
}

function findLine(items, productId) {
  return items.find((i) => i.productId === productId) || null;
}

/** Build the full cart view (items joined with product data + totals). */
export function buildCartView(cartId, rawItems) {
  const items = [];
  for (const { productId, quantity } of rawItems) {
    const p = products.find((x) => x.id === productId);
    if (!p) continue; // skip lines whose product no longer exists
    items.push({
      productId: p.id,
      quantity,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice,
      emoji: p.emoji,
      imageUrl: `/api/images/${p.id}.svg`,
      stock: p.stock,
      lineTotal: round2(p.price * quantity),
    });
  }

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = round2(items.reduce((s, i) => s + i.lineTotal, 0));
  const shipping = itemCount === 0 || subtotal >= config.freeShippingThreshold ? 0 : config.shippingFlat;
  const tax = round2(subtotal * config.taxRate);
  const total = round2(subtotal + shipping + tax);

  return {
    id: cartId,
    items,
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    currency: config.currency,
    freeShippingThreshold: config.freeShippingThreshold,
  };
}

/** GET /api/cart/:cartId — unknown ids simply return an empty cart. */
export function getCart(cartId) {
  return buildCartView(cartId, store.carts.get(cartId) || []);
}

/** POST /api/cart/:cartId/items — add a product (or bump its quantity). */
export function addItem(cartId, productId, quantity = 1) {
  const qty = sanitizeQty(quantity ?? 1);
  const product = products.find((p) => p.id === productId);
  if (!product) throw httpError(404, `Product "${productId}" not found`);

  const items = store.carts.get(cartId) || [];
  const line = findLine(items, productId);
  const nextQty = (line ? line.quantity : 0) + qty;
  if (nextQty > product.stock) {
    throw httpError(400, `Only ${product.stock} unit(s) of "${product.name}" in stock`);
  }
  if (line) {
    line.quantity = nextQty;
  } else {
    items.push({ productId, quantity: qty });
  }
  store.carts.set(cartId, items);
  return buildCartView(cartId, items);
}

/** PUT /api/cart/:cartId/items/:productId — set an absolute quantity. */
export function updateItem(cartId, productId, quantity) {
  const product = products.find((p) => p.id === productId);
  if (!product) throw httpError(404, `Product "${productId}" not found`);

  const items = store.carts.get(cartId) || [];
  const line = findLine(items, productId);
  if (!line) throw httpError(404, 'Product is not in the cart');

  const qty = sanitizeQty(quantity);
  if (qty > product.stock) {
    throw httpError(400, `Only ${product.stock} unit(s) of "${product.name}" in stock`);
  }
  if (qty === 0) {
    store.carts.set(cartId, items.filter((i) => i.productId !== productId));
  } else {
    line.quantity = qty;
  }
  return buildCartView(cartId, store.carts.get(cartId) || []);
}

/** DELETE /api/cart/:cartId/items/:productId — remove a single line. */
export function removeItem(cartId, productId) {
  const items = store.carts.get(cartId) || [];
  const next = items.filter((i) => i.productId !== productId);
  if (next.length === items.length) throw httpError(404, 'Product is not in the cart');
  store.carts.set(cartId, next);
  return buildCartView(cartId, next);
}

/** DELETE /api/cart/:cartId — empty the whole cart. */
export function clearCart(cartId) {
  store.carts.delete(cartId);
  return buildCartView(cartId, []);
}
