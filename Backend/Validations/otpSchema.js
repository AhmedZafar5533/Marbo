const Joi = require("joi");

const otpSchema = Joi.object({
    otp: Joi.number()
        .integer()
        .min(100000)
        .max(999999)
        .required()
        .messages({
            "number.base": "OTP must be a number",
            "number.min": "OTP must be a 6-digit number",
            "number.max": "OTP must be a 6-digit number",
            "any.required": "OTP is required",
        }),
});

module.exports = { otpSchema };
