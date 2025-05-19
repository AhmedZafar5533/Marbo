const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
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
});

const Contact = mongoose.model("ContactUs", contactUsSchema);
module.exports = Contact;
