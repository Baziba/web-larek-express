import { ErrorRequestHandler } from 'express';
import HttpCodes from '../helpers/http-codes';
import ErrorMessages from '../helpers/error-messages';

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  const statusCode = err.statusCode || HttpCodes.INTERNAL_SERVER_ERROR;
  const message = statusCode === 500 ? ErrorMessages.INTERNAL_SERVER_ERROR : err.message;
  res.status(statusCode).send({ message });
  next();
};

export default errorHandler;
