import { Router } from 'express';
import { setUpReplay } from '../controllers/replay';

const router = Router();

router.post('/request/:id/replay', setUpReplay);

export default router;
