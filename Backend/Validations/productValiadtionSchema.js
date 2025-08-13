const Joi = require("joi");

const imagesSchemaJoi = Joi.object({
  base64Image: Joi.string()
    .regex(/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/]*={0,2}$/)
    .message("Image is of invalid format")
    .required()
    .messages({
      "string.empty": "Image URL is required.",
      "string.pattern.base": "Image must be valid.",
    }),
});

const productSchemaJoi = Joi.object({
  productName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Product Name is required.",
    "string.min": "Product Name must be at least 3 characters long.",
    "string.max": "Product Name must be at most 100 characters long.",
  }),
  typeOf: Joi.string()
    .valid("Groceries", "Tech", "Clothing")
    .required()
    .messages({
      "any.only": "Type must be either 'Groceries', 'Tech', or 'Clothing'.",
      "string.empty": "Type is required.",
    }),
  category: Joi.string().required().messages({
    "string.empty": "Category is required.",
  }),
  brand: Joi.string().allow("").trim().messages({
    "string.base": "Brand must be a string.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number.",
    "number.min": "Price cannot be negative.",
    "any.required": "Price is required.",
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number.",
    "number.integer": "Quantity must be an integer.",
    "number.min": "Quantity cannot be negative.",
    "any.required": "Quantity is required.",
  }),
  description: Joi.string().max(2000).required().messages({
    "string.empty": "Description is required.",
    "string.max": "Description cannot exceed 2000 characters.",
  }),
  features: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.empty": "Feature cannot be empty.",
      })
    )
    .max(10)
    .required()
    .messages({
      "array.max": "A product can have a maximum of 10 features.",
      "array.base": "Features must be an array.",
      "any.required": "Features are required.",
    }),
  warranty: Joi.string().valid("yes", "no").messages({
    "any.only": "Warranty must be 'yes' or 'no'.",
  }),
  warrantyConditions: Joi.array()
    .items(Joi.string())
    .when("warranty", {
      is: "yes",
      then: Joi.array().min(1).required().messages({
        "array.min": "Warranty conditions are required when warranty is 'yes'.",
        "any.required":
          "Warranty conditions are required when warranty is 'yes'.",
      }),
      otherwise: Joi.forbidden(),
    }),
  sizes: Joi.array()
    .items(Joi.string().trim())
    .when("typeOf", {
      is: "Clothing",
      then: Joi.array().min(1).required().messages({
        "array.min": "Sizes are required for Clothing type.",
      }),
      otherwise: Joi.forbidden(),
    }),
  gender: Joi.string()
    .valid("Men", "Women", "Unisex", "Kids", "Boys", "Girls")
    .default("Unisex")
    .messages({
      "any.only":
        "Gender must be one of Men, Women, Unisex, Kids, Boys, or Girls.",
    }),
  images: Joi.array().max(4).items(imagesSchemaJoi).messages({
    "array.max": "A product can have a maximum of 4 images.",
  }),
});

module.exports = { productSchemaJoi };
