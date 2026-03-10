import express from 'express';
import { authUser, registerUser, authGoogle } from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUser);

router.post('/auth', authUser)

router.post('/google', authGoogle)

export default router;