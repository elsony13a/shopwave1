import { money } from '../lib/format.js';

export default function Price({ price, oldPrice, size = 'md' }) {
  const big = size === 'lg' ? 'text-3xl font-bold' : 'text-lg font-bold';
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`${big} text-slate-900`}>{money(price)}</span>
      {oldPrice && oldPrice > price && (
        <span className={`text-stone-400 line-through ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
          {money(oldPrice)}
        </span>
      )}
    </p>
  );
}
