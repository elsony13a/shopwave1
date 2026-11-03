import { findProduct } from '../data/products.js';
import { httpError } from '../utils/helpers.js';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a deterministic gradient SVG "product photo" for the seeded catalog.
 * Keeps the demo fully self-contained (no external image CDNs needed).
 */
export function productSvg(p) {
  const [c1, c2] = p.colors || ['#334155', '#64748b'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="${escapeXml(p.name)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <rect width="800" height="800" fill="url(#glow)"/>
  <circle cx="400" cy="345" r="230" fill="#ffffff" opacity="0.10"/>
  <circle cx="400" cy="345" r="165" fill="#ffffff" opacity="0.14"/>
  <text x="400" y="425" font-size="210" text-anchor="middle" dominant-baseline="middle">${p.emoji}</text>
  <text x="400" y="705" font-size="34" fill="#ffffff" opacity="0.92" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-weight="600" letter-spacing="6">${escapeXml(p.brand.toUpperCase())}</text>
</svg>`;
}

/** GET /api/images/:id.svg */
export function getImage(id) {
  const filename = id.endsWith('.svg') ? id : `${id}.svg`;
  const productId = filename.replace(/\.svg$/i, '');
  const product = findProduct(productId);
  if (!product) throw httpError(404, `Image for product "${productId}" not found`);
  return { svg: productSvg(product), productId };
}
