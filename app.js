/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { loginValidation, registerUserValidation } = require('./middlewares/validate');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.post('/signin', loginValidation, login);
app.post('/signup', registerUserValidation, createUser);
app.use(() => {
  throw new NotFoundError('Такой страницы не существует');
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
