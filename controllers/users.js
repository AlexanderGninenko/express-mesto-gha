/* eslint-disable consistent-return */
const User = require('../models/user');

const ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;
const UNFOUND_CODE = 404;

const getAllUsers = (req, res) => {
  User.find({}).then((users) => res.json({ data: users }))
    .catch((e) => {
      if (e.name === 'CastError') { return res.status(UNFOUND_CODE).send({ message: 'Запрашиваемые карточки не найдены' }); }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id).then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'CastError') { return res.status(UNFOUND_CODE).send({ message: 'Запрашиваемый пользователь не найден' }); }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') { return res.status(ERROR_CODE).send({ message: 'Переданы неверные данные' }); }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.updateOne({ _id, name, about }).then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') { return res.status(ERROR_CODE).send({ message: 'Переданы неверные данные' }); }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.updateOne({ _id, avatar }).then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.name === 'ValidationError') { return res.status(ERROR_CODE).send({ message: 'Переданы неверные данные' }); }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};
