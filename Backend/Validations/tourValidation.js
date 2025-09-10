const Joi = require("joi");


const types = ["private", "group", "luxuryProperties", "guides", "cruises"];
const cabinTypes = ["interior", "oceanview", "balcony", "suite"];

// Regex for Base64 image string
const base64ImageRegex =
  /^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/]*={0,2}$/;

const tourValidationSchema = Joi.object({
  country: Joi.string()
    .required()
    .messages({
      "any.required": "Country is required.",
      "any.only": "Please select a valid country.",
    }),
  type: Joi.string()
    .valid(...types)
    .required()
    .messages({
      "any.required": "Type is required.",
      "any.only": "Please select a valid type.",
    }),
  title: Joi.string().min(3).max(100).required().messages({
    "string.base": "Title must be a string.",
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 3 characters long.",
    "any.required": "Title is required.",
  }),
  location: Joi.string().required().messages({
    "string.empty": "Location is required.",
    "any.required": "Location is required.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive number.",
    "any.required": "Price is required.",
  }),
  description: Joi.string().min(20).required(),
  images: Joi.array()
    .min(1)
    .max(4)
    .items(
      Joi.string().pattern(base64ImageRegex).messages({
        "string.pattern.base":
          "Each image must be a valid Base64 data URL (e.g., data:image/jpeg;base64,...)",
        "string.empty": "Image cannot be empty.",
      })
    )
    .required()
    .messages({
      "array.max": "You can upload a maximum of 4 images.",
      "array.min": "At least one image is required.",
      "any.required": "Images are required.",
    }),

  duration: Joi.string().when("type", {
    is: Joi.valid("privateTours", "smallGroupTours", "cruises"),
    then: Joi.required(),
  }),

  maxGuests: Joi.string().when("type", {
    is: Joi.valid("privateTours", "smallGroupTours"),
    then: Joi.required(),
  }),
  pickupSpot: Joi.string().when("type", {
    is: Joi.valid("privateTours", "smallGroupTours"),
    then: Joi.required(),
  }),
  tourType: Joi.string()
    .valid("private", "group")
    .when("type", {
      is: Joi.valid("privateTours", "smallGroupTours"),
      then: Joi.required(),
    }),
  address: Joi.string().when("type", {
    is: "luxuryProperties",
    then: Joi.required(),
  }),
  propertyType: Joi.string().when("type", {
    is: "luxuryProperties",
    then: Joi.required(),
  }),
  amenities: Joi.string().allow("").optional(),
  checkInTime: Joi.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .allow("")
    .optional(),
  checkOutTime: Joi.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .allow("")
    .optional(),
  speciality: Joi.string().when("type", { is: "guides", then: Joi.required() }),

  languages: Joi.string().allow("").optional(),
  experience: Joi.number().integer().min(0).allow("").optional(),
  ports: Joi.string().when("type", { is: "cruises", then: Joi.required() }),
  cabinType: Joi.string()
    .valid(...cabinTypes, "")
    .optional(),
  includes: Joi.string().allow("").optional(),
});

module.exports = { tourValidationSchema };
