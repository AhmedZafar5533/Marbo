const Joi = require("joi");

const billValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required.",
    "string.base": "Name must be a string.",
  }),
  type: Joi.string().required().messages({
    "any.required": "Type is required.",
    "string.base": "Type must be a string.",
  }),

  billImage: Joi.string()
    .regex(/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/]*={0,2}$/)
    .message("Image is of invalid format")
    .required()
    .messages({
      "string.empty": "Image URL is required.",
      "string.pattern.base": "Image must be valid.",
    }),
  billNumber: Joi.string().required().messages({
    "any.required": "Bill number is required.",
    "string.base": "Bill number must be a string.",
  }),

  amountDue: Joi.number().required().min(0).messages({
    "any.required": "Amount due is required.",
    "number.base": "Amount due must be a number.",
    "number.min": "Amount due cannot be a negative value.",
  }),

  dueDate: Joi.date().required().iso().min("now").messages({
    "any.required": "Due date is required.",
    "date.base": "Due date must be a valid date.",
    "date.iso": "Due date must be in ISO 8601 format (e.g., YYYY-MM-DD).",
    "date.min": "Due date cannot be in the past.",
  }),
});

module.exports = billValidationSchema;
