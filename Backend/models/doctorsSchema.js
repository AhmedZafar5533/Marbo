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
        includedItems: [
            {
                type: String,
                required: true,
            },
        ],
    },
    { _id: false }
);

const doctorsSchema = new mongoose.Schema({
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

const Doctor = mongoose.model("Doctor", doctorsSchema);
module.exports = Doctor;
