/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
require('dotenv').config();
const cors = require('cors');
const corsOptions = require('./middlewares/cors');
const routes = require('./routes');
const errorUniHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 5000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();

const allowedCors = [
  'https://alexandergninenko.nomoredomains.sbs',
  'https://api.alexandergninenko.nomoredomains.sbs',
  'localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.status(200).send();
  }

  next();
});

// app.use('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorUniHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
