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

const productSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    typeOf: {
      type: String,
      required: true,
      enum: ["Groceries", "Tech", "Clothing"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    features: {
      type: [String],
      default: [],
    },
    warranty: {
      type: String,
      enum: ["yes", "no"],
    },
    warrantyConditions: {
      type: [String],
    },
    sizes: {
      type: [String],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex", "Kids", "Boys", "Girls"],
      default: "Unisex",
    },
    images: {
      type: [imagesSchema],
      validate: {
        validator: function (v) {
          return v.length <= 4;
        },
        message: "Products can have a maximum of 4 images.",
      },
    },
  },
  { timestamps: true }
);

productSchema.index({ serviceId: 1 });

module.exports = mongoose.model("Product", productSchema);
