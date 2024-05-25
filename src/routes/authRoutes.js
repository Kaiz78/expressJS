import express from 'express';
import { register, test, login, logout, verifyAccount, createNewPassword, changePassword } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/test', test);
router.get('/logout', logout);
router.get('/verify/:token', verifyAccount);
router.post('/create-new-password', createNewPassword);
router.post('/change-password', authMiddleware, changePassword);

export default router;
