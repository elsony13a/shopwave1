import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listProducts, getProduct } from '../services/productService.js';
import { categories } from '../data/products.js';

const productsRouter = Router();

// GET /api/products?category=&search=&sort=&page=&limit=
productsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(listProducts(req.query));
  })
);

// GET /api/products/:id
productsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(getProduct(req.params.id));
  })
);

const categoriesRouter = Router();

// GET /api/categories
categoriesRouter.get('/', (_req, res) => {
  res.json({
    categories: categories.map((name) => ({ name })),
  });
});

export { productsRouter, categoriesRouter };
