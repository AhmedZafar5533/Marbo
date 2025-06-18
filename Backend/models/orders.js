const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
    },
    serviceType: {
        type: String,
        enum: ["Product", "Standard"],
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
    status: {
        type: String,
        enum: ["Processing", "Completed", "Cancelled"],
        default: "Processing",
    },
    isPaid: {
        type: Boolean,
        default: false,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    startingDate: {
        type: String,
    },
    endingDate: {
        type: String,
    },
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
