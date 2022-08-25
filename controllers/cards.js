const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find()
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ name: card.name, link: card.link, _id: card._id }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданы неверные данные'));
      }
      next(e);
    });
};

const deleteCard = (req, res, next) => {
  if (req.user._id !== req.params.id) {
    throw new ForbiddenError('Запрещено');
  }
  Card.deleteOne({ _id: req.params.id })
    .orFail(() => {
      throw new NotFoundError('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Введен некорректный идентификатор карточки'));
      }
      next(e);
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError('NotFound');
  })
  .then((card) => res.send({ data: card }))
  .catch((e) => {
    if (e.name === 'CastError') {
      next(new BadRequestError('Введен некорректный идентификатор карточки'));
    }
    next(e);
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError('NotFound');
  })
  .then((card) => res.send({ data: card }))
  .catch((e) => {
    if (e.name === 'CastError') {
      next(new BadRequestError('Введен некорректный идентификатор карточки'));
    }
    next(e);
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
