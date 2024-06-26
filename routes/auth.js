const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('../controllers/auth.js');

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);

module.exports = router;
