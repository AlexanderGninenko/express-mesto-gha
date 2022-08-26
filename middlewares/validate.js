const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const urlRegex = /(http:\/\/|https:\/\/)(www)*[a-z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+#*/;

const idValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex),
  }),
});

const userProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex),
  }),
});

module.exports = {
  urlRegex,
  registerUserValidation,
  cardValidation,
  userProfileValidation,
  avatarValidation,
  loginValidation,
  idValidation,
};
