/** 404 handler for unmatched API routes. */
export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) console.error('[api]', err);
  const payload = { error: err.message || 'Internal Server Error' };
  if (err.details) payload.details = err.details;
  res.status(status).json(payload);
}
