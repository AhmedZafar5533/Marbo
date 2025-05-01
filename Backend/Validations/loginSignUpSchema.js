const Joi = require("joi");

const signupSchema = Joi.object({
    username: Joi.string()
        .trim()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.base": "Username must be a string",
            "string.empty": "Username is required",
            "string.alphanum": "Username must only contain letters and numbers",
            "string.min": "Username must be at least 3 characters long",
            "string.max": "Username must be at most 30 characters long",
            "any.required": "Username is required",
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } }) // allow any domain, even dev/test
        .required()
        .messages({
            "string.base": "Email must be a string",
            "string.email": "Please enter a valid email address",
            "string.empty": "Email is required",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(
            new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$")
        )
        .required()
        .messages({
            "string.base": "Password must be a string",
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters long",
            "string.max": "Password must be at most 128 characters long",
            "string.pattern.base":
                "Password must include uppercase, lowercase, and a number",
            "any.required": "Password is required",
        }),

    role: Joi.string().valid("customer", "vendor").required().messages({
        "string.base": "Role must be a string",
        "string.empty": "Role is required",
        "any.only": "Role must be either 'customer' or 'vendor'",
        "any.required": "Role is required",
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
    email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.base": "Email must be a string",
            "string.email": "Please enter a valid email address",
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
