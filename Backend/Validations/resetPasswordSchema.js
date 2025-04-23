const Joi = require("joi");

const passwordResetEmailSchema = Joi.object({
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
});
const newPasswordSchema = Joi.object({
    newPassword: Joi.string()
        .min(8)
        .max(128)
        .pattern(
            new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$")
        )
        .required()
        .messages({
            "string.base": "Password must be a string",
            "string.empty": "Password is required",
            "string.min": "Password must be at least 8 characters long",
            "string.max": "Password must be at most 128 characters long",
            "string.pattern.base":
                "Password must include uppercase, lowercase, number",
            "any.required": "Password is required",
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "Passwords do not match",
            "any.required": "Please confirm your password",
        }),
});
module.exports = {
    passwordResetEmailSchema,
    newPasswordSchema,
};
