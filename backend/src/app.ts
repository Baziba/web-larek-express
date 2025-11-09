import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import { errors } from 'celebrate';

import router from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import config from './config';
import errorHandler from './middlewares/error-handler';
import ErrorMessages from './helpers/error-messages';

const app = express();
app.use(cors());
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
    console.info(ErrorMessages.DB_CONNECTION, error.message);
  });

app.listen(config.PORT, () => {
  console.info(`listening on port ${config.PORT}`);
});
