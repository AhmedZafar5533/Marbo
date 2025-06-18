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

const clothingValidationSchema = Joi.object({
    // productName: String, required, min 3, max 100, trimmed
    productName: Joi.string().trim().min(3).max(100).required().messages({
        "string.empty": "Product name cannot be empty",
        "string.min": "Product name must be at least {#limit} characters long",
        "string.max": "Product name cannot exceed {#limit} characters",
        "any.required": "Product name is required",
    }),

    // category: String, required, trimmed
    category: Joi.string().trim().required().messages({
        "string.empty": "Category cannot be empty",
        "any.required": "Category is required",
    }),

    // brand: String, required, trimmed
    brand: Joi.string().trim().required().messages({
        "string.empty": "Brand cannot be empty",
        "any.required": "Brand is required",
    }),

    // price: Number, required, min 0
    price: Joi.number()
        .positive() // Ensures price is greater than 0
        .required()
        .messages({
            "number.base": "Price must be a number",
            "number.positive": "Price must be a positive number",
            "any.required": "Price is required",
        }),

    // quantity: Number, required, min 0
    quantity: Joi.number()
        .integer() // Ensures quantity is a whole number
        .min(0) // Allows 0 for out-of-stock items
        .required()
        .messages({
            "number.base": "Quantity must be a number",
            "number.integer": "Quantity must be an integer",
            "number.min": "Quantity cannot be less than {#limit}",
            "any.required": "Quantity is required",
        }),

    // description: String, optional, max 2000, trimmed
    description: Joi.string()
        .trim()
        .max(2000)
        .optional()
        .allow("") // Allow empty string as a valid optional value
        .messages({
            "string.max": "Description cannot exceed {#limit} characters",
        }),

    // features: Array of strings, optional, each string trimmed
    features: Joi.array().items(Joi.string().trim()).optional(),

    images: Joi.array().max(4).items(imagesSchemaJoi).messages({
        "array.max": "A product can have a maximum of 4 images.",
    }),

    // sizes: Array of strings, optional, each string trimmed
    sizes: Joi.array().items(Joi.string().trim()).optional(),

    // colors: Array of strings, optional, each string trimmed
    colors: Joi.array().items(Joi.string().trim()).optional(),

    // gender: String, optional, limited to specific enum values
    gender: Joi.string()
        .valid("Men", "Women", "Unisex", "Kids", "Boys", "Girls")
        .optional()
        .messages({
            "any.only":
                'Gender must be one of "Male", "Female", "Unisex", or "Kids"',
        }),
});

module.exports = clothingValidationSchema;
