const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
    {
        billId: {
            type: String,
            required: true,
            unique: true,
        },
        customerId: {
            type: String,
            required: true,
        },
        billType: {
            type: String,
            required: true,
            enum: ["water", "gas", "electricity", "school_fees", "other"],
        },
        issueDate: {
            type: Date,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        amountDue: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["unpaid", "paid", "overdue", "cancelled"],
            default: "unpaid",
        },
        serviceProvider: {
            type: String,
            required: true,
        },
        accountIdentifier: {
            type: String,
            required: true,
        },
        billingPeriod: {
            type: String,
            required: true,
        },
        studentName: {
            type: String,
            required: function () {
                return this.billType === "school_fees";
            },
        },
        gradeOrClass: {
            type: String,
            required: function () {
                return this.billType === "school_fees";
            },
        },
    },
    {
        timestamps: true,
    }
);

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
