const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateUpdateInput(data) {
    let errors = {};

    // convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.textarea = !isEmpty(data.textarea) ? data.textarea : "";
    data.dept = !isEmpty(data.dept) ? data.dept : "";
    data.courses = !isEmpty(data.courses) ? data.courses : "";
    data.panel = !isEmpty(data.panel) ? data.panel : "";

    // Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    // email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

     // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }

    // Textarea checks
    if (Validator.isEmpty(data.textarea)) {
        errors.textarea = "Textarea field is required";
    }

    // Dept checks
    if (Validator.isEmpty(data.dept)) {
        errors.dept = "Dept field is required";
    }

    // Courses checks
    // if (Validator.isEmpty(data.courses)) {
    //     errors.courses = "Courses field is required";
    // }

    // Panel checks
    if (Validator.isEmpty(data.panel)) {
        errors.panel = "Panel field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};