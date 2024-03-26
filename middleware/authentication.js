const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = function (req, res, next) {
  // first check is there a token
  const token = req.header('x-auth-token');
  // const token = req.cookies.access_token;

  if (!token) return res.status(401).send('Access denied. No token provided');

  //then see is it valid?
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded; // == req.user._id // get payload

    console.log('req.user    ', req.user);

    next();
  } catch (ex) {
    res.status(400).send('invalid token');
  }
};

module.exports = protect;
