import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Central application configuration.
 * All business constants (tax, shipping rules, currency) live here so they
 * can be tuned in one place.
 */
export const config = {
  port: Number(process.env.PORT || 4000),
  env: process.env.NODE_ENV || 'development',

  // Commerce rules
  currency: 'USD',
  taxRate: 0.05, // 5% tax on subtotal
  shippingFlat: 4.99, // flat shipping fee below the free-shipping threshold
  freeShippingThreshold: 35, // free shipping for subtotals >= this amount
  estimatedDeliveryDays: 4,

  // Persistence (orders survive restarts via a JSON file)
  dataFile: process.env.DATA_FILE || path.join(here, '..', 'data', 'orders.json'),
};
