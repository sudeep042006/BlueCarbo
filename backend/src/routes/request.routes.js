import express from 'express';
import { sendRequest, getIncomingRequests, getSentRequests, updateRequestStatus } from '../controllers/request.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);

// Corporate creates a request
router.post('/', authorize('corporate'), sendRequest);

// Corporate views their sent requests
router.get('/sent', authorize('corporate'), getSentRequests);

// NGO views their incoming requests
router.get('/incoming', authorize('ngo'), getIncomingRequests);

// NGO updates request status
router.patch('/:id/status', authorize('ngo'), updateRequestStatus);

export default router;