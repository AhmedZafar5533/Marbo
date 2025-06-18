const Joi = require("joi");

const imagesSchemaJoi = Joi.object({
    base64Image: Joi.string()
        .regex(/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/]*={0,2}$/)
        .message("Image is of invalid format")
        .required()
        .messages({
            "string.empty": "Image URL is required.",
            "string.pattern.base":
                "Image must be a valid Base64 data URL (e.g., data:image/jpeg;base64,...).",
        }),
});

const roomValidationSchema = Joi.object({
    // Basic Room Details
    title: Joi.string().trim().min(5).max(100).required().messages({
        "string.base": "Title must be a string.",
        "string.empty": "Title cannot be empty.",
        "string.min": "Title must be at least {#limit} characters long.",
        "string.max": "Title cannot exceed {#limit} characters.",
        "any.required": "Title is required.",
    }),
    roomType: Joi.string().lowercase().required().messages({
        "string.base": "Room type must be a string.",
        "string.empty": "Room type cannot be empty.",
        "any.required": "Room type is required.",
    }),
    price: Joi.number().min(0).required().messages({
        "number.base": "Price must be a number.",
        "number.min": "Price cannot be negative.",
        "any.required": "Price is required.",
    }),
    availability: Joi.string()
        .valid("available", "unavailable", "booked")
        .optional() // Typically set by default or status change, not always on initial input
        .messages({
            "string.base": "Availability must be a string.",
            "any.only":
                "Invalid availability status. Must be: available, unavailable, or booked.",
        }),
    maxGuests: Joi.number()
        .integer() // Guests should be whole numbers
        .min(1)
        .required()
        .messages({
            "number.base": "Maximum guests must be a number.",
            "number.integer": "Maximum guests must be a whole number.",
            "number.min": "Maximum guests must be at least {#limit}.",
            "any.required": "Maximum guests is required.",
        }),
    bedType: Joi.string()
        .lowercase()

        .required()
        .messages({
            "string.base": "Bed type must be a string.",
            "string.empty": "Bed type cannot be empty.",
            "any.required": "Bed type is required.",
        }),
    size: Joi.number().min(0).optional().messages({
        "number.base": "Size must be a number.",
        "number.min": "Size cannot be negative.",
    }),
    sizeUnit: Joi.string().valid("sqft", "sqm").optional().messages({
        "string.base": "Size unit must be a string.",
        "any.only": "Invalid size unit. Must be: sqft or sqm.",
    }),
    description: Joi.string().trim().min(20).max(1000).required().messages({
        "string.base": "Description must be a string.",
        "string.empty": "Description cannot be empty.",
        "string.min": "Description must be at least {#limit} characters long.",
        "string.max": "Description cannot exceed {#limit} characters.",
        "any.required": "Description is required.",
    }),
    features: Joi.array()
        .items(Joi.string().trim().min(2).max(50)) // Each feature should be a string, with min/max length
        .optional()
        .messages({
            "array.base": "Features must be an array of strings.",
            "string.base": "Each feature must be a string.",
        }),
    images: Joi.array().min(1).max(4).items(imagesSchemaJoi).messages({
        "array.max": "A product can have a maximum of 4 images.",
        "array.min": "At least one image is required.",
    }),
});

module.exports = roomValidationSchema;
