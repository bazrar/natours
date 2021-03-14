const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'please enter your name']
    }, 
    email : {
        type: String ,
        required: [true, 'please provide your email'], 
        unique: true, 
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    }, 
  photo: {
      type: String, 
      required: [true, 'A user must have a photo']
  }, 
  password: {
      type: String, 
      required: [true, 'please provide your password'],
      minlength: 8
  },
  passwordConfirm: {
      type: String, 
      required: [true, 'please confirm your password']
  }
})

const userModel = mongoose.model('userModel', userSchema)

exports.module = userModel ;
