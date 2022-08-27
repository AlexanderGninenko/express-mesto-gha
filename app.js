/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(routes);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
