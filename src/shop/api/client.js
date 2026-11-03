/**
 * Tiny fetch wrapper for the ShopWave REST API.
 *
 * All paths are relative (e.g. `/api/products`):
 *  - Vite dev server proxies them to the Express API (vite.config.js)
 *  - In production the Express server serves the built SPA on the same origin
 *
 * For a split deployment set `globalThis.__API_BASE__` (e.g. from
 * `import.meta.env.VITE_API_BASE`) BEFORE this module is used.
 */
export function apiUrl(path) {
  return (globalThis.__API_BASE__ || '') + path;
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(apiUrl(path), {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (err) {
    // Let aborted requests (React StrictMode double-effects, stale fetches)
    // propagate untouched so callers can ignore them.
    if (err && err.name === 'AbortError') throw err;
    throw new Error('Cannot reach the shop server. Please check your connection and try again.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response body
  }

  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    if (data && data.details) err.details = data.details;
    throw err;
  }
  return data;
}

export const apiGet = (path, options) => request(path, options);
export const apiPost = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) });
export const apiDelete = (path) => request(path, { method: 'DELETE' });
