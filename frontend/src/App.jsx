import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { CatalogProvider } from './context/CatalogContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import RouterNavProvider from './nav/RouterNavProvider.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Toasts from './components/Toasts.jsx';

import CatalogPage from './pages/CatalogPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/**
 * Vite host app: real client-side routes powered by react-router.
 * The Next.js preview shell renders the same views via ShopApp.jsx.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CatalogProvider>
          <CartProvider>
            <RouterNavProvider>
              <div className="flex min-h-screen flex-col bg-stone-50">
                <Header />
                <main className="w-full flex-1">
                  <Routes>
                    <Route path="/" element={<CatalogPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order/:id" element={<OrderPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
              <Toasts />
            </RouterNavProvider>
          </CartProvider>
        </CatalogProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
