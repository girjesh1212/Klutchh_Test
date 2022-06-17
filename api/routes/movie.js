const express = require('express');
const router = express.Router();
const passport = require('passport');
const { test, extract, fetchMovies, rateMovie } = require('../controllers/movieCtrl');


router.get('/test', test);
// router.get('/extract', extract)
router.get('/fetchMovies/:pageNum', fetchMovies)
router.post('/rate/:movieId', passport.authenticate('user-passport', { session: false }), rateMovie)

module.exports = router;



// Date Format
    // const date = new Date('March 12, 2022 08:12:00');		// new Date() gives current date and time
    // const dat = [date.getDate(), date.getMonth()+1, date.getFullYear()];
    // const time = [date.getHours(), date.getMinutes(), date.getSeconds()];