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

const roomSchema = new mongoose.Schema(
    {
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true, // Each room must be associated with a service
        },
        // Basic Room Details
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 100,
        },
        roomType: {
            type: String,
            required: true,

            lowercase: true,
        },
        price: {
            // Changed from 'pricePerNight' to simply 'price' as per your JSON
            type: Number,
            required: true,
            min: 0,
        },
        availability: {
            type: String,
            required: true,
            enum: ["available", "unavailable", "booked"], // 'booked' for specific room status
            default: "available",
        },
        maxGuests: {
            type: Number,
            required: true,
            min: 1,
        },
        bedType: {
            type: String,
            required: true,

            lowercase: true,
        },
        size: {
            // Represents the size of the room
            type: Number,
            min: 0,
        },
        sizeUnit: {
            // Adding size unit, as it's good practice for numerical sizes
            type: String,
            enum: ["sqft", "sqm"],
            default: "sqft",
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 20,
            maxlength: 1000, // Slightly shorter than property description
        },
        features: [
            {
                type: String, // e.g., 'AC', 'Private Bathroom', 'Balcony', 'Desk'
                trim: true,
            },
        ],
        images: {
            type: [imagesSchema],
            validate: {
                validator: function (v) {
                    return v.length <= 8;
                },
                message: "A Room can have a maximum of 4 images.",
            },
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

module.exports = mongoose.model("Room", roomSchema);
