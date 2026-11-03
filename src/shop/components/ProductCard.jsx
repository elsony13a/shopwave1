import { apiUrl } from '../api/client.js';
import { useNav } from '../context/NavContext.jsx';
import Rating from './Rating.jsx';
import Price from './Price.jsx';
import AddToCartButton from './AddToCartButton.jsx';

export default function ProductCard({ product }) {
  const nav = useNav();
  const open = () => nav.openProduct(product.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-shadow hover:shadow-lg">
      <button
        type="button"
        onClick={open}
        className="relative block aspect-square w-full overflow-hidden"
        aria-label={`View ${product.name}`}
      >
        <img
          src={apiUrl(product.imageUrl)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-2 top-2 rounded bg-amber-400 px-2 py-0.5 text-[11px] font-bold text-slate-900">
            {product.badge}
          </span>
        )}
        {product.discountPct > 0 && (
          <span className="absolute right-2 top-2 rounded bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white">
            -{product.discountPct}%
          </span>
        )}
        {product.stock <= 10 && (
          <span className="absolute bottom-2 left-2 rounded bg-slate-900/80 px-2 py-0.5 text-[11px] font-medium text-white">
            Only {product.stock} left
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">{product.brand}</p>
        <button
          type="button"
          onClick={open}
          className="line-clamp-2 text-left text-sm font-medium text-slate-800 hover:text-amber-600"
        >
          {product.name}
        </button>
        <Rating value={product.rating} reviews={product.reviews} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price price={product.price} oldPrice={product.oldPrice} />
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}
