const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema(
    {
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
        price: {
            type: Number,
            required: true,
        },
        subscriptionType: {
            type: String,
            required: true,
        },
        billingCycle: {
            type: String,
            required: true,
            enum: ["Monthly", "Annually"],
            default: "Monthly",
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },

        status: {
            type: String,
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

subscriptionSchema.index({ vendorId: 1 }, { unique: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
