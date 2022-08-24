import express from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ status: 'hello world' });
});

app.listen(3000, () => console.log('Express started at http://localhost:3000'));
