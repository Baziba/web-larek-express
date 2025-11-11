import { Router } from 'express';
import {
  register, login, logout, refreshAccessToken, getCurrentUser,
} from '../controllers/user';
import auth from '../middlewares/auth';
import { userLoginValidation, userRegistrationValidation } from '../helpers/validations';

const router = Router();

router.post('/register', userRegistrationValidation, register);
router.post('/login', userLoginValidation, login);
router.get('/logout', logout);
router.get('/user', auth, getCurrentUser);
router.get('/token', refreshAccessToken);

export default router;
