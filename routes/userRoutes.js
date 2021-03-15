const express = require('express');
const { signup, login } = require('../controllers/authController');
const userController = require('../controllers/userController');
const {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} = userController;
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).put(updateUser);

module.exports = router;
