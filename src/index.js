import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import api from './routes/apis';
import { port } from './configs';

const app = express();
const whitelist = ['http://localhost:3000', 'https://stage-aegis.vercel.app'];
app.use(cookieParser());

app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use('/api', api);

app.listen(port, () => {
  console.log(`server running at ${port}`);
});
