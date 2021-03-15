const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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
    var token = signToken(newUser._id);

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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1 check if email and passowrd acutally exists
    if (!email || !password) {
      res.status(404).json({
        status: 'fail',
        message: 'please provide email and password',
      });
    }
    // 2 check if the user exists and the password is correct

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(401).json({
        status: 'fail',
        message: 'incorrect email or password',
      });
    }
    /// 3 if everything is ok send token to client
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.protect = (req, res, next) => {
  //1 getting token  and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('you are not logged in!');
    error.status = 'fail';
    error.statusCode = 401;
    return next(error);
  }
  //2 validate token

  //3 chekc if user still exists

  //4 check if user changed passowrd after JWT was issued
  next();
};
