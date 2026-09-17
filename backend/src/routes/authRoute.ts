import { Router } from 'express';
import { registerAuth, loginAuth, getCurrentUser, logout } from '../controllers/auth';
import { authMiddleware } from '../middleware/authMiddleware';
const router = Router();

router.post('/register', registerAuth);
router.post('/login', loginAuth);
router.post('/logout', logout);
router.post('/user', authMiddleware, getCurrentUser);

export default router;
