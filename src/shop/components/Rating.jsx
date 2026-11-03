export default function Rating({ value = 0, reviews = 0, size = 'sm' }) {
  const full = Math.round(value);
  const dim = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';

  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Rated ${value} out of 5 from ${reviews.toLocaleString()} reviews`}
    >
      <div className="flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} viewBox="0 0 20 20" className={`${dim} ${i < full ? 'fill-amber-400' : 'fill-stone-300'}`}>
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
          </svg>
        ))}
      </div>
      <span className={`text-stone-500 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
        {Number(value).toFixed(1)}
        {reviews > 0 && ` (${reviews.toLocaleString()})`}
      </span>
    </div>
  );
}
