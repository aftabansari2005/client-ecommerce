import express from 'express';
import { fetchUserById, updateUser } from '../controller/User.js';

const router = express.Router();
//  /users is already added in base path
router.get('/own', fetchUserById)
      .patch('/:id', updateUser)

export { router };
