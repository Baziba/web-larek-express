import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import ErrorMessages from '../helpers/error-messages';
import { errorLogger } from '../middlewares/logger';

interface IProduct {
  title: string;
  image: {
    fileName: string;
    originalName: string;
  };
  category: string;
  description: string;
  price: number | null;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    unique: true,
    required: [true, ErrorMessages.REQUIRED_FIELD.replace('%f%', 'title')],
    minlength: [2, ErrorMessages.PRODUCT_TITLE_MIN_LENGTH],
    maxlength: [30, ErrorMessages.PRODUCT_TITLE_MAX_LENGTH],
  },
  image: {
    fileName: {
      type: String,
      required: [true, ErrorMessages.REQUIRED_FIELD.replace('%f%', 'image.fileName')],
    },
    originalName: {
      type: String,
      required: [true, ErrorMessages.REQUIRED_FIELD.replace('%f%', 'image.originalName')],
    },
  },
  category: {
    type: String,
    required: [true, ErrorMessages.REQUIRED_FIELD.replace('%f%', 'category')],

  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

productSchema.post('findOneAndDelete', async (product) => {
  if (product && product.image && product.image.fileName) {
    const imagePath = path.join(__dirname, '..', 'public', product.image.fileName);

    fs.unlink(imagePath, (err) => {
      if (err) {
        errorLogger.error(`Ошибка при удалении файла изображения: ${err}`);
      } else {
        errorLogger.error(`Файл изображения успешно удален: ${imagePath}`);
      }
    });
  }
});

export default mongoose.model<IProduct>('product', productSchema);
