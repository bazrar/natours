const express = require('express');
const userController = require('../controllers/userController');
const {
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} = userController;
const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).put(updateUser);

module.exports = router;
