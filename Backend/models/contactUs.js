const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    useId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
    },
    replied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("ContactUs", contactUsSchema);
module.exports = Contact;
