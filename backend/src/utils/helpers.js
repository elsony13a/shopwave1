/** Money helpers — all amounts are kept to 2 decimals to avoid float drift. */
export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/** HTTP error with a status code (and optional field-level details). */
export function httpError(status, message, details) {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
}
