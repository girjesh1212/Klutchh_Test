const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username is required';
    }

    if (!Validator.isStrongPassword(data.password, { minUppercase: 1 })) {
        errors.password = 'At least one uppercase is required';
    }

    if (!Validator.isLength(data.password, { min: 6 })) {
        errors.password = 'Password must have at least 6 characters'
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords do not match';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}