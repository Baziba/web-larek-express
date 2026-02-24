import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';
import HttpCodes from '../helpers/http-codes';
import ErrorMessages from '../helpers/error-messages';

const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  await Product.find()
    .then((products) => res.status(HttpCodes.OK).send({ items: products, total: products.length }))
    .catch((error) => next(error));
};

const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    description, image, title, category, price,
  } = req.body;

  Product.create({
    description, image, title, category, price,
  })
    .then((product) => res.status(HttpCodes.CREATED).send(product))
    .catch((error) => {
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError(ErrorMessages.PRODUCT_DUPLICATE));
      }
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(ErrorMessages.PRODUCT_VALIDATION_ERROR));
      }
      return next(new InternalServerError(ErrorMessages.INTERNAL_SERVER_ERROR));
    });
};

const updateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    .then((product) => {
      if (!product) {
        return next(new NotFoundError(ErrorMessages.PRODUCT_NOT_FOUND));
      }
      return res.status(HttpCodes.OK).send(product);
    })
    .catch((error) => {
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError(ErrorMessages.PRODUCT_DUPLICATE));
      }
      return next(error);
    });
};

const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  Product.findByIdAndDelete(id)
    .then((product) => {
      if (!product) {
        return next(new NotFoundError('Передан не валидный ID товара'));
      }
      return res.status(HttpCodes.OK).send(product);
    })
    .catch((error) => next(error));
};

export {
  getProducts, createProduct, updateProduct, deleteProduct,
};
