import { products } from './products.js';
import { round2 } from '../utils/helpers.js';
import { config } from '../config.js';

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const dateOnly = (iso) => new Date(iso).toISOString().slice(0, 10);
const addDays = (iso, n) => dateOnly(new Date(new Date(iso).getTime() + n * 86400000));

function line(productId, quantity) {
  const p = products.find((x) => x.id === productId);
  if (!p) throw new Error(`Unknown product in sample order: ${productId}`);
  return {
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
  };
}

function totals(items) {
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = round2(items.reduce((s, i) => s + i.lineTotal, 0));
  const shipping = subtotal >= config.freeShippingThreshold ? 0 : config.shippingFlat;
  const tax = round2(subtotal * config.taxRate);
  const total = round2(subtotal + shipping + tax);
  return { itemCount, subtotal, shipping, tax, total };
}

/**
 * A few realistic sample orders so GET /api/orders has content on a fresh boot.
 * Dates are generated relative to server start time.
 */
export function buildSampleOrders() {
  const specs = [
    {
      id: 'ORD-DEMO4821',
      status: 'Delivered',
      createdAt: daysAgo(9),
      customer: {
        name: 'Layla Hassan',
        email: 'layla.hassan@example.com',
        phone: '+20 100 555 0182',
        address: '12 Nile Corniche, Apt 7',
        city: 'Cairo',
        country: 'Egypt',
        paymentMethod: 'cod',
      },
      lines: [
        ['trailblazer-hiking-backpack', 1],
        ['glowlab-vitamin-c-serum', 2],
      ],
    },
    {
      id: 'ORD-DEMO9173',
      status: 'Shipped',
      createdAt: daysAgo(3),
      customer: {
        name: 'Omar Farouk',
        email: 'omar.farouk@example.com',
        phone: '+971 50 555 0110',
        address: 'Marina Gate 2, Tower B, Apt 1408',
        city: 'Dubai',
        country: 'United Arab Emirates',
        paymentMethod: 'card',
      },
      lines: [
        ['aurora-anc-headphones', 1],
        ['voltedge-65w-gan-charger', 2],
      ],
    },
    {
      id: 'ORD-DEMO1568',
      status: 'Processing',
      createdAt: daysAgo(1),
      customer: {
        name: 'Sara Al-Mansouri',
        email: 'sara.almansouri@example.com',
        phone: '+966 55 555 0143',
        address: 'King Fahd Road, Al Olaya District',
        city: 'Riyadh',
        country: 'Saudi Arabia',
        paymentMethod: 'cod',
      },
      lines: [['brewmaster-pro-espresso', 1]],
    },
  ];

  return specs.map((spec) => {
    const items = spec.lines.map(([id, qty]) => line(id, qty));
    return {
      id: spec.id,
      status: spec.status,
      createdAt: spec.createdAt,
      estimatedDelivery: addDays(spec.createdAt, config.estimatedDeliveryDays),
      customer: spec.customer,
      items,
      ...totals(items),
      currency: config.currency,
      sample: true,
    };
  });
}
