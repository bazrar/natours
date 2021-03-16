const { promisify } = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { createCipher } = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  } = req.body;
  try {
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      passwordChangedAt,
      role,
    });
    // console.log(newUser);
    const token = signToken(newUser._id);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, passwordConfirm } = req.body;
//     const newUser = await User.create({
//       name,
//       email,
//       password,
//       passwordConfirm,
//     });

//     // generate Jwt token
//     let token = signToken(user._id);
//     console.log(token);

//     res.status(200).json({
//       status: 'success',
//       data: {
//         user: newUser,
//       },
//     });
//   } catch (err) {
//     res.status(401).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //1 check if the email and passowrd exists
    if (!email || !password) {
      res.status(400).json({
        status: 'fail',
        message: 'please provide email and password!',
      });
    }

    // check if the user exists and passowrd is correct
    const user = await User.findOne({ email }).select('+password');
    // console.log(user);
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
};

exports.protect = async (req, res, next) => {
  let token;
  let decoded;
  let freshUser;
  // 1 get the token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // console.log(token);
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }

  //2 validate the token (token verification)
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: err,
    });
  }
  //3 check if user still exists
  try {
    freshUser = await User.findById(decoded.id);
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'the token belonging to this user no longer exists',
    });
  }

  //4 chekc if user changed password after the jwt/ token was issued
  // if (freshUser.changedPasswordAfter(decoded.iat)) {
  //   return new AppError(
  //     'user recently changed the password. Please login again'
  //   );
  // }
  req.user = freshUser;
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'forbidden',
      });
    }
    next();
  };
};
