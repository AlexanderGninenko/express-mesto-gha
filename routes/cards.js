const express = require('express');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardValidation, idValidation } = require('../middlewares/validate');

const router = express.Router();

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.put('/likes/:id', idValidation, likeCard);
router.delete('/likes/:id', idValidation, dislikeCard);
router.delete('/:id', idValidation, deleteCard);

module.exports = router;
