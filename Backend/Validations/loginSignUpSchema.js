const Joi = require("joi");

const signupSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        "string.base": "Username must be a string",
        "string.empty": "Username is required",
        "string.alphanum": "Username must only contain alphanumeric characters",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username must be at most 30 characters long",
        "any.required": "Username is required",
    }),

    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),

    password: Joi.string().min(6).max(128).required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "string.max": "Password must be at most 128 characters long",
        "any.required": "Password is required",
    }),

    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Please confirm your password",
        }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),

    password: Joi.string().min(6).max(128).required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "string.max": "Password must be at most 128 characters long",
        "any.required": "Password is required",
    }),
});

module.exports = {
    signupSchema,
    loginSchema,
};
