import { Router } from 'express';
import { createRequest } from '../controllers/webhookRequests';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// router.use(authMiddleware);
router.post('/:id', createRequest);

export default router;
