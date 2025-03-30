const mongoose = require("mongoose");

const businessDetailsSchema = new mongoose.Schema(
    {
        businessName: { type: String, required: true },
        legalBusinessName: { type: String, required: true },
        businessType: { type: String, required: true },
        businessIndustry: { type: String, required: true },
        registrationNumber: { type: String, required: true, unique: true },
    },
    { _id: false } 
);

const businessContactSchema = new mongoose.Schema(
    {
        businessEmail: { type: String, required: true, unique: true },
        businessPhone: { type: String, required: true },
        website: { type: String },
    },
    { _id: false }
);

const ownerDetailsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        nationality: { type: String, required: true },
        identificationType: {
            type: String,
            enum: ["Passport", "Driver's License", "National ID"],
            required: true,
        },
        identificationNumber: { type: String, required: true },
        ownerPhoto: { type: String },
        ownerDocumentPhoto: { type: String },
    },
    { _id: false }
);

const contactPersonSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        title: { type: String },
    },
    { _id: false }
);

const businessAddressSchema = new mongoose.Schema(
    {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
    },
    { _id: false }
);

const vendorSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        businessDetails: businessDetailsSchema,
        businessContact: businessContactSchema,
        ownerDetails: ownerDetailsSchema,
        contactPerson: contactPersonSchema, 
        businessAddress: businessAddressSchema,
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

vendorSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Vendor", vendorSchema);
