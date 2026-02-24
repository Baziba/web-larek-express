import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import User, { IUser } from '../models/user';
import ConflictError from '../errors/conflict-error';
import HttpCodes from '../helpers/http-codes';
import ErrorMessages from '../helpers/error-messages';
import UnauthorizedError from '../errors/unauthorized-error';
import NotFoundError from '../errors/not-found-error';

const generateToken = (user: IUser, isAccessToken: boolean = true) => jwt.sign(
  { _id: user._id },
  config.JWT_SECRET,
  {
    expiresIn:
      (isAccessToken
        ? config.AUTH_ACCESS_TOKEN_EXPIRY : config.AUTH_REFRESH_TOKEN_EXPIRY) as any,
  },
);

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ name, email, password: hashedPassword })
    .then(async (user) => {
      const accessToken = generateToken(user);
      const refreshToken = generateToken(user, false);

      /* Записываю токен в базу */
      await User.findByIdAndUpdate(user._id, {
        $push: { tokens: { token: refreshToken } },
      });

      /* Записываю токен в cookie */
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      const userResponse = {
        user: {
          email: user.email,
          name: user.name,
        },
        success: true,
        accessToken,
      };

      return res.status(HttpCodes.CREATED).send(userResponse);
    }).catch((error) => {
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError(ErrorMessages.USER_DUPLICATE));
      }
      return next(error);
    });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  await User.findOne({ email }).select('+password')
    .then(async (user) => {
      if (!user) {
        return next(new UnauthorizedError(ErrorMessages.WRONG_MAIL_OR_PASSWORD));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new UnauthorizedError(ErrorMessages.WRONG_MAIL_OR_PASSWORD));
      }

      const accessToken = generateToken(user);
      const refreshToken = generateToken(user, false);

      /* Записываю токен в базу */
      await User.findByIdAndUpdate(user._id, {
        $push: { tokens: { token: refreshToken } },
      });

      /* Записываю токен в cookie */
      res.cookie(
        'refreshToken',
        refreshToken,
        {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: '/',
        },
      );

      const userResponse = {
        user: {
          email: user.email,
          name: user.name,
        },
        success: true,
        accessToken,
      };

      return res.status(HttpCodes.CREATED).send(userResponse);
    }).catch((error) => {
      if (error instanceof Error) {
        return next(new UnauthorizedError(error.message));
      }
      return next(error);
    });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new UnauthorizedError('Пользователь не авторизован'));
  }

  const payload = jwt.verify(refreshToken, config.JWT_SECRET) as { _id: string };

  return User.findByIdAndUpdate(
    payload._id,
    { $pull: { tokens: { token: refreshToken } } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError(ErrorMessages.USER_NOT_FOUND));
      }

      res.clearCookie('refreshToken');

      return res
        .status(HttpCodes.OK)
        .send({
          success: true,
        });
    }).catch((error) => next(error));
};

const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new UnauthorizedError('Refresh токен не найден'));
  }

  const payload = jwt.verify(refreshToken, config.JWT_SECRET) as { _id: string };

  return User.findOne({ _id: payload._id, 'tokens.token': refreshToken })
    .then(async (user) => {
      if (!user) {
        return next(new NotFoundError(ErrorMessages.USER_NOT_FOUND));
      }

      const tokenExists = user.tokens.some((t) => t.token === refreshToken);

      if (!tokenExists) {
        return next(new UnauthorizedError(ErrorMessages.USER_TOKEN_EXPIRED));
      }

      const accessToken = generateToken(user);
      const newRefreshToken = generateToken(user, false);

      await User.findByIdAndUpdate(user._id, {
        $push: { tokens: { token: newRefreshToken } },
      });

      res.cookie(
        'refreshToken',
        newRefreshToken,
        {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: '/',
        },
      );

      const userResponse = {
        user: {
          email: user.email,
          name: user.name,
        },
        success: true,
        accessToken,
      };

      return res.status(HttpCodes.CREATED).send(userResponse);
    })
    .catch((error) => next(error));
};

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new UnauthorizedError('Ошибка авторизации'));
  }

  const refreshToken = authorization.replace('Bearer ', '');
  const payload = jwt.verify(refreshToken, config.JWT_SECRET) as { _id: string };

  return User.findById(payload._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(ErrorMessages.USER_NOT_FOUND));
      }

      const userResponse = {
        user: {
          email: user.email,
          name: user.name,
        },
        success: true,
      };

      return res.status(HttpCodes.OK).send(userResponse);
    }).catch((error) => {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return next(new UnauthorizedError('Invalid or expired token'));
      }

      return next(error);
    });
};

export {
  register, login, logout, refreshAccessToken, getCurrentUser,
};
