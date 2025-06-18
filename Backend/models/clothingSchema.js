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

const clothingSchema = new mongoose.Schema(
    {
        // Unique identifier for the service associated with the product
        serviceId: {
            type: mongoose.Schema.Types.ObjectId, // Assuming this references another service document
            ref: "Service", // Name of the referenced service model
            required: true,
        },
        // Name of the product (e.g., "Men's Running Shoes")
        productName: {
            type: String,
            required: true,
            trim: true, // Removes whitespace from both ends of a string
            minlength: 3, // Minimum length for the product name
            maxlength: 100, // Maximum length for the product name
        },
        // Product category (e.g., "Footwear", "Apparel", "Electronics")
        category: {
            type: String,
            required: true,
            trim: true,
        },
        // Brand of the product (e.g., "Nike", "Adidas")
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        // Price of the product
        price: {
            type: Number,
            required: true,
            min: 0, // Price cannot be negative
        },
        // Available quantity of the product
        quantity: {
            type: Number,
            required: true,
            min: 0, // Quantity cannot be negative
        },
        // Detailed description of the product
        description: {
            type: String,
            trim: true,
            maxlength: 2000, // Limit description length
        },
        // Array of strings for product features (e.g., ["Waterproof", "Breathable"])
        features: [
            {
                type: String,
                trim: true,
            },
        ],
        // Array of strings for image URLs of the product
        images: [
            {
                type: String,
                trim: true,
                // You might add a custom validator here for URL format if needed
            },
        ],
        // Array of strings for available sizes (e.g., ["S", "M", "L"] or ["7", "8", "9"])
        sizes: [
            {
                type: String,
                trim: true,
            },
        ],
        // Array of strings for available colors (e.g., ["Red", "Blue", "Black"])
        images: {
            type: [imagesSchema],
            validate: {
                validator: function (v) {
                    return v.length <= 8;
                },
                message: "A Product can have a maximum of 4 images.",
            },
        },
        // Target gender for the product (e.g., "Male", "Female", "Unisex")
        gender: {
            type: String,
            enum: ["Men", "Women", "Unisex", "Kids", "Boys", "Girls"], // Restrict to specific values
            default: "Unisex", // Default value if not provided
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

// Create and export the Mongoose model
const Clothing = mongoose.model("Clothing", clothingSchema);

module.exports = Clothing;
