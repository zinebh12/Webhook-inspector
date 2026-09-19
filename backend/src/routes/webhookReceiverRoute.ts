import { Router } from 'express';
import { createRequest } from '../controllers/webhookRequests';

const router = Router();

router.post('/:slug', createRequest);

export default router;