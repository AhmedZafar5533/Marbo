const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
