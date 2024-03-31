const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();

// enable cors
app.use(
  cors({
    exposedHeaders: ['x-auth-token'],
  })
);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// get json as a input our backend
app.use(express.json());

// Connect to database
const db = require('./config/db.js');

// Import and setup routes
const setupRoutes = require('./routes/index.js');
setupRoutes(app);

// error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// start server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
