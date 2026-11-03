/** Empty / error states shared across views. */

export function EmptyState({ icon = '🛒', title, description, actionLabel, onAction }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center shadow-sm">
      <span className="text-5xl" aria-hidden="true">{icon}</span>
      <h2 className="mt-4 text-xl font-bold text-slate-900">{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-stone-500">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex h-11 items-center rounded-md bg-amber-400 px-6 font-semibold text-slate-900 transition-colors hover:bg-amber-300"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-rose-200 bg-rose-50 px-6 py-14 text-center">
      <span className="text-5xl" aria-hidden="true">⚠️</span>
      <h2 className="mt-4 text-xl font-bold text-rose-900">Something went wrong</h2>
      <p className="mt-2 text-sm leading-relaxed text-rose-700">{message || 'Please try again.'}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-11 items-center rounded-md bg-rose-600 px-6 font-semibold text-white transition-colors hover:bg-rose-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}
