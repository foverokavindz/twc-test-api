const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authentication.js');
const {
  createContact,
  getContacts,
  deleteContact,
  updateContact,
} = require('../controllers/contact.js');

router.route('/').get(protect, getContacts).post(protect, createContact);
router.route('/:id').delete(protect, deleteContact).put(protect, updateContact);

module.exports = router;
