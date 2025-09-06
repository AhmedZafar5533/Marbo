const Joi = require("joi");

const propertyValidationSchema = Joi.object({
  // General details
  title: Joi.string().min(3).max(200).required().messages({
    "string.base": "Title must be a string.",
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title cannot exceed 200 characters.",
    "any.required": "Title is required.",
  }),

  propertyType: Joi.string()
    .valid("building", "land", "commercial")
    .required()
    .messages({
      "any.only": "Property type must be one of: building, land, commercial.",
      "any.required": "Property type is required.",
    }),

  salePrice: Joi.number().greater(0).required().messages({
    "number.base": "Sale price must be a valid number.",
    "number.greater": "Sale price must be greater than 0.",
    "any.required": "Sale price is required.",
  }),

  propertyStatus: Joi.string()
    .valid("available", "sold", "pending")
    .default("available"),

  description: Joi.string().max(2000).allow("").messages({
    "string.max": "Description cannot exceed 2000 characters.",
  }),

  features: Joi.array().items(Joi.string().max(100)).messages({
    "array.base": "Features must be an array of strings.",
  }),

  images: Joi.array().items(Joi.string().uri()).messages({
    "string.uri": "Each image must be a valid URL.",
  }),

  // Building-specific fields
  bedrooms: Joi.number().integer().min(0).allow(null, ""),
  bathrooms: Joi.number().integer().min(0).allow(null, ""),
  floors: Joi.number().integer().min(0).allow(null, ""),
  totalFloors: Joi.number().integer().min(0).allow(null, ""),
  propertySize: Joi.number().min(0).allow(null, ""),
  sizeUnit: Joi.string().valid("sqft", "sqyd", "sqm").default("sqft"),
  buildingAge: Joi.string().max(100).allow(""),
  furnishingStatus: Joi.string()
    .valid("unfurnished", "semi-furnished", "furnished")
    .default("unfurnished"),
  facing: Joi.string().max(100).allow(""),

  // Land-specific fields
  landArea: Joi.number().min(0).allow(null, ""),
  landUnit: Joi.string()
    .valid("sqft", "sqyd", "acre", "hectare")
    .default("sqft"),
  landType: Joi.string().max(100).allow(""),
  soilType: Joi.string().max(100).allow(""),
  waterAvailability: Joi.string().max(100).allow(""),
  electricityAvailability: Joi.string().max(100).allow(""),
  roadAccess: Joi.string().max(200).allow(""),

  // Commercial-specific fields
  builtUpArea: Joi.number().min(0).allow(null, ""),
  carpetArea: Joi.number().min(0).allow(null, ""),
  floorNumber: Joi.number().integer().allow(null, ""),
  washrooms: Joi.number().integer().min(0).allow(null, ""),
  cafeteria: Joi.boolean().default(false),
  conferenceRoom: Joi.boolean().default(false),
  reception: Joi.boolean().default(false),

  // Location fields
  addressLine1: Joi.string().max(200).allow(""),
  addressLine2: Joi.string().max(200).allow(""),
  city: Joi.string().max(100).required().messages({
    "string.empty": "City is required.",
    "any.required": "City is required.",
  }),
  stateRegion: Joi.string().max(100).allow(""),
  postalCode: Joi.string()
    .pattern(/^[A-Za-z0-9\- ]{3,10}$/)
    .allow("")
    .messages({
      "string.pattern.base": "Postal code must be valid.",
    }),
  country: Joi.string().max(100).default("Pakistan"),
  mapLink: Joi.string().uri().allow("").messages({
    "string.uri": "Map link must be a valid URL.",
  }),

  // Legal & Additional
  ownershipType: Joi.string().max(100).allow(""),
  approvals: Joi.array().items(Joi.string().max(100)),
  nearbyFacilities: Joi.array().items(Joi.string().max(100)),
  parkingSpaces: Joi.number().integer().min(0).allow(null, ""),

  // Flags
  negotiable: Joi.boolean().default(false),
  readyToMove: Joi.boolean().default(false),
  loanAvailable: Joi.boolean().default(false),
})
  // Conditional requirements based on propertyType
  .when(Joi.object({ propertyType: Joi.valid("building") }).unknown(), {
    then: Joi.object({
      bedrooms: Joi.number().integer().min(0).required().messages({
        "any.required": "Bedrooms are required for building type.",
      }),
      bathrooms: Joi.number().integer().min(0).required().messages({
        "any.required": "Bathrooms are required for building type.",
      }),
    }),
  })
  .when(Joi.object({ propertyType: Joi.valid("land") }).unknown(), {
    then: Joi.object({
      landArea: Joi.number().greater(0).required().messages({
        "any.required": "Land area is required for land type.",
      }),
    }),
  })
  .when(Joi.object({ propertyType: Joi.valid("commercial") }).unknown(), {
    then: Joi.object({
      builtUpArea: Joi.number().greater(0).required().messages({
        "any.required": "Built-up area is required for commercial type.",
      }),
    }),
  });

module.exports = propertyValidationSchema;
