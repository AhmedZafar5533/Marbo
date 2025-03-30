const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 300,
    },
    attempts: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    generationAttempts: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5,
    },
    resetTime: {
        type: Date,
        required: true,
        default: new Date(Date.now() + 5 * 60 * 1000),
    },
});

otpSchema.index({ userId: 1 });
module.exports = mongoose.model("Otp", otpSchema);
