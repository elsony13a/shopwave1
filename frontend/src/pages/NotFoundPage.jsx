import { useNav } from '../context/NavContext.jsx';
import { EmptyState } from '../components/States.jsx';

export default function NotFoundPage() {
  const nav = useNav();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <EmptyState
        icon="🌊"
        title="Page not found"
        description="The page you are looking for drifted away with the wave."
        actionLabel="Back to the storefront"
        onAction={nav.goHome}
      />
    </div>
  );
}
