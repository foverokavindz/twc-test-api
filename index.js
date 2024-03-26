const express = require('express');
const cors = require('cors');

const app = express();
// Enable CORS for all routes
app.use(
  cors({
    exposedHeaders: ['x-auth-token'],
  })
);

app.use(express.urlencoded({ extended: true }));

// get json as a input our backend
app.use(express.json());

const db = require('./config/db.js');

require('dotenv').config();

// Import and setup routes
const setupRoutes = require('./routes/index.js');
setupRoutes(app);

// error handler

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
