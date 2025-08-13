const mongoose = require("mongoose");

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
  { _id: false, timestamps: true }
);

const unifiedPropertySchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true, // Each property/room must be associated with a service
    },

    // Type Discriminator
    typeOf: {
      type: String,
      required: true,
      enum: ["property", "room"],
      lowercase: true,
    },

    // Basic Details (Common to both)
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },

    // Property Type OR Room Type (conditional based on typeOf)
    propertyType: {
      type: String,
      required: function () {
        return this.typeOf === "property";
      },
      enum: [
        "house",
        "apartment",
        "villa",
        "condo",
        "cabin",
        "loft",
        "bungalow",
        "other",
      ],
      lowercase: true,
    },
    roomType: {
      type: String,
      required: function () {
        return this.typeOf === "room";
      },
      lowercase: true,
    },

    // Pricing (different field names but same concept)
    pricePerNight: {
      type: Number,
      required: function () {
        return this.typeOf === "property";
      },
      min: 0,
    },
    price: {
      type: Number,
      required: function () {
        return this.typeOf === "room";
      },
      min: 0,
    },

    availability: {
      type: String,
      required: true,
      enum: function () {
        if (this.typeOf === "property") {
          return ["available", "unavailable", "draft"];
        } else {
          return ["available", "unavailable", "booked"];
        }
      },
      default: function () {
        return this.typeOf === "property" ? "draft" : "available";
      },
    },

    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },

    // Property-specific fields
    bedrooms: {
      type: Number,
      required: function () {
        return this.typeOf === "property";
      },
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: function () {
        return this.typeOf === "property";
      },
      min: 0,
    },

    // Room-specific field
    bedType: {
      type: String,
      required: function () {
        return this.typeOf === "room";
      },
      lowercase: true,
    },

    // Size (common but different field names)
    propertySize: {
      type: Number,
      required: function () {
        return this.typeOf === "property";
      },
      min: 0,
    },
    size: {
      type: Number,
      required: function () {
        return this.typeOf === "room";
      },
      min: 0,
    },

    sizeUnit: {
      type: String,
      enum: function () {
        if (this.typeOf === "property") {
          return ["sqft", "sqm", "kanal", "marla"];
        } else {
          return ["sqft", "sqm"];
        }
      },
      default: "sqft",
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: function () {
        return this.typeOf === "property" ? 2000 : 1000;
      },
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    images: {
      type: [imagesSchema],
      validate: {
        validator: function (v) {
          const maxImages = this.typeOf === "property" ? 8 : 4;
          return v.length <= maxImages;
        },
        message: function (props) {
          const maxImages = this.typeOf === "property" ? 8 : 4;
          const itemType = this.typeOf === "property" ? "Property" : "Room";
          return `${itemType} can have a maximum of ${maxImages} images.`;
        },
      },
    },

    // Location Fields (Property-specific)
    addressLine1: {
      type: String,
      required: function () {
        return this.typeOf === "property";
      },
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: function () {
        return this.typeOf === "property";
      },
      trim: true,
      default: "Mirpur",
    },
    stateRegion: {
      type: String,
      required: function () {
        return this.typeOf === "property";
      },
      trim: true,
      default: "Azad Jammu and Kashmir",
    },
    postalCode: {
      type: String,
      trim: true,
      match: /^\d{5}$/,
    },
    country: {
      type: String,
      required: function () {
        return this.typeOf === "property";
      },
      trim: true,
      default: "Pakistan",
    },
    mapLink: {
      type: String,
      trim: true,
    },

    // Pricing Details (Property-specific)
    minimumNights: {
      type: Number,
      min: 1,
      default: function () {
        return this.typeOf === "property" ? 1 : undefined;
      },
    },
    cleaningFee: {
      type: Number,
      min: 0,
      default: function () {
        return this.typeOf === "property" ? 0 : undefined;
      },
    },
    securityDeposit: {
      type: Number,
      min: 0,
      default: function () {
        return this.typeOf === "property" ? 0 : undefined;
      },
    },

    // Check-in/out Times (Property-specific)
    checkinTime: {
      type: String,
      required: function () {
        return this.typeOf === "property";
      },
      match: /^(?:2[0-3]|[01]?[0-9]):(?:[0-5]?[0-9])$/,
    },
    checkoutTime: {
      type: String,
      required: function () {
        return this.typeOf === "property";
      },
      match: /^(?:2[0-3]|[01]?[0-9]):(?:[0-5]?[0-9])$/,
    },

    // Policies (Property-specific)
    smokingPolicy: {
      type: String,
      enum: ["no-smoking", "smoking-allowed", "designated-area"],
      default: function () {
        return this.typeOf === "property" ? "no-smoking" : undefined;
      },
    },
    petPolicy: {
      type: String,
      enum: ["no-pets", "small-pets-allowed", "all-pets-allowed"],
      default: function () {
        return this.typeOf === "property" ? "no-pets" : undefined;
      },
    },
    partyPolicy: {
      type: String,
      enum: ["no-parties", "parties-allowed-with-approval", "parties-allowed"],
      default: function () {
        return this.typeOf === "property" ? "no-parties" : undefined;
      },
    },
    quietHours: {
      type: String,
      trim: true,
    },

    // Access & Interaction (Property-specific)
    accessDescription: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    hostInteraction: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
unifiedPropertySchema.index({ serviceId: 1, typeOf: 1 });
unifiedPropertySchema.index({ typeOf: 1, availability: 1 });

// Add a virtual to get the appropriate price field
unifiedPropertySchema.virtual("actualPrice").get(function () {
  return this.typeOf === "property" ? this.pricePerNight : this.price;
});

// Add a virtual to get the appropriate size field
unifiedPropertySchema.virtual("actualSize").get(function () {
  return this.typeOf === "property" ? this.propertySize : this.size;
});

module.exports = mongoose.model("Property", unifiedPropertySchema);
