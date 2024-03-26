const auth = require('./authjs');
const contact = require('./contact.js');

module.exports = function (app) {
  app.use('/api/auth', auth);
  app.use('/api/contacts', contact);
};
