import { Express, Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { faker } from '@faker-js/faker';
import config from '../config';
import BadRequestError from '../errors/bad-request-error';
import ErrorMessages from '../helpers/error-messages';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const temporaryPath = path.join(__dirname, '..', 'public', config.UPLOAD_PATH_TEMP);

    if (!fs.existsSync(temporaryPath)) {
      fs.mkdirSync(temporaryPath, { recursive: true });
    }
    cb(null, temporaryPath);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${faker.string.uuid()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new BadRequestError(ErrorMessages.BAD_IMAGE));
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // Ограничение размера файла до 1 МБ
  fileFilter,
});

export default upload;
