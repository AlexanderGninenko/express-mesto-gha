const express = require('express');
const {
  getAllUsers, getUser, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);
module.exports = router;
