import express from 'express';
import { register, test, login, logout, verifyAccount, createNewPassword, changePassword } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/test', test);
router.get('/logout', logout);
router.get('/verify/:token', verifyAccount);
router.post('/create-new-password', createNewPassword);
router.post('/change-password', authMiddleware, changePassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/google/callback', passport.authenticate('google', { session: false }), 
(req, res) => {
  const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  // Sauvegarde du token dans les cookies
  res.cookie('token', token, { httpOnly: true });
  res.redirect(301, `${process.env.CLIENT_URL}`);
});




export default router;
