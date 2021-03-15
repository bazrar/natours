const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    // generate Jwt token
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        status: 'fail',
        message: 'please provide email and password!',
      });
    }

    // check if the user exists and passowrd is correct
    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    const bool = await user.correctPassword(password, user.password);
    // console.log(bool);

    if (user && !bool) {
      return res.status(401).json({
        status: 'fail',
        message: 'incorrect email or password',
      });
    }
    //if everything is ok, issue token to the client
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err,
    });
  }
  //1 check if the email and passowrd exists
};
