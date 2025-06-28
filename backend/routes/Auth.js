import express from 'express';
import { createUser, loginUser, checkAuth, resetPasswordRequest, resetPassword, logout } from '../controller/Auth.js';

const router = express.Router();

//  /auth is already added in base path
router.post('/signup', createUser)
  .post('/login', loginUser)
  .get('/check', checkAuth)
  .get('/logout', logout)
  .post('/reset-password-request', resetPasswordRequest)
  .post('/reset-password', resetPassword);

export { router };
