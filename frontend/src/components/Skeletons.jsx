/** Loading skeletons shared by catalog, cart and orders views. */

export function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div className="aspect-square w-full animate-pulse bg-stone-200" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-full animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-stone-200" />
        <div className="mt-2 flex items-center justify-between">
          <div className="h-6 w-20 animate-pulse rounded bg-stone-200" />
          <div className="h-9 w-24 animate-pulse rounded-md bg-stone-200" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonRows({ count = 3 }) {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl border border-stone-200 bg-white p-4">
          <div className="h-20 w-20 shrink-0 animate-pulse rounded-lg bg-stone-200" />
          <div className="flex flex-1 flex-col gap-2 py-1">
            <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-stone-200" />
            <div className="mt-auto h-4 w-24 animate-pulse rounded bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ className = 'h-8 w-8' }) {
  return (
    <svg className={`animate-spin text-amber-500 ${className}`} viewBox="0 0 24 24" fill="none" role="status" aria-label="Loading">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function FullPageSpinner() {
  return (
    <div className="grid place-items-center py-24" role="status" aria-label="Loading">
      <Spinner className="h-10 w-10" />
    </div>
  );
}
