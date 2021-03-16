const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'enter your name'],
  },
  email: {
    type: String,
    required: [true, 'enter your email'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    minlength: 8,
    required: [true, 'enter your passowrd'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm your password'],
    validate: {
      // this only works on CREATE AND SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
});

// mongoose middleware runs at  the time of receiving the data and persisting the data to db
userSchema.pre('save', async function (next) {
  // exit the funciton and run the next middleware
  if (!this.isModified('password')) return next();

  //password hashing
  this.password = await bcrypt.hash(this.password, 10);

  // delete a field in the db
  this.passwordConfirm = undefined;
});

// instance methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);

//     // console.log(this.passwordChangedAt, JWTTimestamp);
//     return JWTTimestamp < changedTimeStamp;
//   }
//   return false;
// };
const User = mongoose.model('User', userSchema);

module.exports = User;
