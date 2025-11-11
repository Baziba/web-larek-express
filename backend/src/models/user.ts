import mongoose from 'mongoose';
import validator from 'validator';
import ErrorMessages from '../helpers/error-messages';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  tokens: Array<{ token: string }>;
}

const userSchema = new mongoose.Schema<IUser, IUser>({
  name: {
    type: String,
    minlength: [2, ErrorMessages.USER_NAME_MIN_LENGTH],
    maxlength: [30, ErrorMessages.USER_NAME_MAX_LENGTH],
    default: 'Ё-мое',
  },
  email: {
    type: String,
    required: [true, ErrorMessages.REQUIRED_FIELD],
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: [true, ErrorMessages.REQUIRED_FIELD],
    minlength: [6, ErrorMessages.USER_PASSWORD_MIN_LENGTH],
    select: false,
  },
  tokens: [{
    token: {
      type: String,
      required: [true, ErrorMessages.REQUIRED_FIELD],
    },
  }],
});

export default mongoose.model<IUser>('user', userSchema);
