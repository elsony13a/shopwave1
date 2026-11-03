"use client";

import ShopApp from "@/shop/components/ShopApp";

/**
 * ShopWave storefront — preview shell.
 *
 * The real application source lives in /frontend (React + Vite + react-router)
 * and /backend (Node.js + Express REST API). This page renders the exact same
 * shared React components so the sandbox preview on port 3000 shows the real
 * storefront, with /api/* proxied to the Express server by next.config.ts.
 */
export default function Page() {
  return <ShopApp />;
}
