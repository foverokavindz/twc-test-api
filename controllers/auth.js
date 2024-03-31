const asyncHandler = require('express-async-handler');
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

// sign up new user
const signUp = asyncHandler(async (req, res) => {
  // validate user input
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if user already exists
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('Email already exists');

  const { email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create new user
  newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const { password: exceptPassword, ...rest } = newUser._doc;

  // check if user was created
  if (!newUser)
    return res.status(400).json({
      success: false,
      message: 'User could not be created',
    });

  // return user data
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { rest },
  });
});

// sign in user
const signIn = asyncHandler(async (req, res) => {
  // validate user input
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid email or password');

  // check if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  // generate authentication token
  const token = user.genAuthenticationTkn();

  // return token
  res.status(201).json({
    success: true,
    message: 'User logged in successfully',
    token,
  });
});

module.exports = { signUp, signIn };
