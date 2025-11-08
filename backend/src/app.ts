import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { ERROR } from './constants';
import router from './routes';

const { PORT = 3000 } = process.env;
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.use(errors());

app.use(express.static(path.join(__dirname, './public')));

mongoose.connect(DB_ADDRESS).then(() => {
  app.listen(PORT, () => {
    console.info(`listening on port ${PORT}`);
  });
}).catch((error) => {
  console.info(ERROR.DB_CONNECTION, error.message);
});
