import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

/** "Add to cart" button with a per-button busy state. */
export default function AddToCartButton({ product, quantity = 1, size = 'sm', full = false }) {
  const { addItem } = useCart();
  const [pending, setPending] = useState(false);

  const dim =
    size === 'lg'
      ? 'h-12 px-6 text-base'
      : size === 'md'
        ? 'h-11 px-5 text-sm'
        : 'h-9 px-3 text-xs sm:text-sm';

  const onClick = async () => {
    setPending(true);
    try {
      await addItem(product.id, quantity);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-amber-400 font-semibold text-slate-900 shadow-sm transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${dim} ${full ? 'w-full' : ''}`}
      aria-label={`Add ${product.name} to cart`}
    >
      {pending ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      Add to cart
    </button>
  );
}
