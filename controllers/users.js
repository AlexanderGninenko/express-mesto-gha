const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ token, user });
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  User.find({}).then((users) => res.json({ data: users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Введен некорректный идентификатор пользователя'));
      }
      next(e);
    });
};

const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Введен некорректный идентификатор пользователя'));
      }
      next(e);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // if (!validator.isEmail(email)) {
  //   throw new UnauthorizedError('Wrong email');
  // }
  bcrypt.hash(password, 7).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    }).then((user) => res.send({ data: user }))
      .catch((e) => {
        if (e.name === 'ValidationError') {
          next(new BadRequestError('Переданы неверные данные'));
        } else if (e.code === 11000) {
          next(new ConflictError('Такой пользователь уже существует'));
        }
        next(e);
      });
  });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданы неверные данные'));
      }
      next(e);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданы неверные данные'));
      }
      next(e);
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getMyUser,
};
