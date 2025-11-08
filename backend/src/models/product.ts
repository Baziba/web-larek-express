import mongoose from 'mongoose';
import { ERROR } from '../constants';

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
    required: [true, ERROR.REQUIRED_FIELD.replace('%f%', 'title')],
    minlength: [2, ERROR.PRODUCT_TITLE_MIN_LENGTH],
    maxlength: [30, ERROR.PRODUCT_TITLE_MAX_LENGTH],
  },
  image: {
    fileName: {
      type: String,
      required: [true, ERROR.REQUIRED_FIELD.replace('%f%', 'image.fileName')],
    },
    originalName: {
      type: String,
      required: [true, ERROR.REQUIRED_FIELD.replace('%f%', 'image.originalName')],
    },
  },
  category: {
    type: String,
    required: [true, ERROR.REQUIRED_FIELD.replace('%f%', 'category')],

  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
