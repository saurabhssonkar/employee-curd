import { Router } from 'express';
import { login, register } from '../controllers/authController';

const router = Router(); // ✅ Just let TypeScript infer the type

router.post('/login', login);
router.post('/register', register);

export default router;