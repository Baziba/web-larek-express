import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/products';
import { validateObjectId, productBodyValidation } from '../helpers/validations';

const router = Router();

router.get('/', getProducts);
router.post('/', productBodyValidation, createProduct);
router.patch('/:id', validateObjectId, productBodyValidation, updateProduct);
router.delete('/:id', validateObjectId, deleteProduct);

export default router;
