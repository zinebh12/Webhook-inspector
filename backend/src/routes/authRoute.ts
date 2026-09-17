import { Router } from 'express';
import { registerAuth, loginAuth, getCurrentUser, logout } from '../controllers/auth';
import { authMiddleware } from '../middleware/authMiddleware';
const router = Router();

router.post('/register', registerAuth);
router.post('/login', loginAuth);
router.post('/logout', logout);
router.get('/user', authMiddleware, getCurrentUser);

export default router;
