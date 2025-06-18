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

const propertySchema = new mongoose.Schema(
    {
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true, // Each property must be associated with a service
        },
        // Basic Property Details
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5, // A good title should be descriptive
            maxlength: 100,
        },
        propertyType: {
            type: String,
            required: true,
            enum: [
                "house",
                "apartment",
                "villa",
                "condo",
                "cabin",
                "loft",
                "bungalow",
                "other",
            ], // Common property types
            lowercase: true,
        },
        pricePerNight: {
            type: Number,
            required: true,
            min: 0, // Price cannot be negative
        },
        availability: {
            type: String,
            required: true,
            enum: ["available", "unavailable", "draft"], // Status for listing
            default: "draft",
        },
        maxGuests: {
            type: Number,
            required: true,
            min: 1, // Must accommodate at least one guest
        },
        bedrooms: {
            type: Number,
            required: true,
            min: 0, // Can be a studio (0 bedrooms)
        },
        bathrooms: {
            type: Number,
            required: true,
            min: 0, // Can be 0 if only a half bath, or if it's a specific type of property
        },
        propertySize: {
            type: Number,
            min: 0, // Size can't be negative
        },
        sizeUnit: {
            type: String,
            enum: ["sqft", "sqm", "kanal", "marla"], // Added common units in Pakistan/AJK
            default: "sqft",
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 20, // A good description should be comprehensive
            maxlength: 2000,
        },
        features: [
            {
                type: String, // e.g., 'Wi-Fi', 'AC', 'Parking', 'Pool', 'Gym', 'Heater'
                trim: true,
            },
        ],
        images: {
            type: [imagesSchema],
            validate: {
                validator: function (v) {
                    return v.length <= 8;
                },
                message: "Property can have a maximum of 8 images.",
            },
        },
        // Location Fields
        addressLine1: {
            type: String,
            required: true,
            trim: true,
        },
        addressLine2: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
            default: "Mirpur", // Default to Mirpur as per context
        },
        stateRegion: {
            type: String,
            required: true,
            trim: true,
            default: "Azad Jammu and Kashmir", // Default to AJK
        },
        postalCode: {
            type: String,
            trim: true,
            match: /^\d{5}$/, // Example: 5-digit postal code pattern in Pakistan, adjust if needed
        },
        country: {
            type: String,
            required: true,
            trim: true,
            default: "Pakistan",
        },
        mapLink: {
            type: String, // URL to Google Maps or similar
            trim: true,
            // Optional: you might add a regex for URL validation if desired
        },
        // For geospatial queries, consider adding 'location' with 'type: Point'
        // location: {
        //     type: {
        //         type: String,
        //         enum: ['Point'],
        //         required: true
        //     },
        //     coordinates: {
        //         type: [Number], // [longitude, latitude]
        //         required: true
        //     }
        // },

        // Pricing Details
        minimumNights: {
            type: Number,
            min: 1,
            default: 1,
        },
        cleaningFee: {
            type: Number,
            min: 0,
            default: 0,
        },
        securityDeposit: {
            type: Number,
            min: 0,
            default: 0,
        },

        // Check-in/out Times
        checkinTime: {
            type: String, // Consider 'HH:MM' format, e.g., '15:00'
            required: true,
            match: /^(?:2[0-3]|[01]?[0-9]):(?:[0-5]?[0-9])$/, // Basic HH:MM format
        },
        checkoutTime: {
            type: String, // Consider 'HH:MM' format, e.g., '11:00'
            required: true,
            match: /^(?:2[0-3]|[01]?[0-9]):(?:[0-5]?[0-9])$/,
        },

        // Policies
        smokingPolicy: {
            type: String,
            enum: ["no-smoking", "smoking-allowed", "designated-area"],
            default: "no-smoking",
        },
        petPolicy: {
            type: String,
            enum: ["no-pets", "small-pets-allowed", "all-pets-allowed"],
            default: "no-pets",
        },
        partyPolicy: {
            type: String,
            enum: [
                "no-parties",
                "parties-allowed-with-approval",
                "parties-allowed",
            ],
            default: "no-parties",
        },
        quietHours: {
            type: String, // e.g., '10 PM - 8 AM'
            trim: true,
        },

        // Access & Interaction
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
        timestamps: true, // Automatically manage createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("Property", propertySchema);
