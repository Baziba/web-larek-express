import { Router } from 'express';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
} from '../controllers/products';
import { validateObjectId, productBodyValidation, productUpdateBodyValidation } from '../helpers/validations';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);
router.post('/', auth, productBodyValidation, createProduct);
router.patch('/:id', auth, validateObjectId, productUpdateBodyValidation, updateProduct);
router.delete('/:id', auth, validateObjectId, deleteProduct);

export default router;
