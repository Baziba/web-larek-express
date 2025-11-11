import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import HttpCodes from '../helpers/http-codes';
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      payment, email, phone, address, total, items,
    } = req.body;

    if (!payment || !email || !phone || !address || !total || !items?.length) {
      return next(new BadRequestError('Обязательные поля не заполнены'));
    }

    if (!['card', 'online'].includes(payment)) {
      return next(new BadRequestError('Способ оплаты неверный'));
    }

    const products = await Product.find({ _id: { $in: items } });
    if (products.length !== items.length) {
      return next(new BadRequestError(`Товар с id ${items[0]} не найден`));
    }

    const totalFromDB = products.reduce((sum, p) => sum + (p.price ?? 0), 0);
    if (totalFromDB !== total) {
      return next(new BadRequestError('Сумма заказа неверная'));
    }

    const orderId = faker.string.uuid();

    return res.status(HttpCodes.CREATED).send({
      id: orderId,
      total,
    });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
