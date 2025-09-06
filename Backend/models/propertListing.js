const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    // General details
    title: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      required: true,
      enum: ["building", "land", "commercial"],
    },
    salePrice: { type: Number, required: true },
    propertyStatus: {
      type: String,
      enum: ["available", "sold", "pending"],
      default: "available",
    },
    description: { type: String, trim: true },
    features: [{ type: String }],
    images: [{ type: String }],

    // Building specific fields
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    floors: { type: Number, min: 0 },
    totalFloors: { type: Number, min: 0 },
    propertySize: { type: Number, min: 0 },
    sizeUnit: { type: String, enum: ["sqft", "sqyd", "sqm"], default: "sqft" },
    buildingAge: { type: String },
    furnishingStatus: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "furnished"],
      default: "unfurnished",
    },
    facing: { type: String },

    // Land specific fields
    landArea: { type: Number, min: 0 },
    landUnit: {
      type: String,
      enum: ["sqft", "sqyd", "acre", "hectare"],
      default: "sqft",
    },
    landType: { type: String },
    soilType: { type: String },
    waterAvailability: { type: String },
    electricityAvailability: { type: String },
    roadAccess: { type: String },

    // Commercial specific fields
    builtUpArea: { type: Number, min: 0 },
    carpetArea: { type: Number, min: 0 },
    floorNumber: { type: Number },
    washrooms: { type: Number, min: 0 },
    cafeteria: { type: Boolean, default: false },
    conferenceRoom: { type: Boolean, default: false },
    reception: { type: Boolean, default: false },

    // Location fields
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String, required: true },
    stateRegion: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "Pakistan" },
    mapLink: { type: String },

    // Legal & Additional
    ownershipType: { type: String },
    approvals: [{ type: String }],
    nearbyFacilities: [{ type: String }],
    parkingSpaces: { type: Number, min: 0 },

    // Flags
    negotiable: { type: Boolean, default: false },
    readyToMove: { type: Boolean, default: false },
    loanAvailable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
