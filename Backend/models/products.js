const mongoose = require("mongoose");
const mainProduct = require("./mainProduct");

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
    price: {
      type: Number,
      required: true,
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

    quantity: {
      type: Number,
      required: true,
      min: 0,
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

productSchema.index({
  category: "text",
});

const Product = mainProduct.discriminator("Product", productSchema);

module.exports = Product;
