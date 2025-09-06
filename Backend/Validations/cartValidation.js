const Joi = require("joi");

const cartValidationSchema = Joi.object({
  price: Joi.number().greater(0).required().messages({
    "number.base": "Price must be a number.",
    "number.greater": "Price must be greater than 0.",
    "any.required": "Price is required.",
  }),

  typeOf: Joi.string().trim().min(1).required().messages({
    "string.empty": "Category is required.",
  }),

  name: Joi.string().trim().min(1).required().messages({
    "string.empty": "Product name is required.",
  }),

  imageUrl: Joi.string().uri().allow("").messages({
    "string.uri": "Image URL must be a valid URL.",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number.",
    "number.integer": "Quantity must be an integer.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),

  subDetails: Joi.object()
    .optional()
    .pattern(
      /.*/, // match any key
      Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean(),
        Joi.array(),
        Joi.object()
      )
    )
    .messages({
      "object.base": "subDetails must be an object.",
    }),
});

module.exports = { cartValidationSchema };
