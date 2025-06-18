const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        days: {
            type: String,
            required: true,
        },

        rate: {
            type: Number,
            required: true,
        },
        includedThings: [
            {
                type: String,
                required: true,
            },
        ],
    },
    { _id: false }
);

const domesticStaffingSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    schedule: {
        type: [scheduleSchema],
        required: true,
    },
});

const DomesticStaffing = mongoose.model(
    "DomesticStaffing",
    domesticStaffingSchema
);
module.exports = DomesticStaffing;
