import express from 'express';  
import {getMe, signup, login, logout , verifyEmail } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/signup', signup);
router.get('/me',protectRoute, getMe); //protectRoute is a middleware to check if user is logged in
router.post('/login', login);
router.post('/logout',protectRoute, logout);
router.post('/verifyEmail', verifyEmail);

export default router;