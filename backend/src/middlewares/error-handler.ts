import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';
import ErrorMessages from '../helpers/error-messages';
import HttpCodes from '../helpers/http-codes';

interface CustomError extends Error {
  statusCode: number;
}

const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = HttpCodes.INTERNAL_SERVER_ERROR;
  let message = ErrorMessages.INTERNAL_SERVER_ERROR;

  if (
    err instanceof BadRequestError
    || err instanceof ConflictError
    || err instanceof InternalServerError
    || err instanceof NotFoundError
  ) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({ message });
  next();
};

export default errorHandler;
