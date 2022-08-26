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
        throw new BadRequestError('Переданы неверные данные');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById({ _id: req.params.id })
    .orFail(() => {
      throw new NotFoundError('NotFound');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.id)
          .then((data) => res.send(data));
      } else throw new ForbiddenError('Запрещено');
    })
    .catch(next);
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
  .catch(next);

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError('NotFound');
  })
  .then((card) => res.send({ data: card }))
  .catch(next);

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
