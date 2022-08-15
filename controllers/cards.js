/* eslint-disable consistent-return */
/* eslint-disable max-len */
const Card = require('../models/card');

const ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;
const UNFOUND_CODE = 404;

const getCards = (req, res) => {
  Card.find().then((cards) => res.send({ data: cards }))
    .catch((e) => {
      if (e.name === 'CastError') { return res.status(UNFOUND_CODE).send({ message: 'Запрашиваемые карточки не найдены' }); }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: { name: card.name, link: card.link } }))
    .catch((e) => {
      if (e.name === 'ValidationError') { return res.status(ERROR_CODE).send({ message: 'Переданы неверные данные' }); }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  Card.deleteOne({ id: req.params.id }).then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e.name === 'CastError') { return res.status(UNFOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' }); }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((card) => res.send({ data: card }))
  .catch((e) => {
    if (e.name === 'CastError') { return res.status(UNFOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' }); }
    res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((card) => res.send({ data: card }))
  .catch((e) => {
    if (e.name === 'CastError') { return res.status(UNFOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' }); }
    res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка на сервере' });
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
