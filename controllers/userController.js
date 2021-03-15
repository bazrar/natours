const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
  // res.status(200).json({
  //   success: 'true',
  //   message: 'this is the route you wished for'
  // })
  try {
    const user = await User.find();

    res.status(200).json({
      status: 'success',
      length: user.length,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
