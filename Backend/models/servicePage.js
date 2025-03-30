const mongoose = require("mongoose");

// Header Section Schema
const headerSectionSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            default: "Transform Your Business with Digital Excellence",
        },
        description: {
            type: String,
            default:
                "Empower your organization with cutting-edge digital solutions tailored to your unique business needs. Start your transformation journey today.",
        },
        image: {
            url: {
                type: String,
                default: "https://via.placeholder.com/1920x800",
            },
            isCloudinary: {
                type: Boolean,
                default: false,
            },
            publicId: {
                type: String,
                default: "",
            },
        },
        gradientOpacity: { type: Number, default: 0.8 },
        textColor: { type: String, default: "#ffffff" },
    },
    { _id: false }
);

// About Section Schema
const aboutSectionSchema = new mongoose.Schema(
    {
        title: { type: String, default: "About Our Digital Solutions" },
        content: {
            type: String,
            default:
                "We specialize in creating transformative digital experiences that drive business growth and customer engagement. Our team combines technical expertise with creative vision to deliver cutting-edge solutions.",
        },
        image: {
            url: {
                type: String,
                default: "https://via.placeholder.com/1920x800",
            },
            isCloudinary: {
                type: Boolean,
                default: false,
            },
            publicId: {
                type: String,
                default: "",
            },
        },
    },
    { _id: false }
);

// Feature Item Schema
const featureItemSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
    },
    { _id: false }
);

const featuresSectionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: "Powerful Features for Modern Businesses",
        },
        content: {
            type: String,
            default:
                "Discover how our comprehensive suite of tools can revolutionize your operations and customer engagement.",
        },
        features: [featureItemSchema],
        image: {
            url: {
                type: String,
                default: "https://via.placeholder.com/1920x800",
            },
            isCloudinary: {
                type: Boolean,
                default: false,
            },
            publicId: {
                type: String,
                default: "",
            },
        },
    },
    { _id: false }
);

// Pricing Feature Schema
const pricingFeatureSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
    },
    { _id: false }
);

// Pricing Card Schema
const pricingCardSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        price: { type: String, required: true },
        description: { type: String, required: true },
        features: [pricingFeatureSchema],
    },
    { _id: false }
);

// Pricing Section Schema
const pricingSectionSchema = new mongoose.Schema(
    {
        cards: [pricingCardSchema],
    },
    { _id: false }
);

const stepSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
    },
    { _id: false }
);

const howItWorksSectionSchema = new mongoose.Schema(
    {
        title: { type: String, default: "How We Drive Your Digital Success" },
        description: {
            type: String,
            default: "A simple three-step process to transform your business",
        },
        steps: [stepSchema],
    },
    { _id: false }
);

const pageSchema = new mongoose.Schema(
    {
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        header: headerSectionSchema,
        about: aboutSectionSchema,
        features: featuresSectionSchema,
        pricing: pricingSectionSchema,
        howItWorks: howItWorksSectionSchema,

        isActive: {
            type: Boolean,
            default: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        isInitialized: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

pageSchema.index({ serviceId: 1 }, { unique: true });

module.exports = mongoose.model("Page", pageSchema);
