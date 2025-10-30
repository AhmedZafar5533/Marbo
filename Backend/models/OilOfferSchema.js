const mongoose = require("mongoose");
const mainProduct = require("./mainProduct");
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

const oilOfferSchema = new Schema(
  {
    pricePerLiter: {
      type: Number,
      required: [true, "Price per liter is required"],
      min: [0.01, "Price must be a positive number"],
    },

    /**
     * The maximum number of liters a customer can buy under this offer.
     */
    maxLimit: {
      type: Number,
      required: [true, "Max purchase limit in liters is required"],
      min: [1, "Max limit must be at least 1 liter"],
      // Using a custom setter to ensure the value is an integer
      set: (val) => Math.round(val),
    },

    /**
     * The duration in months for which the purchased voucher is valid.
     */
    voucherValidity: {
      type: Number, // Stored in months
      required: [true, "Voucher validity in months is required"],
      min: [1, "Voucher must be valid for at least 1 month"],
      set: (val) => Math.round(val),
    },

    /**
     * A detailed description of the offer, including terms and conditions.
     */
    description: {
      type: String,
      required: [true, "A description of the offer is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    /**
     * URL of the promotional image for the offer.
     * The backend service will handle converting the base64 upload to a stored image URL.
     */
    image: {
      type: imagesSchema,
    },
  },
  {
    /**
     * Automatically adds `createdAt` and `updatedAt` timestamp fields.
     */
    timestamps: true,
  }
);

const OilOffer = mainProduct.discriminator("OilOffer", oilOfferSchema);
module.exports = OilOffer;
