const Joi = require("joi");

const reviewSchema = Joi.object({
  comment: Joi.string().min(20).required().messages({
    "string.base": "Review must be a string.",
    "string.min": "Review must be at least 10 characters long.",
    "string.empty": "Review cannot be empty.",
    "any.required": "Review is required.",
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number.",
    "number.integer": "Rating must be an integer.",
    "number.min": "Rating must be at least 1.",
    "number.max": "Rating cannot be greater than 5.",
    "any.required": "Rating is required.",
  }),
});

module.exports = { reviewSchema };
