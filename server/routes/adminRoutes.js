import express from 'express';
import { 
  getDashboardStats, 
  getAllUsers, 
  getAllOrders, 
  updateOrderStatus 
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin); // Enforce admin check for all operations

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;
