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

const propertyValidationSchema = Joi.object({
  // Basic Property Details
  title: Joi.string().trim().min(5).max(100).required().messages({
    "string.base": "Title must be a string.",
    "string.empty": "Title cannot be empty.",
    "string.min": "Title must be at least {#limit} characters long.",
    "string.max": "Title cannot exceed {#limit} characters.",
    "any.required": "Title is required.",
  }),
  propertyType: Joi.string()
    .lowercase()
    .valid(
      "house",
      "apartment",
      "villa",
      "condo",
      "cabin",
      "loft",
      "bungalow",
      "other"
    )
    .required()
    .messages({
      "string.base": "Property type must be a string.",
      "string.empty": "Property type cannot be empty.",
      "any.only":
        "Invalid property type. Must be one of: house, apartment, villa, condo, cabin, loft, bungalow, other.",
      "any.required": "Property type is required.",
    }),
  pricePerNight: Joi.number().min(0).required().messages({
    "number.base": "Price per night must be a number.",
    "number.min": "Price per night cannot be negative.",
    "any.required": "Price per night is required.",
  }),
  availability: Joi.string()
    .valid("available", "unavailable", "draft")
    .optional() // This might be set internally or on initial creation
    .messages({
      "string.base": "Availability must be a string.",
      "any.only":
        "Invalid availability status. Must be: available, unavailable, or draft.",
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
  bedrooms: Joi.number().integer().min(0).required().messages({
    "number.base": "Bedrooms must be a number.",
    "number.integer": "Bedrooms must be a whole number.",
    "number.min": "Bedrooms cannot be negative.",
    "any.required": "Number of bedrooms is required.",
  }),
  bathrooms: Joi.number()
    .min(0) // Can be 0 if only a toilet/powder room, or if not applicable
    .required()
    .messages({
      "number.base": "Bathrooms must be a number.",
      "number.min": "Bathrooms cannot be negative.",
      "any.required": "Number of bathrooms is required.",
    }),
  propertySize: Joi.number().min(0).optional().messages({
    "number.base": "Property size must be a number.",
    "number.min": "Property size cannot be negative.",
  }),
  sizeUnit: Joi.string()
    .valid("sqft", "sqm", "kanal", "marla")
    .optional()
    .messages({
      "string.base": "Size unit must be a string.",
      "any.only": "Invalid size unit. Must be: sqft, sqm, kanal, or marla.",
    }),
  description: Joi.string().trim().min(20).max(2000).required().messages({
    "string.base": "Description must be a string.",
    "string.empty": "Description cannot be empty.",
    "string.min": "Description must be at least {#limit} characters long.",
    "string.max": "Description cannot exceed {#limit} characters.",
    "any.required": "Description is required.",
  }),
  features: Joi.array()
    .items(Joi.string().trim().min(2).max(50)) // Each feature should be a string
    .optional()
    .messages({
      "array.base": "Features must be an array of strings.",
    }),
  images: Joi.array().min(1).max(4).items(imagesSchemaJoi).messages({
    "array.max": "A product can have a maximum of 4 images.",
    "array.min": "At least one image is required.",
  }),

  // Location Fields
  addressLine1: Joi.string().trim().required().messages({
    "string.base": "Address Line 1 must be a string.",
    "string.empty": "Address Line 1 cannot be empty.",
    "any.required": "Address Line 1 is required.",
  }),
  addressLine2: Joi.string()
    .trim()
    .optional()
    .allow("") // Allow empty string if user leaves it blank
    .messages({
      "string.base": "Address Line 2 must be a string.",
    }),
  city: Joi.string().trim().required().messages({
    "string.base": "City must be a string.",
    "string.empty": "City cannot be empty.",
    "any.required": "City is required.",
  }),
  stateRegion: Joi.string().trim().required().messages({
    "string.base": "State/Region must be a string.",
    "string.empty": "State/Region cannot be empty.",
    "any.required": "State/Region is required.",
  }),
  postalCode: Joi.string()
    .trim()
    .pattern(/^\d{5}$/)
    .optional()
    .allow("")
    .messages({
      "string.base": "Postal code must be a string.",
      "string.pattern.base": "Postal code must be 5 digits (e.g., 12345).",
    }),
  country: Joi.string().trim().required().messages({
    "string.base": "Country must be a string.",
    "string.empty": "Country cannot be empty.",
    "any.required": "Country is required.",
  }),
  mapLink: Joi.string()
    .uri() // Ensures it's a valid URL format
    .trim()
    .optional()
    .allow("")
    .messages({
      "string.base": "Map link must be a string.",
      "string.uri": "Map link must be a valid URL.",
    }),
  // If you integrate geospatial 'location', you'd add:
  // location: Joi.object({
  //     type: Joi.string().valid('Point').required(),
  //     coordinates: Joi.array().items(Joi.number()).length(2).required()
  // }).optional(),

  // Pricing Details
  minimumNights: Joi.number().integer().min(1).optional().messages({
    "number.base": "Minimum nights must be a number.",
    "number.integer": "Minimum nights must be a whole number.",
    "number.min": "Minimum nights must be at least {#limit}.",
  }),
  cleaningFee: Joi.number().min(0).optional().messages({
    "number.base": "Cleaning fee must be a number.",
    "number.min": "Cleaning fee cannot be negative.",
  }),
  securityDeposit: Joi.number().min(0).optional().messages({
    "number.base": "Security deposit must be a number.",
    "number.min": "Security deposit cannot be negative.",
  }),

  // Check-in/out Times
  checkinTime: Joi.string()
    .trim()
    .pattern(/^(?:2[0-3]|[01]?[0-9]):(?:[0-5]?[0-9])$/) // HH:MM format
    .optional()
    .messages({
      "string.base": "Check-in time must be a string.",
      "string.empty": "Check-in time cannot be empty.",
      "string.pattern.base":
        "Check-in time must be in HH:MM format (e.g., 15:00).",
      "any.required": "Check-in time is required.",
    }),
  checkoutTime: Joi.string()
    .trim()
    .pattern(/^(?:2[0-3]|[01]?[0-9]):(?:[0-5]?[0-9])$/) // HH:MM format
    .optional()
    .messages({
      "string.base": "Check-out time must be a string.",
      "string.empty": "Check-out time cannot be empty.",
      "string.pattern.base":
        "Check-out time must be in HH:MM format (e.g., 11:00).",
      "any.required": "Check-out time is required.",
    }),

  // Policies
  smokingPolicy: Joi.string()
    .valid("no-smoking", "smoking-allowed", "designated-area")
    .optional()
    .messages({
      "string.base": "Smoking policy must be a string.",
      "any.only":
        "Invalid smoking policy. Must be: no-smoking, smoking-allowed, or designated-area.",
    }),
  petPolicy: Joi.string()
    .valid("no-pets", "small-pets-allowed", "all-pets-allowed")
    .optional()
    .messages({
      "string.base": "Pet policy must be a string.",
      "any.only":
        "Invalid pet policy. Must be: no-pets, small-pets-allowed, or all-pets-allowed.",
    }),
  partyPolicy: Joi.string()
    .valid("no-parties", "parties-allowed-with-approval", "parties-allowed")
    .optional()
    .messages({
      "string.base": "Party policy must be a string.",
      "any.only":
        "Invalid party policy. Must be: no-parties, parties-allowed-with-approval, or parties-allowed.",
    }),
  quietHours: Joi.string().trim().optional().allow("").messages({
    "string.base": "Quiet hours must be a string.",
  }),

  // Access & Interaction
  accessDescription: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow("")
    .messages({
      "string.base": "Access description must be a string.",
      "string.max": "Access description cannot exceed {#limit} characters.",
    }),
  hostInteraction: Joi.string().max(500).allow("").optional().messages({
    "string.base": "Host interaction must be a string.",
    "any.only":
      "Invalid host interaction. Must be: always-available, on-demand, or minimal.",
  }),
});

module.exports = propertyValidationSchema;
