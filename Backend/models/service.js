const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    serviceName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    tier: {
        type: String,
        required: true,
        enum: ["basic", "premium", "diamond"],
    },
    image: {
        url: {
            type: String,
            default: "https://via.placeholder.com/1920x800",
        },
        publicId: {
            type: String,
            default: "",
        },
    },
    status: {
        type: String,
        required: true,
    },
    vendorName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
        required: true,
    },
});

serviceSchema.index({ vendorId: 1 });

module.exports = mongoose.model("Service", serviceSchema);
