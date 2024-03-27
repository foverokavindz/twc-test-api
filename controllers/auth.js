const asyncHandler = require('express-async-handler');
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

const signUp = asyncHandler(async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  console.log('req.body  ', req.body);

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('Email already exists');

  const { email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const { password: exceptPassword, ...rest } = newUser._doc;

  if (!newUser)
    return res.status(400).json({
      success: false,
      message: 'User could not be created',
    });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { rest },
  });
});

const signIn = asyncHandler(async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.genAuthenticationTkn();

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    token,
  });
});

// TODO signout process | cokkies

module.exports = { signUp, signIn };
