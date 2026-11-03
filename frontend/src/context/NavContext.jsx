import { createContext, useContext } from 'react';

/**
 * Host-agnostic navigation contract used by every shared component.
 *
 * - In the Vite app it is implemented with react-router (src/nav/RouterNavProvider.jsx)
 * - In the Next.js preview shell it is implemented with view state (ShopApp.jsx)
 */
export const NavContext = createContext(null);

export function useNav() {
  const nav = useContext(NavContext);
  if (!nav) throw new Error('useNav must be used within a NavContext.Provider');
  return nav;
}
