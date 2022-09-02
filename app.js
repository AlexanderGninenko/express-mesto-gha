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

const options = {
  origin: [
    'https://alexandergninenko.nomoredomains.sbs',
    'https://api.alexandergninenko.nomoredomains.sbs',
    'http://localhost:3000',
    'http://localhost:5000',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use(cors());

app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorUniHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
