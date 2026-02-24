import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import BadRequestError from '../errors/bad-request-error';
import config from '../config';
import HttpCodes from '../helpers/http-codes';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { file } = req;

    if (!file) {
      return next(new BadRequestError('Файл не был загружен'));
    }

    const uploadPath = path.join(__dirname, '..', 'public', config.UPLOAD_PATH);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const tempFilePath = file.path;

    await fs.promises.copyFile(tempFilePath, path.join(uploadPath, file.filename));

    return res.status(HttpCodes.OK).send({
      fileName: `/images/${file.filename}`,
      originalName: file.originalname,
    });
  } catch (error) {
    return next(error);
  }
};

export default uploadFile;
