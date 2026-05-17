import express from 'express';
import { getPendingProjects, approveProject, getStats, getFinancialStats } from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

// All routes here are restricted to Admin
router.use(protect);
router.use(authorize('admin'));

router.get('/pending-projects', getPendingProjects);
router.put('/projects/:id/approve', approveProject);
router.get('/stats', getStats);
router.get('/finance', getFinancialStats);

export default router;