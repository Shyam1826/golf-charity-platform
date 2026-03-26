import express from 'express';
import { getAllUsers, runDraw } from '../controllers/adminController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);
router.post('/draws/run', protect, adminOnly, runDraw);

export default router;
