import { Router } from 'express';
import { createOrder } from '../controllers/order';
import { createOrderValidation } from '../helpers/validation-rules';

const router = Router();

router.post('/', createOrderValidation, createOrder);

export default router;
