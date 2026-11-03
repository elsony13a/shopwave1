import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet } from '../api/client.js';

const CatalogContext = createContext(null);

/**
 * Catalog-wide UI state: the active search query, category filter, sort order
 * and the category list (fetched once). Shared by the Header and CatalogView.
 */
export function CatalogProvider({ children }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('popular');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let alive = true;
    apiGet('/api/categories')
      .then((data) => {
        if (alive && data && Array.isArray(data.categories)) setCategories(data.categories);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(
    () => ({ search, setSearch, category, setCategory, sort, setSort, categories }),
    [search, category, sort, categories]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within a CatalogProvider');
  return ctx;
}
