const express = require('express');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { loginValidation, registerUserValidation } = require('../middlewares/validate');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');

const router = express.Router();
router.use(express.json());

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', loginValidation, login);
router.post('/signup', registerUserValidation, createUser);
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Успешный выход' });
});
router.use(auth, () => {
  throw new NotFoundError('Такой страницы не существует');
});

module.exports = router;
