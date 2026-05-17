import express from 'express';
import { createProject, getMyProjects, getMarketplace, getPendingProjects, verifyProject, analyzeProject, DeleteProject } from '../controllers/project.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

import multer from 'multer';
import path from 'path';

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const router = express.Router();

// All routes here require being logged in
router.use(protect);

router.post('/', authorize('ngo'), upload.array('images', 5), createProject);
router.get('/my-projects', authorize('ngo'), getMyProjects);
router.get('/marketplace', protect, getMarketplace);
router.get('/pending', authorize('admin'), getPendingProjects);
router.post('/:id/analyze', authorize('admin'), analyzeProject);
router.patch('/:id/verify', authorize('admin'), verifyProject);
router.delete('/:id', authorize('ngo'), DeleteProject);

export default router;
