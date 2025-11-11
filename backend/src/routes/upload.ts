import { Router } from 'express';
import file from '../controllers/upload';
import fileUpload from '../middlewares/file';
import auth from '../middlewares/auth';

const router = Router();

router.post('/', auth, fileUpload.single('file'), file);

export default router;
