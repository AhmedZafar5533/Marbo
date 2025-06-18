const Joi = require("joi");

// Joi Schema for the nested 'schedule' subdocument
const scheduleJoiSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3) // Ensure a reasonable minimum length for the name
        .max(50) // Ensure a reasonable maximum length for the name
        .required()
        .messages({
            "string.base": "Schedule name must be a string.",
            "string.empty": "Schedule name cannot be empty.",
            "string.min":
                "Schedule name must be at least {#limit} characters long.",
            "string.max": "Schedule name cannot exceed {#limit} characters.",
            "any.required": "Schedule name is required.",
        }),

    days: Joi.string()
        .trim()
        .min(3) // e.g., "Mon-Fri", "Weekends", "Daily"
        .max(50)
        .required()
        .messages({
            "string.base": "Days must be a string.",
            "string.empty": "Days cannot be empty.",
            "string.min": "Days must be at least {#limit} characters long.",
            "string.max": "Days cannot exceed {#limit} characters.",
            "any.required": "Days are required.",
        }),
    rate: Joi.number()
        .min(0) // Price cannot be negative
        .required()
        .messages({
            "number.base": "Price must be a number.",
            "number.min": "Price cannot be negative.",
            "any.required": "Price is required.",
        }),
    includedItems: Joi.array()
        .items(Joi.string().trim().min(1).max(50)) // Each feature should be a string
        .required()
        .messages({
            "array.base": "Features must be an array of strings.",
            "array.empty": "Features cannot be empty.",
            "any.required": "Features are required.",
        }),
});

// Joi Schema for the main 'domesticStaffing' document
const doctorsValidationSchema = Joi.object({
    typeName: Joi.string().trim().min(3).max(50).required().messages({
        "string.base": "Service type must be a string.",
        "string.empty": "Service type cannot be empty.",
        "string.min": "Service type must be at least {#limit} characters long.",
        "string.max": "Service type cannot exceed {#limit} characters.",
        "any.required": "Service type is required.",
    }),
    description: Joi.string()
        .trim()
        .min(20) // Ensure a comprehensive description
        .max(1000) // Limit the length of the description
        .required()
        .messages({
            "string.base": "Description must be a string.",
            "string.empty": "Description cannot be empty.",
            "string.min":
                "Description must be at least {#limit} characters long.",
            "string.max": "Description cannot exceed {#limit} characters.",
            "any.required": "Description is required.",
        }),
    scheduleTypes: Joi.array()
        .items(scheduleJoiSchema) // Each item in the array must conform to scheduleJoiSchema
        .min(1) // At least one schedule entry is required
        .required()
        .messages({
            "array.base": "Schedule must be an array.",
            "array.empty": "Schedule cannot be empty.",
            "array.min": "At least one schedule entry is required.",
            "any.required": "Schedule is required.",
        }),
});

module.exports = {
    scheduleJoiSchema,
    doctorsValidationSchema,
};
