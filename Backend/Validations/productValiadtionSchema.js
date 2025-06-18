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

// Example usage (same as above)

const productSchemaJoi = Joi.object({
    productName: Joi.string().required().messages({
        "string.empty": "Product Name is required.",
    }),
    category: Joi.string().required().messages({
        "string.empty": "Category is required.",
    }),
    price: Joi.number().required().messages({
        "number.base": "Price must be a number.",
        "any.required": "Price is required.",
    }),
    description: Joi.string().required().messages({
        "string.empty": "Description is required.",
    }),
    images: Joi.array().max(4).items(imagesSchemaJoi).messages({
        "array.max": "A product can have a maximum of 4 images.",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number.",
        "number.integer": "Quantity must be an integer.",
        "number.min": "Quantity must be at least 1.",
        "any.required": "Quantity is required.",
    }),

    features: Joi.array()
        .items(
            Joi.string().required().messages({
                "string.empty": "Feature cannot be empty.",
            })
        )
        .max(10)
        .messages({
            "array.max": "A product can have a maximum of 10 features.",
            "array.base": "Features must be an array.",
        }),
});

module.exports = { productSchemaJoi };
