import crypto from 'node:crypto';
import { config } from '../config.js';
import { httpError } from '../utils/helpers.js';
import { getCart } from './cartService.js';
import { store } from '../store/store.js';

const REQUIRED_FIELDS = ['name', 'email', 'phone', 'address', 'city', 'country'];
const PAYMENT_METHODS = new Set(['cod', 'card']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeCustomer(input = {}) {
  const customer = {};
  const details = {};

  for (const field of REQUIRED_FIELDS) {
    const value = typeof input[field] === 'string' ? input[field].trim() : '';
    if (!value) details[field] = `${field} is required`;
    else customer[field] = value;
  }

  if (customer.email && !EMAIL_RE.test(customer.email)) {
    details.email = 'email address is not valid';
  }

  const paymentMethod = PAYMENT_METHODS.has(input.paymentMethod) ? input.paymentMethod : 'cod';
  if (Object.keys(details).length) {
    throw httpError(400, 'Please fix the highlighted fields', details);
  }
  return { ...customer, paymentMethod };
}

function newOrderId() {
  return `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

function dateOnly(offsetDays = 0) {
  return new Date(Date.now() + offsetDays * 86400000).toISOString().slice(0, 10);
}

/** POST /api/orders — place an order from the given cart, then clear it. */
export function createOrder({ cartId, customer }) {
  if (!cartId || typeof cartId !== 'string') {
    throw httpError(400, 'cartId is required');
  }

  const cart = getCart(cartId);
  if (!cart.items.length) {
    throw httpError(400, 'Cannot place an order with an empty cart');
  }

  const order = {
    id: newOrderId(),
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    estimatedDelivery: dateOnly(config.estimatedDeliveryDays),
    customer: sanitizeCustomer(customer),
    items: cart.items,
    itemCount: cart.itemCount,
    subtotal: cart.subtotal,
    shipping: cart.shipping,
    tax: cart.tax,
    total: cart.total,
    currency: cart.currency,
  };

  store.orders.set(order.id, order);
  store.persistOrders();
  store.carts.delete(cartId); // cart is emptied once the order is placed
  return order;
}

/** GET /api/orders/:id */
export function getOrder(id) {
  const order = store.orders.get(id);
  if (!order) throw httpError(404, `Order "${id}" not found`);
  return order;
}

/** GET /api/orders?limit=20 — most recent orders first. */
export function listOrders(limit = 20) {
  const max = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  return [...store.orders.values()]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, max);
}
