const Joi = require("joi");

const contactUsValidationSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } }) // '.email()' validates email format, 'tlds: { allow: false }' makes it less strict about top-level domains, you can adjust this.
        .required()
        .messages({
            "string.email": "Please provide a valid email address.",
            "string.empty": "Email cannot be empty.",
            "any.required": "Email is required.",
        }),

    reason: Joi.string()
        .min(3) // Optional: add a minimum length for the reason
        .max(255) // Optional: add a maximum length for the reason
        .required()
        .messages({
            "string.empty": "Reason cannot be empty.",
            "any.required": "Reason is required.",
            "string.min": "Reason should have a minimum length of {#limit}.",
            "string.max": "Reason should have a maximum length of {#limit}.",
        }),

    message: Joi.string()
        .min(10) // Optional: add a minimum length for the message
        .max(1000) // Optional: add a maximum length for the message
        .required()
        .messages({
            "string.empty": "Message cannot be empty.",
            "any.required": "Message is required.",
            "string.min": "Message should have a minimum length of {#limit}.",
            "string.max": "Message should have a maximum length of {#limit}.",
        }),
});

module.exports = contactUsValidationSchema;
