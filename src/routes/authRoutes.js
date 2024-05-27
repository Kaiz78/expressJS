import express from 'express';
import { register, test, login, logout, verifyAccount, createNewPassword, changePassword } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';



const router = express.Router();

// Stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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




router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
          {
              price_data: {
                  currency: 'usd',
                  product_data: {
                      name: 'T-shirt',
                  },
                  unit_amount: 2000,
              },
              quantity: 1,
          },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
  });

  res.json({ url: session.url });
});




export default router;
