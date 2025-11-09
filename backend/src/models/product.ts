import mongoose from 'mongoose';
import ErrorMessages from '../helpers/error-messages';

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

export default mongoose.model<IProduct>('product', productSchema);
