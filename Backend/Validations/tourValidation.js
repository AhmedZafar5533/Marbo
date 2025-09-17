const Joi = require("joi");

// Allowed types
const types = [
  "privateTour",
  "smallGroupTour",
  "luxuryProperties",
  "guides",
  "cruises",
];

// Regex for Base64 image string
const base64ImageRegex =
  /^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/]*={0,2}$/;

const tourValidationSchema = Joi.object({
  // --- BASIC INFORMATION (COMMON TO ALL TYPES) ---
  country: Joi.string().required().messages({
    "string.empty": "Country is required.",
    "any.required": "Country is required.",
  }),
  category: Joi.string()
    .valid(...types)
    .required()
    .messages({
      "any.required": "Type is required.",
      "any.only": "Please select a valid type.",
    }),
  type: Joi.string().required().messages({
    "string.empty": "Type is required.",
    "any.required": "Type is required.",
  }),
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "A name or title is required.",
    "string.min": "name must be at least 3 characters long.",
    "any.required": "A name or title is required.",
  }),
  location: Joi.string().required().messages({
    "string.empty": "Location is required.",
    "any.required": "Location is required.",
  }),
  description: Joi.string().min(20).required().messages({
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 20 characters long.",
    "any.required": "Description is required.",
  }),
  images: Joi.array()
    .min(1)
    .max(4)
    .items(
      Joi.string().pattern(base64ImageRegex).messages({
        "string.pattern.base": "Each image must be a valid Base64 data URL.",
      })
    )
    .required()
    .messages({
      "array.min": "At least one image is required.",
      "array.max": "You can upload a maximum of 4 images.",
      "any.required": "Images are required.",
    }),

  // --- CONDITIONAL PRICE (ONLY FOR TOURS) ---
  price: Joi.number()
    .positive()
    .when("category", {
      is: Joi.valid("smallGroupTour", "privateTour"),
      then: Joi.required().messages({
        "any.required": "Price is required for tours.",
      }),
      otherwise: Joi.forbidden(),
    }),

  // --- TOUR-SPECIFIC FIELDS ---
  duration: Joi.number()
    .positive()
    .integer()
    .when("category", {
      is: Joi.valid("smallGroupTour", "privateTour"),
      then: Joi.required().messages({
        "any.required": "Number of days is required.",
      }),
      otherwise: Joi.forbidden(),
    }),
  operates: Joi.string()
    .valid("everyday", "selected")
    .when("category", {
      is: Joi.valid("smallGroupTour", "privateTour"),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  selectedDays: Joi.array()
    .items(Joi.string())
    .when("operates", {
      is: "selected",
      then: Joi.array().min(1).required().messages({
        "array.min": "Please select at least one day of operation.",
      }),
      otherwise: Joi.optional(),
    }),
  inclusions: Joi.array()
    .items(Joi.string().allow(""))
    .when("category", {
      is: Joi.valid("smallGroupTour", "privateTour"),
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }),
  exclusions: Joi.array()
    .items(Joi.string().allow(""))
    .when("category", {
      is: Joi.valid("smallGroupTour", "privateTour"),
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }),
  itinerary: Joi.array()
    .items(
      Joi.object({
        day: Joi.number().integer().positive().required(),
        plan: Joi.string().min(10).required().messages({
          "string.empty": "The itinerary plan cannot be empty.",
          "string.min": "The plan must be at least 10 characters long.",
        }),
        meals: Joi.string()
          .valid("none", "breakfast", "half-board", "full-board")
          .required(),
      })
    )
    .when("category", {
      is: Joi.valid("smallGroupTour", "privateTour"),
      then: Joi.array().min(1).required(),
      otherwise: Joi.forbidden(),
    }),
  detailedInclusions: Joi.object({
    accommodation: Joi.array().items(Joi.string().allow("")).optional(),
    transfers: Joi.array().items(Joi.string().allow("")).optional(),
    sightseeing: Joi.array().items(Joi.string().allow("")).optional(),
    domesticFlights: Joi.array().items(Joi.string().allow("")).optional(),
    freeItems: Joi.array().items(Joi.string().allow("")).optional(),
  }).when("category", {
    is: Joi.valid("smallGroupTour", "privateTour"),
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),

  // --- GUIDE-SPECIFIC FIELDS ---
  gender: Joi.string()
    .valid("male", "female", "other")
    .when("category", {
      is: "guides",
      then: Joi.required().messages({
        "any.required": "Gender is required for guides.",
      }),
      otherwise: Joi.forbidden(),
    }),
  spokenLanguages: Joi.array().items(Joi.string().allow("")).when("category", {
    is: "guides",
    then: Joi.optional(),
    otherwise: Joi.forbidden(),
  }),
});

module.exports = { tourValidationSchema };
