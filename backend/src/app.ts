import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import { errors } from 'celebrate';

import cookieParser from 'cookie-parser';
import router from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import config from './config';
import errorHandler from './middlewares/error-handler';
import ErrorMessages from './helpers/error-messages';

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-CSRF-Token'],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(requestLogger);

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.use(express.static(path.join(__dirname, './public')));

mongoose.connect(config.DB_ADDRESS)
  .catch((error) => {
    errorLogger.error(ErrorMessages.DB_CONNECTION, error.message);
  });

app.listen(config.PORT);
