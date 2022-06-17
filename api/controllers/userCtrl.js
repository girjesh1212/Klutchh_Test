const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load User Model
const User = require('../../models/User');

module.exports.test = (req, res, next) => {
    return res.status(200).json({ msg: 'User works' });
}

module.exports.register = (req, res, next) => {

    //Check validation
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) { return res.status(400).json(errors); }

    // Check if an User with this username exists
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: 'Database error: unable to find user' });
        } else if (user) {
            return res.status(400).json({ success: true, msg: 'Username already registered' });
        }

        // If User doesn't exist, create one
        const newUser = new User({
            username: req.body.username,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(400).json({ success: false, err: 'Salt failed' });
            }

            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) {
                    return res.status(400).json({ success: false, err: 'password hashing failed' });
                }
                newUser.password = hash;

                // Save user
                newUser.save((err) => {
                    if (err) {
                        return res.status(422).json({ success: false, errorType: 'Database error, registration failed' });
                    }
                    return res.status(200).json({ success: true, user: newUser });
                });
            });
        });


    });
}

module.exports.login = (req, res, next) => {

    //Check validation
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) { return res.status(400).json(errors); }


    //Find User by username
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: 'Database error: unable to find user, please retry' });
        } else if (!user) {
            return res.status(400).json({ success: false, msg: 'Username not registered' });
        } else {
            //Check password 
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(400).json({ success: false, error: 'Password comparison failed' });
                } else if (!isMatch) {
                    return res.status(400).json({ password: 'Password incorrect' });
                } else {
                    // User matched
                    const payload = { id: user.id, name: user.username }; //Create JWT payload

                    // Sign Token
                    jwt.sign(payload, process.env.secretOrKey, { expiresIn: '10d' }, (err, token) => {
                        if (err) {
                            return res.status(400).json({ success: false, error: 'Token signing failed' });
                        }
                        return res.status(200).status(200).json({ success: true, token: 'Bearer ' + token });
                    });
                }
            });
        }
    });

}

module.exports.profile = (req, res, next) => {
    return res.status(200).json({
        success: true,
        username: req.user.username,
    });
}
