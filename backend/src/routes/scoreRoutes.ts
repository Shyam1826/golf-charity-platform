import express from 'express';
import { addScore, getScores } from '../controllers/scoreController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, addScore);
router.get('/', protect, getScores);

export default router;
