const mongoose = require("mongoose");

const moneyTransferSchema = new mongoose.Schema(
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
    fromCurrency: {
      type: String,
      required: true,
    },
    toCurrency: {
      type: String,
      required: true,
    },
    exchangeRate: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
    convertedAmount: {
      type: Number,
      required: true,
    },

    deliveryMethod: {
      type: String,
      required: true,
      enum: ["bank", "pickup"],
    },

    recipientId: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: function () {
        return this.deliveryMethod === "bank";
      },
    },
    bankName: {
      type: String,
      required: function () {
        return this.deliveryMethod === "bank";
      },
    },
    recipientName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const MoneyTransfer = mongoose.model("MoneyTransfer", moneyTransferSchema);
module.exports = MoneyTransfer;
