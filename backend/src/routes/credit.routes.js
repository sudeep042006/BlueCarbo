import express from 'express';
import { getMyCredits } from '../controllers/credit.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/my-credits', protect, getMyCredits);

export default router;