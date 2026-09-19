import { Router } from 'express';
import {
  getEndpoints,
  getSingleEndpoint,
  createEndpoint,
  deleteEndpoint,
  toggleEndpointActivity,
} from '../controllers/endpoints';
import { getRequests, clearRequests } from '../controllers/webhookRequests';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getEndpoints);
router.get('/:id', getSingleEndpoint);
router.post('/', createEndpoint);
router.delete('/:id', deleteEndpoint);
router.patch('/:id', toggleEndpointActivity);
router.get('/:id/requests', getRequests);
router.delete('/:id/requests', clearRequests);

export default router;
