import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';
import { products } from '../data/products.js';
import { buildSampleOrders } from '../data/sampleOrders.js';

/**
 * In-memory data store.
 *
 * - Products: static seed data (see data/products.js)
 * - Carts:    Map<cartId, [{ productId, quantity }]>
 * - Orders:   Map<orderId, order> — persisted to a JSON file so sample and
 *             real orders survive server restarts.
 */
const carts = new Map();
const orders = new Map();

function loadPersistedOrders() {
  try {
    if (fs.existsSync(config.dataFile)) {
      const raw = JSON.parse(fs.readFileSync(config.dataFile, 'utf8'));
      if (Array.isArray(raw)) {
        for (const order of raw) orders.set(order.id, order);
      }
    }
  } catch (err) {
    console.warn('[store] Could not load persisted orders:', err.message);
  }
}

function persistOrders() {
  try {
    fs.mkdirSync(path.dirname(config.dataFile), { recursive: true });
    const tmp = `${config.dataFile}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify([...orders.values()], null, 2), 'utf8');
    fs.renameSync(tmp, config.dataFile);
  } catch (err) {
    console.warn('[store] Could not persist orders:', err.message);
  }
}

// Seed
for (const order of buildSampleOrders()) orders.set(order.id, order);
loadPersistedOrders();

export const store = { carts, orders, products, persistOrders };
