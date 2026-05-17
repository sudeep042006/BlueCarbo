import express from 'express';
import { getUsersByRole } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/:role', getUsersByRole);

export default router;