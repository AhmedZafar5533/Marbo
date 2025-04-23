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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
