const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
  },
  { timestamps: true }
);

// generate JWT
userSchema.methods.genAuthenticationTkn = function () {
  // Generate token  jwtSign+payload+Signature
  const token = jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: '1h',
  });
  return token;
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create user Model with schema
const User = mongoose.model('User', userSchema);

// validate inputs
function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(12).required(),
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };
