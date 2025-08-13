const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  imageUrl: String,
});

const serviceOrderSchema = new mongoose.Schema(
  {
    mainOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainOrder",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [itemSchema],
    itemCount: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    isPaid: { type: Boolean, default: false, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    subDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const ServiceOrder = mongoose.model("ServiceOrder", serviceOrderSchema);
module.exports = ServiceOrder;
