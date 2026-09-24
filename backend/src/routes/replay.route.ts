import { Router } from 'express';
import { setUpReplay } from '../controllers/replay.controller';

const router = Router();

router.post('/:id/replay', setUpReplay);

export default router;
