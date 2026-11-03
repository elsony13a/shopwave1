/** Format an amount as USD currency, e.g. 129.5 -> "$129.50" */
export function money(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(value) || 0);
}

/** Human-friendly date, e.g. "Mon, Oct 30, 2026" */
export function formatDate(value) {
  if (!value) return '';
  const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/** First name from a full name, e.g. "Layla Hassan" -> "Layla" */
export function firstName(fullName = '') {
  return String(fullName).trim().split(/\s+/)[0] || '';
}
