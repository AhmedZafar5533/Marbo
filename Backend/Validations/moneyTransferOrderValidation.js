const Joi = require("joi");

const moneyTransferSchemaValidation = Joi.object({
  fromCurrency: Joi.string().required().messages({
    "string.base": "From currency must be a string.",
    "any.required": "From currency is required.",
  }),
  toCurrency: Joi.string().required().messages({
    "string.base": "To currency must be a string.",
    "any.required": "To currency is required.",
  }),

  amount: Joi.number().min(0).required().messages({
    "number.base": "Amount must be a number.",
    "number.min": "Amount must be a positive number.",
    "any.required": "Amount is required.",
  }),
  convertedAmount: Joi.number().min(0).required().messages({
    "number.base": "Converted amount must be a number.",
    "number.min": "Converted amount must be a positive number.",
    "any.required": "Converted amount is required.",
  }),
  exchangeRate: Joi.number().min(0).required().messages({
    "number.base": "Exchange rate  must be a number.",
    "number.min": "Exchange rate must be a positive number.",
    "any.required": "Exchange rate is required.",
  }),

  deliveryMethod: Joi.string().valid("bank", "pickup").required().messages({
    "string.base": "Delivery method must be a string.",
    "any.only": "Delivery method must be either 'bank' or 'pickup'.",
    "any.required": "Delivery method is required.",
  }),

  recipientId: Joi.string().required().messages({
    "string.base": "Recipient ID must be a string.",
    "any.required": "Recipient ID is required.",
  }),

  // Conditional validation for accountNumber and bankName
  accountNumber: Joi.string().when("deliveryMethod", {
    is: "bank",
    then: Joi.required().messages({
      "string.base": "Account number must be a string.",
      "any.required": "Account number is required for 'bank' delivery.",
    }),
    otherwise: Joi.optional(), // Optional if deliveryMethod is not 'bank'
  }),
  bankName: Joi.string().when("deliveryMethod", {
    is: "bank",
    then: Joi.required().messages({
      "string.base": "Bank name must be a string.",
      "any.required": "Bank name is required for 'bank' delivery.",
    }),
    otherwise: Joi.optional(), // Optional if deliveryMethod is not 'bank'
  }),

  recipientName: Joi.string().required().messages({
    "string.base": "Recipient name must be a string.",
    "any.required": "Recipient name is required.",
  }),
  status: Joi.string()
    .valid("pending", "rejected", "completed")
    .default("pending")
    .messages({
      "string.base": "Status must be a string.",
      "any.only": "Status must be 'pending', 'rejected', or 'completed'.",
    }),
});

module.exports = moneyTransferSchemaValidation;
