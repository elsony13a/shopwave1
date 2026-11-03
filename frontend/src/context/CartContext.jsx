import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/client.js';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext(null);
const CART_ID_KEY = 'shopwave.cartId';

const EMPTY_CART = {
  id: null,
  items: [],
  itemCount: 0,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  currency: 'USD',
  freeShippingThreshold: 35,
};

/** The cart lives server-side; the browser only keeps a stable cart id. */
function getOrCreateCartId() {
  let id = null;
  try {
    id = window.localStorage.getItem(CART_ID_KEY);
  } catch {
    id = null;
  }
  if (!id) {
    id =
      globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `cart-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    try {
      window.localStorage.setItem(CART_ID_KEY, id);
    } catch {
      // private mode — cart simply won't persist across reloads
    }
  }
  return id;
}

export function CartProvider({ children }) {
  const toast = useToast();
  const [cart, setCart] = useState(EMPTY_CART);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const cartIdRef = useRef(null);

  const ensureCartId = () => {
    if (!cartIdRef.current) cartIdRef.current = getOrCreateCartId();
    return cartIdRef.current;
  };

  const refresh = useCallback(async () => {
    const id = ensureCartId();
    try {
      const data = await apiGet(`/api/cart/${id}`);
      setCart(data);
    } catch {
      // backend unreachable on boot — leave the empty local cart in place
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Run a cart mutation, sync the cart state and surface feedback toasts. */
  const mutate = useCallback(
    async (fn, successMessage) => {
      setBusy(true);
      const id = ensureCartId();
      try {
        const data = await fn(id);
        setCart(data);
        if (successMessage) toast.push(successMessage, 'success');
        return true;
      } catch (err) {
        toast.push(err.message || 'Something went wrong', 'error');
        return false;
      } finally {
        setBusy(false);
      }
    },
    [toast]
  );

  const addItem = useCallback(
    (productId, quantity = 1) =>
      mutate((id) => apiPost(`/api/cart/${id}/items`, { productId, quantity }), 'Added to cart'),
    [mutate]
  );

  const updateItem = useCallback(
    (productId, quantity) =>
      mutate((id) => apiPut(`/api/cart/${id}/items/${productId}`, { quantity })),
    [mutate]
  );

  const removeItem = useCallback(
    (productId) => mutate((id) => apiDelete(`/api/cart/${id}/items/${productId}`), 'Removed from cart'),
    [mutate]
  );

  const clearCart = useCallback(
    () => mutate((id) => apiDelete(`/api/cart/${id}`), 'Cart cleared'),
    [mutate]
  );

  const value = useMemo(
    () => ({ cart, ready, busy, refresh, addItem, updateItem, removeItem, clearCart }),
    [cart, ready, busy, refresh, addItem, updateItem, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
