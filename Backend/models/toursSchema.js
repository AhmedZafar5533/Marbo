const mongoose = require("mongoose");
const mainProduct = require("./mainProduct");
const { Schema } = mongoose;

// This sub-schema remains the same but will be used within the main schema
const imagesSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false } // No need for separate IDs on image entries
);

// --- NEW SUB-SCHEMAS FOR TOUR DETAILS ---

// New sub-schema for the daily itinerary
const itinerarySchema = new Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    plan: {
      type: String,
      required: true,
      minlength: [10, "Itinerary plan must be at least 10 characters long."],
    },
    meals: {
      type: String,
      enum: ["none", "breakfast", "half-board", "full-board"],
      default: "none",
    },
  },
  { _id: false }
);

// New sub-schema for the structured, detailed inclusions
const detailedInclusionsSchema = new Schema(
  {
    accommodation: { type: [String], default: [] },
    transfers: { type: [String], default: [] },
    sightseeing: { type: [String], default: [] },
    domesticFlights: { type: [String], default: [] },
    freeItems: { type: [String], default: [] },
  },
  { _id: false }
);

// --- THE MAIN UPDATED TOUR SCHEMA ---

const TourSchema = new Schema({
  country: {
    type: String,
    required: [true, "Country is required."],
  },
  // serviceId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: "Service",
  // },
  // type: {
  //   type: String,
  //   required: [true, "Type is required."],
  //   enum: [
  //     "privateTour",
  //     "smallGroupTour",
  //     "luxuryProperties",
  //     "guides",
  //     "cruises",
  //   ],
  // },
  // title: {
  //   type: String,
  //   trim: true,
  //   minlength: [3, "Title must be at least 3 characters long."],
  //   maxlength: [100, "Title cannot be more than 100 characters long."],
  //   required: [true, "A name or title is required."],
  // },
  location: {
    type: String,
    required: [true, "Location is required."],
    trim: true,
  },
  price: {
    type: Number,
    min: [0, "Price must be a positive number."],
    required: function () {
      return this.type === "tour";
    },
  },
  // description: {
  //   type: String,
  //   required: [true, "Description is required."],
  //   minlength: [20, "Description must be at least 20 characters long."],
  // },
  images: {
    type: [imagesSchema],
    validate: {
      // Updated validation to match the form's limit
      validator: function (v) {
        return v.length > 0 && v.length <= 4;
      },
      message: "You must provide between 1 and 4 images.",
    },
  },
  // These fields are not on the create form but are useful for later operations
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0,
  },

  // --- TOUR-SPECIFIC FIELDS ---
  duration: {
    type: Number, // Changed to Number for easier calculations
    min: 1,
    required: function () {
      return this.type === "tour";
    },
  },
  operates: {
    type: String,
    enum: ["everyday", "selected"],
    required: function () {
      return this.type === "tour";
    },
  },
  selectedDays: {
    type: [String],
    // This is only required if 'operates' is 'selected', which can be enforced in the controller/service layer
    default: [],
  },
  inclusions: {
    type: [String],
    default: [],
  },
  exclusions: {
    type: [String],
    default: [],
  },
  itinerary: {
    type: [itinerarySchema],
    required: function () {
      return this.type === "tour";
    },
  },
  detailedInclusions: {
    type: detailedInclusionsSchema,
    required: function () {
      return this.type === "tour";
    },
  },

  category: {
    type: String,
    required: [true, "Type is required."],
    enum: [
      "privateTours",
      "smallGroupTour",
      "luxuryProperties",
      "guides",
      "cruises",
    ],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: function () {
      return this.type === "guides";
    },
  },
  spokenLanguages: {
    type: [String],
    default: [],
  },
});

TourSchema.index({ location: "text", country: "text" });

const Tour = mainProduct.discriminator("Tour", TourSchema);
module.exports = Tour;
