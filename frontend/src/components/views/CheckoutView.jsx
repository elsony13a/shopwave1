import { useState } from 'react';
import { apiUrl, apiPost } from '../../api/client.js';
import { money } from '../../lib/format.js';
import { useNav } from '../../context/NavContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { SkeletonRows } from '../Skeletons.jsx';
import { EmptyState } from '../States.jsx';

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  paymentMethod: 'cod',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Please enter your full name';
  if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Please enter a valid email address';
  if (form.phone.trim().length < 7) errors.phone = 'Please enter a valid phone number';
  if (form.address.trim().length < 5) errors.address = 'Please enter your street address';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.country.trim()) errors.country = 'Country is required';
  return errors;
}

const inputClass = (invalid) =>
  `h-11 w-full rounded-md border bg-white px-3 text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-2 ${
    invalid
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
      : 'border-stone-300 focus:border-amber-500 focus:ring-amber-200'
  }`;

export default function CheckoutView({ onSuccess }) {
  const nav = useNav();
  const { cart, ready, refresh } = useCart();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <SkeletonRows count={2} />
      </div>
    );
  }

  if (cart.items.length === 0 && !submitting) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon="🧾"
          title="Nothing to check out"
          description="Your cart is empty — add a few products first, then come back to complete your order."
          actionLabel="Browse products"
          onAction={nav.goHome}
        />
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setServerError(null);
    try {
      const order = await apiPost('/api/orders', { cartId: cart.id, customer: form });
      await refresh();
      if (onSuccess) onSuccess(order);
    } catch (err) {
      setServerError(err.message || 'Could not place your order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-stone-500">
        Demo store — no real payment is processed and no data leaves this app.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <form onSubmit={submit} noValidate className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-3">
          <h2 className="text-lg font-bold text-slate-900">Delivery details</h2>

          {serverError && (
            <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
              {serverError}
            </div>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">Full name *</label>
              <input id="name" type="text" value={form.name} onChange={set('name')} placeholder="e.g. Layla Hassan" className={inputClass(!!errors.name)} autoComplete="name" />
              {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
              <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={inputClass(!!errors.email)} autoComplete="email" />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">Phone *</label>
              <input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+20 100 000 0000" className={inputClass(!!errors.phone)} autoComplete="tel" />
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700">Street address *</label>
              <input id="address" type="text" value={form.address} onChange={set('address')} placeholder="Building, street, apartment" className={inputClass(!!errors.address)} autoComplete="street-address" />
              {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
            </div>

            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-slate-700">City *</label>
              <input id="city" type="text" value={form.city} onChange={set('city')} placeholder="e.g. Cairo" className={inputClass(!!errors.city)} autoComplete="address-level2" />
              {errors.city && <p className="mt-1 text-xs text-rose-600">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="country" className="mb-1 block text-sm font-medium text-slate-700">Country *</label>
              <input id="country" type="text" value={form.country} onChange={set('country')} placeholder="e.g. Egypt" className={inputClass(!!errors.country)} autoComplete="country-name" />
              {errors.country && <p className="mt-1 text-xs text-rose-600">{errors.country}</p>}
            </div>
          </div>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Payment method</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
            {[
              { value: 'cod', label: 'Cash on Delivery', hint: 'Pay when your order arrives', icon: '💵' },
              { value: 'card', label: 'Card on Delivery', hint: 'Swipe or tap at your door', icon: '💳' },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors ${
                  form.paymentMethod === option.value
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={form.paymentMethod === option.value}
                  onChange={set('paymentMethod')}
                  className="mt-1 h-4 w-4 accent-amber-500"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    <span aria-hidden="true">{option.icon}</span> {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-stone-500">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-amber-400 font-bold text-slate-900 transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                Placing your order…
              </>
            ) : (
              <>Place order · {money(cart.total)}</>
            )}
          </button>
        </form>

        {/* Summary */}
        <aside className="lg:col-span-2" aria-label="Order summary">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-lg font-bold text-slate-900">Your order</h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <span className="relative shrink-0">
                    <img src={apiUrl(item.imageUrl)} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-slate-900 px-1 text-[11px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800">{item.name}</span>
                    <span className="block text-xs text-stone-500">{money(item.price)} each</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-slate-900">{money(item.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 border-t border-stone-200 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Subtotal ({cart.itemCount} items)</dt>
                <dd className="font-medium text-slate-900">{money(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Shipping</dt>
                <dd className={`font-medium ${cart.shipping === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {cart.shipping === 0 ? 'FREE' : money(cart.shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Estimated tax (5%)</dt>
                <dd className="font-medium text-slate-900">{money(cart.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
                <dt className="font-bold text-slate-900">Order total</dt>
                <dd className="font-bold text-slate-900">{money(cart.total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
