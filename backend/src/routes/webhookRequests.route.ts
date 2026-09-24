import { Router } from 'express';
import { getSingleRequest, deleteRequest } from '../controllers/webhookRequests.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/:id', getSingleRequest);
router.delete('/:id', deleteRequest);

export default router;
