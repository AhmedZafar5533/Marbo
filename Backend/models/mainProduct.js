const mongoose = require("mongoose");

const mainProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
    discriminatorKey: "productType",
    collection: "mainproducts",
  }
);

mainProductSchema.index({
  name: "text",
  description: "text",
  tags: "text",
  type: "text",
});

module.exports = mongoose.model("MainProduct", mainProductSchema);
