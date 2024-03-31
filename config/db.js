mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.sjaclxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connection = mongoose
  .connect(uri)
  .then(() => console.log('connected to mongo atlas'))
  .catch((err) => console.log(err));

module.exports = connection;
