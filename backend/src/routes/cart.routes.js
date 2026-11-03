import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from '../services/cartService.js';

const cartRouter = Router();

// GET /api/cart/:cartId
cartRouter.get(
  '/:cartId',
  asyncHandler(async (req, res) => {
    res.json(getCart(req.params.cartId));
  })
);

// POST /api/cart/:cartId/items  { productId, quantity }
cartRouter.post(
  '/:cartId/items',
  asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body || {};
    const cart = addItem(req.params.cartId, productId, quantity);
    res.status(201).json(cart);
  })
);

// PUT /api/cart/:cartId/items/:productId  { quantity }
cartRouter.put(
  '/:cartId/items/:productId',
  asyncHandler(async (req, res) => {
    const { quantity } = req.body || {};
    const cart = updateItem(req.params.cartId, req.params.productId, quantity);
    res.json(cart);
  })
);

// DELETE /api/cart/:cartId/items/:productId
cartRouter.delete(
  '/:cartId/items/:productId',
  asyncHandler(async (req, res) => {
    const cart = removeItem(req.params.cartId, req.params.productId);
    res.json(cart);
  })
);

// DELETE /api/cart/:cartId — clear the cart
cartRouter.delete(
  '/:cartId',
  asyncHandler(async (req, res) => {
    const cart = clearCart(req.params.cartId);
    res.json(cart);
  })
);

export { cartRouter };
