import { NextFunction, Request, Response } from 'express';
import HttpCodes from '../helpers/http-codes';

const createOrder = (req: Request, res: Response, next: NextFunction) => {
  res.status(HttpCodes.OK).send(req.body);
};

export { createOrder };
