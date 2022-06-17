const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

// env config
dotenv.config({ path: __dirname + '/config/config.env' });

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB config
const db = process.env.mongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function () {
        console.log('Connected to MongoDB');
    }).catch(err => console.error(err));

// Initializes passport and passport sessions
app.use(passport.initialize());

// Passport config
require('./config/Passport.js')(passport);

// Path to routes
const Movie = require('./api/routes/movie');
const User = require('./api/routes/user');

// //Use routes
app.use('/movie', Movie);
app.use('/user', User);



const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server running on port " + port);
});
