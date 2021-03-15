const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} = userController;

const { signUp, login } = authController;

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).put(updateUser);
router.post('/signup', signUp);
router.post('/login', login);

module.exports = router;
