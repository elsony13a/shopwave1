import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`🛍️  ShopWave API ready on http://localhost:${config.port} (${config.env})`);
  console.log('   Endpoints: /api/products · /api/categories · /api/cart · /api/orders · /api/health');
});
