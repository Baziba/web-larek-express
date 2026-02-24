import { celebrate, Joi } from 'celebrate';

const createOrderValidation = celebrate({
  body: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().min(0).required(),
    items: Joi.array().items(Joi.string().allow('')).required(),
  }),
});

const productBodyValidation = celebrate({
  body: Joi.object().keys({
    title: Joi.string().min(2).max(30).required(),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().min(0),
  }),
});

const productUpdateBodyValidation = celebrate({
  body: Joi.object().keys({
    title: Joi.string().min(2).max(30),
    image: Joi.object().keys({
      fileName: Joi.string(),
      originalName: Joi.string(),
    }),
    category: Joi.string(),
    description: Joi.string(),
    price: Joi.number().min(0),
  }),
});

const validateObjectId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const userRegistrationValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Ё-мое'),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

const userLoginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

export {
  createOrderValidation,
  productBodyValidation,
  productUpdateBodyValidation,
  validateObjectId,
  userLoginValidation,
  userRegistrationValidation,
};
