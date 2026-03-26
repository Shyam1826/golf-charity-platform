import express from 'express';
import { createSubscription, getSubscriptionStatus } from '../controllers/subscriptionController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createSubscription);
router.get('/status', protect, getSubscriptionStatus);

export default router;
