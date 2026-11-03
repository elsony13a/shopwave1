import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getImage } from '../services/imageService.js';

const imagesRouter = Router();

// GET /api/images/:productId.svg — generated SVG product artwork
imagesRouter.get(
  '/:file',
  asyncHandler(async (req, res) => {
    const { svg } = getImage(req.params.file);
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(svg);
  })
);

export { imagesRouter };
