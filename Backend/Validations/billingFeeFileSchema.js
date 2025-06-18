const Joi = require("joi");

const billSchema = Joi.object({


    billId: Joi.string()
        .trim() // Remove leading/trailing whitespace
        .required()
        .messages({
            "string.empty": "Bill ID cannot be empty.",
            "any.required": "Bill ID is required.",
        })
        .description("A unique, human-readable identifier for each bill."),

    customerId: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Customer ID cannot be empty.",
            "any.required": "Customer ID is required.",
        })
        .description("The unique identifier for the customer."),

    billType: Joi.string()
        .valid("water", "gas", "electricity", "school_fees", "other")
        .required()
        .messages({
            "any.only":
                'Bill type must be one of "water", "gas", "electricity", "school_fees", or "other".',
            "any.required": "Bill type is required.",
        })
        .description("The type of utility or fee."),

    issueDate: Joi.date()
        .iso() // Ensures date is in ISO 8601 format
        .required()
        .messages({
            "date.base": "Issue date must be a valid date.",
            "date.iso":
                "Issue date must be in ISO 8601 format (e.g., YYYY-MM-DD).",
            "any.required": "Issue date is required.",
        })
        .description("The date when the bill was generated."),

    dueDate: Joi.date()
        .iso()
        .required()
        .greater(Joi.ref("issueDate")) // Due date must be after issue date
        .messages({
            "date.base": "Due date must be a valid date.",
            "date.iso":
                "Due date must be in ISO 8601 format (e.g., YYYY-MM-DD).",
            "any.required": "Due date is required.",
            "date.greater": "Due date must be after the issue date.",
        })
        .description("The date by which the bill amount is due."),

    amountDue: Joi.number()
        .precision(2) // Allows for up to 2 decimal places (for currency)
        .positive() // Amount must be a positive number
        .required()
        .messages({
            "number.base": "Amount due must be a number.",
            "number.positive": "Amount due must be a positive number.",
            "number.precision": "Amount due can have at most 2 decimal places.",
            "any.required": "Amount due is required.",
        })
        .description("The total monetary amount due."),

    currency: Joi.string()
        .trim()
        .length(3) // Assuming 3-letter ISO currency codes (e.g., USD, PKR)
        .uppercase() // Convert to uppercase
        .required()
        .messages({
            "string.empty": "Currency cannot be empty.",
            "string.length":
                "Currency must be a 3-letter ISO code (e.g., USD, PKR).",
            "any.required": "Currency is required.",
        })
        .description("The currency of the amount due."),

    status: Joi.string()
        .valid("unpaid", "paid", "overdue", "cancelled")
        .default("unpaid") // Set default value
        .messages({
            "any.only":
                'Status must be "unpaid", "paid", "overdue", or "cancelled".',
        })
        .description("The current payment status of the bill."),

    serviceProvider: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Service provider cannot be empty.",
            "any.required": "Service provider is required.",
        })
        .description("The name of the utility company or institution."),

    accountIdentifier: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Account identifier cannot be empty.",
            "any.required": "Account identifier is required.",
        })
        .description("The customer's account number or student ID."),

    billingPeriod: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Billing period cannot be empty.",
            "any.required": "Billing period is required.",
        })
        .description("A descriptive string for the billing period."),

    studentName: Joi.string()
        .trim()
        .when("billType", {
            is: "school_fees",
            then: Joi.required(),
            otherwise: Joi.optional().allow(null, ""), // Allow null or empty string if not school_fees
        })
        .messages({
            "string.empty": "Student name cannot be empty for school fees.",
            "any.required": "Student name is required for school fees.",
        })
        .description("The name of the student (required for school fees)."),

    gradeOrClass: Joi.string()
        .trim()
        .when("billType", {
            is: "school_fees",
            then: Joi.required(),
            otherwise: Joi.optional().allow(null, ""), // Allow null or empty string if not school_fees
        })
        .messages({
            "string.empty": "Grade or class cannot be empty for school fees.",
            "any.required": "Grade or class is required for school fees.",
        })
        .description(
            "The student's grade or class (required for school fees)."
        ),


});

module.exports = billSchema;
