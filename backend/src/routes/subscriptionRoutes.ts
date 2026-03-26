import express from 'express';
import { createSubscription, getSubscriptionStatus, cancelSubscription } from '../controllers/subscriptionController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createSubscription);
router.get('/status', protect, getSubscriptionStatus);
router.delete('/cancel', protect, cancelSubscription);

export default router;
