const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res, next) => {
  try {
    const { name, password, passwordConfirm, email } = req.body;
    // var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });
    var token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // console.log(newUser);
    // console.log('################3');
    // console.log(newUser.id);
    // console.log(newUser._id);

    // console.log(token);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};
