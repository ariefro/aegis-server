import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import api from './routes/apis';
import { port } from './configs';
import Errors from './constants/errors';

const app = express();

app.use(morgan('common'));

const whitelist = ['http://localhost:3000', 'https://stage-aegis.vercel.app', 'https://lakoste.stoplight.io'];
app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(Errors.NotAllowedByCORS));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use('/api', api);

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
