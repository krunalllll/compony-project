import express from 'express';
import { createOrder, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure checkout & history

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

export default router;
