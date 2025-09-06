const mongoose = require("mongoose");
const { Schema } = mongoose;

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

const TourSchema = new Schema(
  {
    country: {
      type: String,
      required: [true, "Country is required."],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Service",
    },
    type: {
      type: String,
      required: [true, "Type is required."],
      enum: ["private", "group", "luxuryProperties", "guides", "cruises"],
    },
    title: {
      type: String,
      trim: true,
      minlength: [3, "Title must be at least 3 characters long."],
      maxlength: [100, "Title cannot be more than 100 characters long."],
      required: true,
    },
    location: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price must be a positive number."],
    },
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
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for reviews.",
      },
    },
    images: {
      type: [imagesSchema],
      validate: {
        validator: function (v) {
          return v.length <= 8;
        },
        message: "Property can have a maximum of 8 images.",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      minlength: [20, "Description must be at least 20 characters long."],
    },
    duration: {
      type: String,
      required: function () {
        return ["tour", "cruises"].includes(this.type);
      },
    },
    maxGuests: {
      type: String,
      required: function () {
        return this.type === "tour";
      },
    },
    pickupSpot: {
      type: String,
      required: function () {
        return this.type === "tour";
      },
    },
    tourType: {
      type: String,
      enum: ["private", "group"],
      required: function () {
        return this.type === "tour";
      },
    },
    address: {
      type: String,
      required: function () {
        return this.type === "luxuryProperties";
      },
    },
    propertyType: {
      type: String,
      required: function () {
        return this.type === "luxuryProperties";
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    checkInTime: String,
    checkOutTime: String,
    guideName: {
      type: String,
      required: function () {
        return this.type === "guides";
      },
    },
    speciality: {
      type: String,
      required: function () {
        return this.type === "guides";
      },
    },
    citiesAvailable: {
      type: String,
      required: function () {
        return this.type === "guides";
      },
    },
    languages: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      min: 0,
    },
    shipName: {
      type: String,
      required: function () {
        return this.type === "cruises";
      },
    },
    ports: {
      type: String,
      required: function () {
        return this.type === "cruises";
      },
    },
    cabinType: {
      type: String,
      enum: ["interior", "oceanview", "balcony", "suite"],
    },
    includes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

TourSchema.pre("save", function (next) {
  if (this.isModified("guideName") && this.type === "guides") {
    this.title = this.guideName;
  }
  next();
});

const Tour = mongoose.model("Tour", TourSchema);
module.exports = Tour;
