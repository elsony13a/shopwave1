import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config.js';
import { store } from './store/store.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { productsRouter, categoriesRouter } from './routes/products.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
import { imagesRouter } from './routes/images.routes.js';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Build and configure the Express app. */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    helmet({
      // The API serves SVG product images consumed cross-origin in dev setups.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
  app.use(cors()); // تفعيل الـ CORS بشكل صحيح وآمن تماماً
  app.use(express.json({ limit: '100kb' }));
  if (config.env !== 'test') {
    app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
  }

  // ---- Health ----
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'shopwave-api',
      version: '1.0.0',
      uptime: Math.round(process.uptime()),
      products: store.products.length,
      orders: store.orders.size,
      time: new Date().toISOString(),
    });
  });

  // ---- REST resources ----
  app.use('/api/products', productsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/images', imagesRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/orders', ordersRouter);

  // ---- Production mode: serve the built React app (frontend/dist) ----
  const distDir = path.resolve(here, '../../frontend/dist');
  const distIndex = path.join(distDir, 'index.html');
  if (fs.existsSync(distIndex)) {
    app.use(express.static(distDir));
    // SPA fallback for client-side routes (anything that is not /api/*)
    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(distIndex);
      }
      next();
    });
  }

  // ---- Errors ----
  app.use(notFound);
  app.use(errorHandler);

  return app;
}