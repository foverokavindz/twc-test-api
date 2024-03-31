const auth = require('./auth.js');
const contact = require('./contact.js');

// All routes
module.exports = function (app) {
  app.use('/api/auth', auth);
  app.use('/api/contact', contact);
};
