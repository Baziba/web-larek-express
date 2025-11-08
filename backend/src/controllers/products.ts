import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import { ERROR, HTTP_STATUS } from '../constants';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';

const getProducts = (_req: Request, res: Response, next: NextFunction) => {
  Product.find()
    .then((products) => {
      res.status(HTTP_STATUS.OK)
        .json({
          items: products,
          total: products.length,
        });
    })
    .catch((error) => {
      next(error);
    });
};

const createProduct = (req: Request, res: Response, next: NextFunction) => {
  Product.create(req.body)
    .then((product) => res.status(HTTP_STATUS.CREATED).send({ _id: product.id }))
    .catch((error) => {
      if (error && (error).code === 11000) {
        return next(new ConflictError(ERROR.PRODUCT_DUPLICATE));
      }
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(ERROR.INVALID_DATA));
      }
      return next(new InternalServerError(ERROR.INTERNAL_SERVER_ERROR));
    });
};

const updateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true },)
    .then((product) => {
      if (!product) {
        next(new NotFoundError(ERROR.PRODUCT_NOT_FOUND));
        return;
      }
      res.status(HTTP_STATUS.OK).json({ item: product });
    })
    .catch((error) => {
      if (error && (error).code === 11000) {
        next(new ConflictError(ERROR.PRODUCT_DUPLICATE));
        return;
      }
      next(error);
    });
};

const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  Product.findByIdAndDelete(id)
    .then((product) => {
      if (!product) {
        next(new NotFoundError(ERROR.PRODUCT_NOT_FOUND));
        return;
      }
      res.status(HTTP_STATUS.OK).json({ item: product });
    })
    .catch((error) => {
      next(error);
    });
};

export { getProducts, createProduct, updateProduct, deleteProduct };
