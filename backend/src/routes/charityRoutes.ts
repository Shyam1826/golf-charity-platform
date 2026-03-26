import express from 'express';
import { getCharities } from '../controllers/charityController';

const router = express.Router();

router.get('/', getCharities);

export default router;
