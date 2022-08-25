const express = require('express');
const {
  getAllUsers, getUser, updateProfile, updateAvatar, getMyUser,
} = require('../controllers/users');
const { userProfileValidation, avatarValidation, idValidation } = require('../middlewares/validate');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/me', idValidation, getMyUser);
router.get('/:id', idValidation, getUser);

router.patch('/me', userProfileValidation, updateProfile);
router.patch('/me/avatar', avatarValidation, updateAvatar);
module.exports = router;
