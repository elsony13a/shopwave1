import { useToast } from '../context/ToastContext.jsx';

const ICONS = {
  success: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m4 12.5 5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 7v6m0 4h.01" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9.5" />
    </svg>
  ),
  info: (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 11v6m0-10h.01" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9.5" />
    </svg>
  ),
};

export default function Toasts() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismiss(toast.id)}
          className={`animate-fade-up pointer-events-auto flex max-w-md items-center gap-2.5 rounded-lg px-4 py-3 text-left text-sm font-medium text-white shadow-xl ${
            toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-800'
          }`}
        >
          {ICONS[toast.type] || ICONS.info}
          <span>{toast.message}</span>
        </button>
      ))}
    </div>
  );
}
