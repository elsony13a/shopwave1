import { useMemo, useState } from 'react';
import { NavContext } from '../context/NavContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import { CatalogProvider } from '../context/CatalogContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Toasts from './Toasts.jsx';
import CatalogView from './views/CatalogView.jsx';
import ProductDetailView from './views/ProductDetailView.jsx';
import CartView from './views/CartView.jsx';
import CheckoutView from './views/CheckoutView.jsx';
import OrderView from './views/OrderView.jsx';
import OrdersView from './views/OrdersView.jsx';

/**
 * Single-page host used by the Next.js preview shell (which exposes only the
 * `/` route). It renders the exact same shared views as the Vite app, driving
 * navigation with view state instead of react-router.
 *
 * (Not used by the Vite build — see src/App.jsx there.)
 */
export default function ShopApp() {
  const [view, setView] = useState('catalog'); // catalog | product | cart | checkout | order | orders
  const [productId, setProductId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const nav = useMemo(
    () => ({
      goHome: () => setView('catalog'),
      openProduct: (id) => {
        setProductId(id);
        setView('product');
        window.scrollTo({ top: 0 });
      },
      goCart: () => {
        setView('cart');
        window.scrollTo({ top: 0 });
      },
      goCheckout: () => {
        setView('checkout');
        window.scrollTo({ top: 0 });
      },
      goOrders: () => {
        setView('orders');
        window.scrollTo({ top: 0 });
      },
      showOrder: (id) => {
        setOrderId(id);
        setView('order');
        window.scrollTo({ top: 0 });
      },
    }),
    []
  );

  let content = null;
  switch (view) {
    case 'product':
      content = productId ? <ProductDetailView id={productId} /> : <CatalogView />;
      break;
    case 'cart':
      content = <CartView />;
      break;
    case 'checkout':
      content = <CheckoutView onSuccess={(order) => nav.showOrder(order.id)} />;
      break;
    case 'order':
      content = orderId ? <OrderView id={orderId} /> : <OrdersView />;
      break;
    case 'orders':
      content = <OrdersView />;
      break;
    default:
      content = <CatalogView />;
  }

  return (
    <ToastProvider>
      <CatalogProvider>
        <CartProvider>
          <NavContext.Provider value={nav}>
            <div className="flex min-h-screen flex-col bg-stone-50">
              <Header />
              <main className="w-full flex-1">{content}</main>
              <Footer />
            </div>
            <Toasts />
          </NavContext.Provider>
        </CartProvider>
      </CatalogProvider>
    </ToastProvider>
  );
}
