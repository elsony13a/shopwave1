import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Optional API base override for split deployments:
// set VITE_API_BASE in .env and expose it here if you ever host the API
// on a different origin than the SPA.
globalThis.__API_BASE__ = globalThis.__API_BASE__ || (import.meta.env?.VITE_API_BASE ?? '');

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
