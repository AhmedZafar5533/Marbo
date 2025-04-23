const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
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
    description: {
        type: String,
        required: true,
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
});

serviceSchema.index({ vendorId: 1 });

module.exports = mongoose.model("Service", serviceSchema);
