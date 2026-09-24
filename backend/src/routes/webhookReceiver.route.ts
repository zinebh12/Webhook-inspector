import { Router } from 'express';
import { createRequest } from '../controllers/webhookRequests.controller';

const router = Router();

router.post('/:slug', createRequest);

export default router;