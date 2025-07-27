const mongoose = require("mongoose");

const activeServicesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("ActiveServices", activeServicesSchema);
