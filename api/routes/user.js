const express = require('express');
const router = express.Router();
const passport = require('passport');
const { test, register, login, profile } = require('../controllers/userCtrl');


router.get('/test', test);
router.post('/register', register);
router.post('/login', login);
router.get('/profile', passport.authenticate('user-passport', { session: false }), profile);


module.exports = router;

// Done