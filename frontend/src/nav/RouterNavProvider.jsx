import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavContext } from '../context/NavContext.jsx';

/**
 * Vite-app implementation of the shared navigation contract,
 * backed by react-router.
 */
export default function RouterNavProvider({ children }) {
  const navigate = useNavigate();

  const nav = useMemo(
    () => ({
      goHome: () => navigate('/'),
      openProduct: (id) => navigate(`/product/${id}`),
      goCart: () => navigate('/cart'),
      goCheckout: () => navigate('/checkout'),
      goOrders: () => navigate('/orders'),
      showOrder: (id) => navigate(`/order/${id}`),
    }),
    [navigate]
  );

  return <NavContext.Provider value={nav}>{children}</NavContext.Provider>;
}
